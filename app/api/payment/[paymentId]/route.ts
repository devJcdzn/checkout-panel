import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const paymentId = (await params).paymentId;

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      id: true,
      amount: true,
      expiration: true,
      checkout: true,
      paymentCode: true,
      paymentUrl: true,
    },
  });

  if (!payment) {
    return new NextResponse("Checkout not found", { status: 404 });
  }

  prisma.$disconnect();

  return new NextResponse(
    JSON.stringify({
      payment,
    }),
    { status: 200 }
  );
}
