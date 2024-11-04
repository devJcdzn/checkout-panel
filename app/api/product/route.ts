import { prisma } from "@/utils/db";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

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

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, { recursive: true });

  let fileName;

  if (image) {
    fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, Buffer.from(await image.arrayBuffer()));
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      image: `/uploads/${fileName}`,
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
