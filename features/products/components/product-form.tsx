"use client";

import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";
import { ImageUpload } from "@/components/upload-image";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string(),
  image: z.instanceof(File).optional().nullable(),
});

type FormValues = z.input<typeof formSchema>;

interface Props {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const ProductForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(
      values.price.replace(/[^\d,-]/g, "").replace(",", ".")
    );

    const priceInMiliunits = convertAmountToMiliunits(amount).toString();

    const product: FormValues = {
      ...values,
      price: priceInMiliunits,
    };

    onSubmit(product);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Nome do produto"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Descrição..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={disabled}
                  placeholder="R$0,00"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="image"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem do Produto</FormLabel>
              <FormControl>
                <ImageUpload
                  onChange={(file) => field.onChange(file)}
                  placeholder="Selecione uma imagem"
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={disabled} type="submit">
          {id ? "Salvar alterações" : "Criar Produto"}
        </Button>

        {!!id && (
          <Button
            type="button"
            variant={"link"}
            // onClick={handleDelete}
            className="w-full gap-1"
            disabled={disabled}
          >
            <Trash className="size-4" />
            Apagar Produto
          </Button>
        )}
      </form>
    </Form>
  );
};
