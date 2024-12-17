import { updateMetrics } from "@/actions";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    externalId,
    // paymentMethod,
    status,
    // totalValue,
    // pixQrCode,
    // pixCode,
    approvedAt,
  } = await request.json();

  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: externalId,
    },
  });

  if (!payment) {
    return new NextResponse("Payment not found", { status: 404 });
  }

  if (status !== "APPROVED") {
    return new NextResponse("Payment failed", { status: 400 });
  }

  await prisma.payment.update({
    where: {
      id: payment?.id,
    },
    data: {
      ...payment,
      status,
      paymentDate: approvedAt,
    },
    include: {
      checkout: true,
    },
  });

  await updateMetrics(payment.checkoutId, true);

  return NextResponse.json({ success: true }, { status: 200 });
}
