"use client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/custom-select";
import { ImageUpload } from "@/components/upload-image";

const formSchema = z.object({
  slug: z.string().min(3),
  productId: z.number(),
  color: z.string().optional(),
  banner: z.instanceof(File).nullable().optional(),
  redirectLink: z.string().url().optional(),
  model: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;

interface Props {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  productsOptions: { label: string; value: number }[];
}

export function CheckoutForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  productsOptions,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="productId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <FormControl>
                <Select
                  placeholder="Selecione um produto"
                  options={productsOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="model"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo de checkout</FormLabel>
              <FormControl>
                <Select
                  placeholder="Selecione um modelo de Checkout"
                  options={[{ label: "Sunize", value: "sunize" }]}
                  value={field.value || "Sunize"}
                  onChange={field.onChange}
                  disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="slug"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido para o checkout</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Apelido para identificar o checkout"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="redirectLink"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de redirecionamento(opcional)</FormLabel>
              <FormDescription>
                Link para redirecionar o usuário em caso de sucesso na compra.
                Caso fique em branco, será redirecionado para pagina de
                agradecimento padrão.
              </FormDescription>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="ex: https://conteudo-protegido.com.br"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!id && (
          <FormField
            name="banner"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <FormDescription>
                  Imagem que será exibida como banner de propaganda na tela
                  inicial do checkout. Caso não seja fornecida, ficará sem
                  imagem alguma, apenas o checkout puro.
                </FormDescription>
                <FormControl>
                  <ImageUpload
                    onChange={(file) => field.onChange(file)}
                    placeholder="Selecione uma imagem"
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.banner?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        )}

        <Button className="w-full" disabled={disabled} type="submit">
          {id ? "Salvar alterações" : "Criar Checkout"}
        </Button>
      </form>
    </Form>
  );
}
