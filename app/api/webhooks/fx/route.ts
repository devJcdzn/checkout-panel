import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    idTransaction,
    typeTransaction,
    statusTransaction,
    value,
    paymentDate,
    paymentCode,
    requestNumber,
  } = await request.json();

  console.log({
    idTransaction,
    typeTransaction,
    statusTransaction,
    value,
    paymentDate,
    paymentCode,
    requestNumber,
  });

  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: idTransaction,
    },
  });

  if (!payment) {
    return new NextResponse("Payment not found", { status: 404 });
  }

  if (statusTransaction !== "success") {
    return new NextResponse("Payment failed", { status: 400 });
  }

  const paymentUpdated = await prisma.payment.update({
    where: {
      id: payment?.id,
    },
    data: {
      ...payment,
      status: statusTransaction,
      paymentDate,
    },
    include: {
      checkout: true,
    },
  });

  return NextResponse.redirect(
    paymentUpdated.checkout.redirectLink ??
      `checkout/${paymentUpdated.checkoutId}`
  );
}
