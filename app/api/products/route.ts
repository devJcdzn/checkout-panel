import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({});

    return new NextResponse(
      JSON.stringify({
        products,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error to get products", (err as Error).message);

    return new NextResponse(
      JSON.stringify({
        error: "Erro ao buscar produtos",
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
