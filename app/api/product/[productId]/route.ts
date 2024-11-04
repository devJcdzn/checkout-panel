import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const productId = (await params).productId;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  return new NextResponse(
    JSON.stringify({
      product,
    }),
    { status: 200 }
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const productId = (await params).productId;
  const deletedProduct = await prisma.product.delete({
    where: {
      id: Number(productId),
    },
    select: {
      id: true,
    },
  });

  if (!deletedProduct.id) {
    return new NextResponse("Produto não encontrado", { status: 404 });
  }

  return new NextResponse("Produto deletado com sucesso", {
    status: 200,
  });
}
