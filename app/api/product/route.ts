import { prisma } from "@/utils/db";
import s3 from "@/utils/cloudflare-config";
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

  let uploadResult;

  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${image.name}`;

    uploadResult = await s3
      .upload({
        Bucket: process.env.R2_BUCKET_NAME!, // Defina o nome do bucket no .env
        Key: fileName,
        Body: buffer,
        ContentType: image.type,
        ACL: "public-read",
      })
      .promise();
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      image: uploadResult?.Location,
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
