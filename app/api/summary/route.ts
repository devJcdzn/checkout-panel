import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { getMetricsByDayOfWeek } from "../../../actions";

export async function GET() {
  const aggregateMetrics = await prisma.checkout.aggregate({
    _sum: {
      impressions: true,
      conversions: true,
    },
  });

  const totalConversionsAmount = await prisma.payment.aggregate({
    where: {
      status: "credited",
    },
    _sum: {
      amount: true,
    },
  });

  const topCheckout = await prisma.checkout.findFirst({
    orderBy: {
      conversions: "desc",
    },
    select: {
      id: true,
      slug: true,
      conversions: true,
      model: true,
    },
  });

  const recentCheckouts = await prisma.checkout.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      product: {
        select: {
          price: true,
        },
      },
      updatedAt: true,
      conversions: true,
      model: true,
    },
  });

  const formattedRecentCheckouts = recentCheckouts.map((checkout) => ({
    id: checkout.id,
    slug: checkout.slug,
    conversions: checkout.conversions * checkout.product.price,
    updatedAt: checkout.updatedAt,
    model: checkout.model,
  }));

  const totalProducts = await prisma.product.count();

  const recentMetricsOfWeek = await getMetricsByDayOfWeek();

  prisma.$disconnect();

  return NextResponse.json({
    totalImpressions: aggregateMetrics._sum.impressions || 0,
    totalConversions: totalConversionsAmount._sum.amount || 0,
    topCheckout: topCheckout || null,
    recentCheckouts: formattedRecentCheckouts || [],
    recentMetricsOfWeek: recentMetricsOfWeek.weekData,
    totalProducts,
    message: "Resumo das métricas obtido com sucesso",
  });
}
