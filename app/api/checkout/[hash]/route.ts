import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const hash = (await params).hash;

  const checkout = await prisma.checkout.findUnique({
    where: {
      hash,
    },
    select: {
      id: true,
      product: true,
      slug: true,
      redirectLink: true,
      color: true,
      banner: true,
      impressions: true,
    },
  });

  if (!checkout) {
    return new NextResponse("Checkout not found", { status: 404 });
  }

  await prisma.checkout.update({
    where: {
      id: checkout.id,
    },
    data: {
      impressions: checkout.impressions + 1,
    },
  });

  prisma.$disconnect();

  return new NextResponse(
    JSON.stringify({
      checkout,
    }),
    { status: 200 }
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const hash = (await params).hash;
  const deletedCheckout = await prisma.checkout.delete({
    where: {
      hash,
    },
    select: {
      id: true,
    },
  });

  if (!deletedCheckout.id) {
    return new NextResponse("Checkout não encontrado", { status: 404 });
  }

  return new NextResponse("Checkout deletado com sucesso", {
    status: 200,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const hash = (await params).hash;

  const checkout = await prisma.checkout.findUnique({
    where: {
      hash,
    },
  });

  if (!checkout) {
    return new NextResponse("Checkout não encontrado", { status: 404 });
  }

  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return new NextResponse("Content-type must be multipart/form-data", {
      status: 400,
    });
  }

  const formData = await request.formData();

  const slug = formData.get("slug")?.toString() || "";
  const productId = formData.get("productId")?.toString() || "";
  const color = formData.get("color")?.toString() || "";
  const redirectLink = formData.get("redirectLink")?.toString() || "";
  const model = formData.get("model")?.toString() || "sunize";
  const banner = formData.get("banner") as File | null;

  if (!slug || !productId) {
    return new NextResponse("Campos obrigatórios faltando", { status: 400 });
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "checkouts",
    model
  );

  await fs.mkdir(uploadDir, { recursive: true });

  let fileName = checkout.banner;
  if (banner) {
    fileName = `${Date.now()}-${banner.name}-${model}`;
    const filePath = path.join(uploadDir, fileName);

    if (checkout.banner) {
      const oldBanner = path.join(uploadDir, checkout.banner);
      try {
        await fs.unlink(oldBanner);
      } catch (error) {
        console.warn("Erro ao tentar apagar o banner antigo:", error);
      }
    }

    await fs.writeFile(filePath, Buffer.from(await banner.arrayBuffer()));
  }

  const updatedCheckout = await prisma.checkout.update({
    where: {
      hash,
    },
    data: {
      slug,
      productId: Number(productId),
      color,
      redirectLink,
      model,
      banner: fileName,
    },
  });

  return new NextResponse(
    JSON.stringify({
      message: "Produto atualizado com sucesso.",
      checkout: updatedCheckout,
      checkoutUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${updatedCheckout.hash}`,
    }),
    {
      status: 200,
    }
  );
}
