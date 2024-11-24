import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { generateCheckoutHash } from "@/lib/utils";
import { storageProvider } from "@/services/storage";

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

  const hash = generateCheckoutHash();

  let bannerUrl;
  let bottomBannerUrl;
  let testimonialsUrl;

  if (banner) {
    bannerUrl = await storageProvider.upload(banner);
  }

  if (bottomBanner) {
    bottomBannerUrl = await storageProvider.upload(bottomBanner);
  }

  if (testimonials) {
    testimonialsUrl = await storageProvider.upload(testimonials);
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
      banner: bannerUrl,
      bottomBanner: bottomBannerUrl,
      testimonials: testimonialsUrl,
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
