import { createPayment, updateMetrics, updatePayment } from "@/actions";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { customerName, customerEmail, customerTax, amount, checkoutId } =
    await request.json();

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
    const payment = await createPayment({
      amount,
      customerEmail,
      customerName,
      customerTax,
      checkoutId,
      expiration: 60 * 15,
      status: "no-created",
    });

    const generatePaymentCode = JSON.stringify({
      amount,
      expiration: 60 * 15,
      externalId: payment.id,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/fx`,
    });

    console.log({
      key: process.env.FX_BANK_API_TOKEN,
      secret: process.env.FX_BANK_API_SECRET,
    });

    const config = {
      method: "post",
      url: "https://ws.fxbank.com.br/api/v1/gateway/request-qrcode",
      maxBodyLength: Infinity,
      headers: {
        at: process.env.FX_BANK_API_TOKEN,
        as: process.env.FX_BANK_API_SECRET,
        "Content-Type": "application/json",
      },
      data: generatePaymentCode,
    };

    const { data: response } = await axios(config);

    const updatedPayment = await updatePayment({
      ...payment,
      status: "pending",
      paymentCode: response.paymentCode,
      paymentUrl: response.paymentUrl,
      transactionId: response.id,
    });

    await updateMetrics(payment.checkoutId, true);

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
    return new NextResponse("Server Error", { status: 500 });
  }
}
