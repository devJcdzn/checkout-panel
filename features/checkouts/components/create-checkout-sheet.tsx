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
  redirectLink: z.string().url().optional(),
  model: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;

export const NewCheckoutSheet = () => {
  const { isOpen, onClose } = useNewCheckout();

  const checkoutMutation = useCreateCheckout();

  const productsQuery = useGetProducts();
  const productsOptions = Array.isArray(productsQuery.data)
    ? productsQuery.data.map((product: any) => {
        console.log(product);
        return {
          label: product.name,
          value: product.id,
        };
      })
    : [];

  const isLoading = productsQuery.isLoading;
  const isPending = checkoutMutation.isPending;

  const onSubmit = (data: FormValues) => {
    console.log(data);

    const formData = new FormData();
    formData.append("slug", data.slug);
    formData.append("productId", data.productId.toString());
    formData.append("color", data.color || "");

    if (data.redirectLink) {
      formData.append("redirectLink", data.redirectLink);
    }
    if (data.model) {
      formData.append("model", data.model);
    }
    if (data.banner instanceof File) {
      formData.append("banner", data.banner);
    }

    checkoutMutation.mutate(formData, {
      onSuccess: ({ data }) => {
        console.log(data);
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
