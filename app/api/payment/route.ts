import { createPayment, updateMetrics, updatePayment } from "@/actions";
import { generateCheckoutHash } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    customerName,
    customerEmail,
    customerTax,
    amount,
    checkoutId,
    items,
  } = await request.json();

  if (
    !customerName ||
    !customerEmail ||
    !customerTax ||
    !amount ||
    !checkoutId
  ) {
    return new NextResponse(
      JSON.stringify({
        message: "Campos obrigatórios faltando",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const id = generateCheckoutHash();

    const payment = await createPayment({
      id,
      amount,
      customerEmail,
      customerName,
      customerTax,
      checkoutId,
      expiration: 60 * 15,
      status: "no-created",
    });

    const generatePaymentCode = JSON.stringify({
      name: customerName,
      email: customerEmail,
      cpf: customerTax,
      phone: "27992525560",
      paymentMethod: "PIX",
      amount,
      externalId: payment.id,
      postbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/rushpay`,
      items: items.map((item: any) => ({
        unitPrice: Math.round(item.price * 100),
        title: item.name,
        quantity: 1,
        tangible: false
      })),
    });

    const config = {
      method: "post",
      url: "https://pay.rushpay.site/api/v1/transaction.purchase",
      maxBodyLength: Infinity,
      headers: {
        at: process.env.FX_BANK_API_TOKEN,
        as: process.env.FX_BANK_API_SECRET,
        "Content-Type": "application/json",
        "Authorization": process.env.RUSHPAY_API_KEY!
      },
      data: generatePaymentCode,
    };

    const { data: response } = await axios(config);

    const updatedPayment = await updatePayment({
      ...payment,
      status: "pending",
      paymentCode: response.pixQrCode,
      paymentUrl: response.pixCode,
      transactionId: response.id,
    });

    console.log(updatedPayment);

    return new NextResponse(
      JSON.stringify({
        message: "Pagamento gerado com sucesso",
        paymentData: updatedPayment,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse("Server Error", { status: 500 });
  }
}
