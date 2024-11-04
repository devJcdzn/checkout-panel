import { z } from "zod";
import { useCreateProduct } from "../api/use-create-product";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewProduct } from "../hooks/use-new-product";
import { ProductForm } from "./product-form";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string(),
  image: z.instanceof(File).nullable().optional(),
});

type FormValues = z.input<typeof formSchema>;

export const NewProductSheet = () => {
  const { isOpen, onClose } = useNewProduct();

  const createProductMutation = useCreateProduct();

  const isPending = createProductMutation.isPending;

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    // Adiciona os campos ao FormData
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", data.price);

    // Adiciona o arquivo de imagem, verificando se ele existe
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    createProductMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 overflow-auto">
        <SheetHeader>
          <SheetTitle>Novo Produto</SheetTitle>
          <SheetDescription>
            Crie um novo produto para checkout
          </SheetDescription>
        </SheetHeader>
        <ProductForm onSubmit={onSubmit} disabled={isPending} />
      </SheetContent>
    </Sheet>
  );
};
