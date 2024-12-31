"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { updateUser } from "../actions";

interface IUser {
  name?: string;
  user: string;
}

export const ProfileForm = ({ user }: { user: IUser }) => {
  const [state, action, pending] = useActionState(updateUser, null);

  return (
    <form action={action} className="space-y-8">
      <div className="flex flex-col gap-6">
        {state?.error.authError && (
          <span className="text-xs text-red-500">{state.error?.authError}</span>
        )}
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name}
            placeholder="Seu nome"
          />
        </div>
        {state?.error.name && (
          <span className="text-xs text-red-500">{state.error.name}</span>
        )}
        <div className="grid gap-2">
          <Label htmlFor="prevPassword">Senha atual</Label>
          <Input id="password" name="prevPassword" type="password" />
          {state?.error.prevPassword && (
            <span className="text-xs text-red-500">
              {state.error.prevPassword}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword">Nova senha</Label>
          <Input id="password" name="newPassword" type="password" />
          {state?.error.newPassword && (
            <span className="text-xs text-red-500">
              {state.error.newPassword}
            </span>
          )}
        </div>
        <Button disabled={pending} className="w-full">
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
};
