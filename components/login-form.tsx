"use client";

import { Coins } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/(auth)/login/actions";
import { useActionState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={action}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Coins className="size-6" />
              </div>
              <span className="sr-only">Painel checkout</span>
            </a>
            <h1 className="text-xl font-bold">Painel de Checkouts.</h1>
          </div>
          <div className="flex flex-col gap-6">
            {state?.error.authError && (
              <span className="text-xs text-red-500">
                {state.error?.authError}
              </span>
            )}
            <div className="grid gap-2">
              <Label htmlFor="user">Usuário</Label>
              <Input
                id="user"
                name="user"
                type="text"
                placeholder="usuário-1182"
              />
            </div>
            {state?.error.user && (
              <span className="text-xs text-red-500">{state.error.user}</span>
            )}
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" />
              {state?.error.password && (
                <span className="text-xs text-red-500">
                  {state.error.password}
                </span>
              )}
            </div>
            <Button disabled={pending} className="w-full">
              {pending ? "Carregando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
