import { prisma } from "@/utils/db";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { generateCheckoutHash } from "@/lib/utils";
import s3 from "@/utils/cloudflare-config";

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
  const lightMode = Boolean(formData.get("lightMode"));

  const timer = formData.get("timer")?.toString();
  const topBoxColor = formData.get("topBoxColor")?.toString();
  const topBoxPhrase = formData.get("topBoxPhrase")?.toString();
  const bottomBoxColor = formData.get("bottomBoxColor")?.toString();
  const bottomBoxPhrase = formData.get("bottomBoxPhrase")?.toString();

  const banner = formData.get("banner") as File | null;
  const bottomBanner = formData.get("bottomBanner") as File | null;
  const testimonials = formData.get("testimonials") as File | null;

  if (!slug || !productId) {
    return new NextResponse("Campos obrigatórios faltando", { status: 400 });
  }

  // const uploadDir = path.join(
  //   process.cwd(),
  //   "public",
  //   "uploads",
  //   "checkouts",
  //   model
  // );

  const hash = generateCheckoutHash();

  let bannerFileName;
  let bottomBannerFileName;
  let testimonialsFileName;

  if (banner) {
    const arrayBuffer = await banner.arrayBuffer();
    const bannerBuffer = Buffer.from(arrayBuffer);
    bannerFileName = `${Date.now()}-${banner.name}-banner`;

    await s3
      .upload({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: bannerFileName,
        Body: bannerBuffer,
        ContentType: banner.type,
        ACL: "public-read",
      })
      .promise();
  }

  if (bottomBanner) {
    const arrayBuffer = await bottomBanner.arrayBuffer();
    const bottomBannerBuffer = Buffer.from(arrayBuffer);
    bottomBannerFileName = `${Date.now()}-${bottomBanner.name}-bottomBanner`;

    await s3
      .upload({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: bottomBannerFileName,
        Body: bottomBannerBuffer,
        ContentType: bottomBanner.type,
        ACL: "public-read",
      })
      .promise();
  }

  if (testimonials) {
    const arrayBuffer = await testimonials.arrayBuffer();
    const testimonialsBuffer = Buffer.from(arrayBuffer);
    testimonialsFileName = `${Date.now()}-${testimonials.name}-testimonials`;

    await s3
      .upload({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: testimonialsFileName,
        Body: testimonialsBuffer,
        ContentType: testimonials.type,
        ACL: "public-read",
      })
      .promise();
  }

  const newCheckout = await prisma.checkout.create({
    data: {
      slug,
      hash,
      productId: Number(productId),
      color,
      redirectLink,
      lightMode,
      model,
      banner: banner ? `${process.env.ACCESS_R2_URL}/${bannerFileName}` : null,
      bottomBanner: bottomBanner
        ? `${process.env.ACCESS_R2_URL}/${bottomBannerFileName}`
        : null,
      testimonials: testimonials
        ? `${process.env.ACCESS_R2_URL}/${testimonialsFileName}`
        : null,
      timer: Number(timer),
      topBoxColor,
      topBoxPhrase,
      bottomBoxColor,
      bottomBoxPhrase,
    },
    select: {
      hash: true,
    },
  });

  prisma.$disconnect();

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
