import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checkouts = await prisma.checkout.findMany({
      include: {
        product: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        checkouts,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error to get checkouts", (err as Error).message);

    return new NextResponse(
      JSON.stringify({
        error: "Erro ao buscar checkouts",
      }),
      { status: 500 }
    );
  }
}
