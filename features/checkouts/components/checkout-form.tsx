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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/custom-select";
import { ImageUpload } from "@/components/upload-image";

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
        <div className="flex items-center justify-between gap-2">
          <FormField
            name="lightMode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modo</FormLabel>
                <div className="space-x-2 flex items-center">
                  <span className="text-xs">Dark</span>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <span className="text-xs">Light</span>
                </div>
              </FormItem>
            )}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Timer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Configuração do timer</DialogTitle>
                <DialogDescription>
                  Configurações prévias do timer opcional do checkout. (Caso não
                  deseje o timer deixar os campos vazios)
                </DialogDescription>
              </DialogHeader>
              <div className="grid flex-1 gap-2">
                <FormField
                  name="topBoxColor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor da caixa superior</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Cor (hexadecimal)"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="topBoxPhrase"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frase da Caixa Superior</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Ex: Pagamento Priorizado!"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="bottomBoxColor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor da caixa inferior</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Cor (hexadecimal)"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="bottomBoxPhrase"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frase da Caixa Inferior</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Ex: Frase de contagem!"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="timer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo do Timer</FormLabel>
                      <FormDescription>
                        Tempo do timer em minutos que aparecerá na parte
                        superior do checkout.
                      </FormDescription>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          type="number"
                          min={0}
                          max={30}
                          placeholder="max:30min"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Confirmar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
        {/* <FormField
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
        /> */}
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
                  Imagem(960x220px) que será exibida como banner de propaganda
                  na tela inicial do checkout. Caso não seja fornecida, ficará
                  sem imagem alguma, apenas o checkout puro.
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

        {!id && (
          <FormField
            name="bottomBanner"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner de rodapé(opcional)</FormLabel>
                <FormDescription>
                  Imagem(960x220px) que será exibida como banner de propaganda
                  na abaixo do checkout.
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

        {!id && (
          <FormField
            name="testimonials"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem de avaliações(opcional)</FormLabel>
                <FormDescription>
                  Imagem Vertical que será exibida como avaliações e depoimentos
                  no checkout.
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
