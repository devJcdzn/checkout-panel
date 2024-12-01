"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  user: z.string().min(3, "Usuário deve ter ao menos 3 caracteres."),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
});

type FormValues = z.input<typeof formSchema>;

export function LoginComponentForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Card className="mx-auto max-w-[440px]">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Faça login com suas credenciais</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            <FormField
              name="user"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel htmlFor="email">Nome de usuário</FormLabel>
                    <FormControl>
                      <Input
                        id="user"
                        type="text"
                        placeholder="nome_sobrenome"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Senha</FormLabel>
                    </div>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
