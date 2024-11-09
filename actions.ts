"use server";

import { prisma } from "@/utils/db";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CreatePaymentRequest {
  id?: string;
  checkoutId: number;
  amount: number;
  expiration: number;
  status: string | null;
  paymentCode?: string | null;
  paymentUrl?: string | null;
  customerName: string;
  customerEmail: string;
  customerTax: string | null;
  transactionId?: string | null;
}

export async function createPayment(data: CreatePaymentRequest) {
  try {
    const payment = await prisma.payment.create({
      data,
    });

    return payment;
  } catch (err) {
    throw new Error(
      `Error to create payment instance in database. ${(err as Error).message}`
    );
  }
}

export interface UpdatePaymentRequest {
  id: string;
  checkoutId: number;
  amount: number;
  expiration: number;
  status: string | null;
  paymentCode?: string | null;
  paymentUrl?: string | null;
  customerName: string;
  customerEmail: string;
  customerTax: string | null;
  transactionId?: string | null;
  paymentDate?: Date | null;
}

export async function updatePayment(data: UpdatePaymentRequest) {
  try {
    const payment = await prisma.payment.update({
      where: {
        id: data.id,
      },
      data,
    });

    return payment;
  } catch (err) {
    throw new Error(
      `Error to create payment instance in database. ${(err as Error).message}`
    );
  }
}

export async function updateMetrics(id: number, conversions?: boolean) {
  const checkout = await prisma.checkout.findUnique({
    where: {
      id,
    },
  });

  if (!checkout) throw new Error("Checkout not found");

  await prisma.checkout.update({
    where: {
      id,
    },
    data: {
      conversions: conversions
        ? checkout?.conversions + 1
        : checkout.conversions,
    },
  });
}

export interface WeeklyMetricsResponse {
  day: string;
  impressions: number;
  conversions: number;
}

export async function getMetricsByDayOfWeek(): Promise<{
  last7Days: WeeklyMetricsResponse[];
  weekData: any;
}> {
  const endDate = new Date();
  const startDate = subDays(endDate, 6);

  const data = await prisma.checkout.groupBy({
    by: ["updatedAt"],
    _sum: {
      impressions: true,
      conversions: true,
    },
    where: {
      updatedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  const newData = await prisma.payment.groupBy({
    by: ["createdAt"],
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: "credited",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const weekData = Array.from({ length: 7 })
    .map((_, index) => {
      const date = subDays(endDate, index);
      return {
        day: format(date, "EEEE", { locale: ptBR }),
        amount: 0,
      };
    })
    .reverse();

  newData.forEach((item) => {
    const dayName = format(item.createdAt, "EEEE", { locale: ptBR });
    const existingDay = weekData.find((d) => d.day === dayName);

    if (existingDay) {
      existingDay.amount = item._sum.amount || 0;
    }
  });

  const last7Days = Array.from({ length: 7 })
    .map((_, index) => {
      const date = subDays(endDate, index);
      return {
        day: format(date, "EEEE", { locale: ptBR }),
        impressions: 0,
        conversions: 0,
      };
    })
    .reverse();

  data.forEach((item) => {
    const dayName = format(item.updatedAt, "EEEE", { locale: ptBR });
    const existingDay = last7Days.find((d) => d.day === dayName);

    if (existingDay) {
      existingDay.impressions = item._sum.impressions || 0;
      existingDay.conversions = item._sum.conversions || 0;
    }
  });

  return { last7Days, weekData };
}

export async function checkPaymentStatus(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) throw new Error("Pagamento não encontrado");

  if (payment.status === "credited") return true;

  return false;
}
