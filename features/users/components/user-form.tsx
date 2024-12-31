import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { signUp } from "../actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserForm = ({ submitted }: { submitted: () => void }) => {
  const [state, action, pending] = useActionState(signUp, null);

  if (state?.success) {
    submitted();
  }

  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" />
          </div>
          {state?.error?.name && (
            <span className="text-xs text-red-500">{state?.error.name}</span>
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
          {state?.error?.user && (
            <span className="text-xs text-red-500">{state?.error.user}</span>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
            />
          </div>
          {state?.error?.user && (
            <span className="text-xs text-red-500">{state?.error.user}</span>
          )}
          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select name="role" required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Usuário</SelectItem>
              </SelectContent>
            </Select>
            {state?.error?.role && (
              <span className="text-xs text-red-500">{state?.error.role}</span>
            )}
          </div>
          <Button disabled={pending} className="w-full">
            {pending ? "Criando..." : "Criar"}
          </Button>
        </div>
      </div>
    </form>
  );
};
