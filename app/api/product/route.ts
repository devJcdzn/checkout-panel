import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { storageProvider } from "@/services/storage";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return new NextResponse("Content-type must be multipart/form-data", {
      status: 400,
    });
  }

  const formData = await request.formData();

  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = formData.get("price")?.toString() || "";
  const image = (formData.get("image") as File | null) || "";

  if (!name || !price) {
    return new NextResponse("Campos obrigatórios faltando", { status: 400 });
  }

  let imageUrl;

  if (image) {
    imageUrl = await storageProvider.upload(image);
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      image: imageUrl,
    },
  });

  prisma.$disconnect();

  return new NextResponse(
    JSON.stringify({
      message: "Product created successfully",
      product: newProduct,
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
