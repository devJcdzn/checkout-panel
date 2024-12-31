"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewUser } from "../hooks/use-new-user";
import { ProductForm } from "@/features/products/components/product-form";
import { UserForm } from "./user-form";
import { useToast } from "@/hooks/use-toast";

export const NewUserSheet = () => {
  const { isOpen, onClose } = useNewUser();
  const { toast } = useToast();

  const submitted = () => {
    onClose();
    toast({ title: "Usuário criado com sucesso!" });
    // navigate("/dashboard/users");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 overflow-auto">
        <SheetHeader>
          <SheetTitle>Novo Usuário</SheetTitle>
          <SheetDescription>
            Crie um novo usuário para acessar o painel
          </SheetDescription>
        </SheetHeader>
        <UserForm submitted={submitted} />
      </SheetContent>
    </Sheet>
  );
};
