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
  console.log(formData);

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
  const fileName = `${Date.now()}-${banner?.name}-${model}`;

  if (banner) {
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, Buffer.from(await banner.arrayBuffer()));
  }

  const newCheckout = await prisma.checkout.create({
    data: {
      slug,
      productId: Number(productId),
      color,
      redirectLink,
      model,
      banner: banner ? `/uploads/checkouts/${model}/${fileName}` : null,
    },
    select: {
      hash: true,
    },
  });

  return new NextResponse(
    JSON.stringify({
      message: "Product created successfully",
      checkout: newCheckout,
      checkoutUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${newCheckout.hash}`,
    }),
    {
      status: 201,
    }
  );
}
