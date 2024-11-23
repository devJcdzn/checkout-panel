import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetProducts } from "@/features/products/api/use-get-products";
import { useNewCheckout } from "../hooks/use-new-checkout";
import { CheckoutForm } from "./checkout-form";
import { useCreateCheckout } from "../api/use-create-checkout";

const formSchema = z.object({
  slug: z.string().min(3),
  productId: z.number(),
  color: z.string().optional(),
  banner: z.instanceof(File).nullable().optional(),
  bottomBanner: z.instanceof(File).nullable().optional(),
  testimonials: z.instanceof(File).nullable().optional(),
  redirectLink: z.string().url().optional(),
  model: z.string().optional(),
  lightMode: z.boolean().default(false).optional(),
  timer: z.coerce.number().max(30).optional(),
  topBoxColor: z.string().optional(),
  topBoxPhrase: z.string().optional(),
  bottomBoxColor: z.string().optional(),
  bottomBoxPhrase: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;

export const NewCheckoutSheet = () => {
  const { isOpen, onClose } = useNewCheckout();

  const checkoutMutation = useCreateCheckout();

  const productsQuery = useGetProducts();
  const productsOptions = Array.isArray(productsQuery.data)
    ? productsQuery.data.map((product: any) => {
        return {
          label: product.name,
          value: product.id,
        };
      })
    : [];

  const isLoading = productsQuery.isLoading;
  const isPending = checkoutMutation.isPending;

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("slug", data.slug);
    formData.append("productId", data.productId.toString());
    formData.append("color", data.color || "");

    if (data.lightMode) {
      formData.append("lightMode", data.lightMode.toString());
    }

    if (data.topBoxColor) {
      formData.append("topBoxColor", data.topBoxColor);
    }

    if (data.topBoxPhrase) {
      formData.append("topBoxPhrase", data.topBoxPhrase);
    }

    if (data.bottomBoxColor) {
      formData.append("bottomBoxColor", data.bottomBoxColor);
    }

    if (data.bottomBoxPhrase) {
      formData.append("bottomBoxPhrase", data.bottomBoxPhrase);
    }

    if (data.redirectLink) {
      formData.append("redirectLink", data.redirectLink);
    }
    if (data.model) {
      formData.append("model", data.model);
    }

    if (data.timer) {
      formData.append("timer", data.timer.toString());
    }

    if (data.banner instanceof File) {
      formData.append("banner", data.banner);
    }

    if (data.bottomBanner instanceof File) {
      formData.append("bottomBanner", data.bottomBanner);
    }

    if (data.testimonials instanceof File) {
      formData.append("testimonials", data.testimonials);
    }

    checkoutMutation.mutate(formData, {
      onSuccess: ({ data }) => {
        console.log("Sucesso: ", data);
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 overflow-auto">
        <SheetHeader>
          <SheetTitle>Novo Checkout</SheetTitle>
          <SheetDescription>Crie um novo checkout.</SheetDescription>
        </SheetHeader>
        {/* Form checkout */}
        <CheckoutForm
          onSubmit={onSubmit}
          disabled={isLoading || isPending}
          productsOptions={productsOptions}
        />
      </SheetContent>
    </Sheet>
  );
};
