import { useConfirm } from "@/hooks/use-confirm";
import { useGetCheckout } from "../api/use-get-checkout";
import { useDeleteCheckout } from "../api/use-delete-checkout";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { z } from "zod";
import { useGetProducts } from "@/features/products/api/use-get-products";
import { useOpenCheckout } from "../hooks/use-open-checkout";
import { useEditCheckout } from "../api/use-edit-checkout";

const formSchema = z.object({
  slug: z.string().min(3),
  productId: z.number(),
  color: z.string().optional(),
  banner: z.instanceof(File).nullable().optional(),
  redirectLink: z.string().url().optional(),
  model: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;

export function EditCheckoutSheet() {
  const { isOpen, onClose, hash } = useOpenCheckout();
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza que deseja apagar?",
    "Essa ação é irreversível"
  );

  const checkoutQuery = useGetCheckout(hash);
  const editMutation = useEditCheckout(hash);
  const deleteMutation = useDeleteCheckout(hash);

  const productsQuery = useGetProducts();

  const productsOptions = Array.isArray(productsQuery.data)
    ? productsQuery.data.map((productsQuery: any) => ({
        label: productsQuery.name,
        value: productsQuery.id,
      }))
    : [];

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = checkoutQuery.isLoading || productsQuery.isLoading;

  const onSubmit = (data: FormValues) => {
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

    editMutation.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = checkoutQuery.data
    ? {
        productId: checkoutQuery.data.product.id,
        slug: checkoutQuery.data.slug,
        color: checkoutQuery.data.color ?? "",
        redirectLink: checkoutQuery.data.redirectLink ?? "",
        // banner: checkoutQuery.data.banner ?? "",
      }
    : {
        productId: "",
        slug: "",
        color: "",
        redirectLink: "",
        // banner: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 overflow-auto">
          <SheetHeader>
            <SheetTitle>Editar Transação</SheetTitle>
            <SheetDescription>
              Alterar ou atualizar dados da transação.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin muted-foreground" />
            </div>
          ) : (
            <CheckoutForm
              id={hash}
              defaultValues={{
                ...defaultValues,
                productId: Number(defaultValues.productId), //To fix Later
              }}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isLoading || isPending}
              productsOptions={productsOptions}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
