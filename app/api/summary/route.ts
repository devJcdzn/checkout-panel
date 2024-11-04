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
      updatedAt: true,
      conversions: true,
      model: true,
    },
  });

  const totalProducts = await prisma.product.count();

  const recentMetricsOfWeek = await getMetricsByDayOfWeek();

  return NextResponse.json({
    totalImpressions: aggregateMetrics._sum.impressions || 0,
    totalConversions: aggregateMetrics._sum.conversions || 0,
    topCheckout: topCheckout || null,
    recentCheckouts: recentCheckouts || [],
    recentMetricsOfWeek,
    totalProducts,
    message: "Resumo das métricas obtido com sucesso",
  });
}
