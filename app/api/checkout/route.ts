import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { generateCheckoutHash } from "@/lib/utils";
import { storageProvider } from "@/services/storage";
import { verifySession } from "@/app/lib/session";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return new NextResponse("Content-type must be multipart/form-data", {
      status: 400,
    });
  }

  const { userId } = await verifySession();

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
  const checkoutColor = formData.get("checkoutColor")?.toString();

  const banner = formData.get("banner") as File | null;
  const bottomBanner = formData.get("bottomBanner") as File | null;
  const testimonials = formData.get("testimonials") as File | null;

  const orderBumps: { productId: number; discount: number }[] = [];
  for (let i = 0; ; i++) {
    const productId = formData.get(`orderBumps[${i}][productId]`);
    const discount = formData.get(`orderBumps[${i}][discount]`)?.toString();

    if (!productId) break;

    orderBumps.push({
      productId: Number(productId),
      discount: discount ? parseFloat(discount) / 100 : 0,
    });
  }

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
      userId,
      checkoutColor: checkoutColor?.includes("#")
        ? checkoutColor
        : `#${checkoutColor}`,
    },
    select: {
      id: true,
      hash: true,
    },
  });

  const orderBumpData = orderBumps.map((bump: any) => ({
    productId: Number(bump.productId),
    discount: bump.discount,
    checkoutId: newCheckout.id,
  }));

  if (orderBumpData.length > 0) {
    await prisma.orderBump.createMany({
      data: orderBumpData,
    });
  }

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
