"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Coins, Link, MoreHorizontal, PencilRuler, Trash } from "lucide-react";

import { useOpenCheckout } from "@/features/checkouts/hooks/use-open-checkout";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteCheckout } from "@/features/checkouts/api/use-delete-checkout";

interface Props {
  id: string;
  hash: string;
}

export function ActionsMenu({ id, hash }: Props) {
  const { toast } = useToast();
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza que deseja deletar?",
    "Está prestes a deletar essa transação permanentemente."
  );

  const deleteMutation = useDeleteCheckout(hash);

  const { onOpen } = useOpenCheckout();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  const copyCheckoutURLToClipboard = () => {
    const checkoutURL = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${hash}`;

    navigator.clipboard
      .writeText(checkoutURL)
      .then(() => {
        toast({
          title: "URL Copiada para ára de transferência",
          description: checkoutURL,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro ao copiar URL",
          description: err,
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Mais opções</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyCheckoutURLToClipboard}>
            <Link className="size-4 mr-2" />
            Copiar URL do Checkout
          </DropdownMenuItem>
          <DropdownMenuItem disabled={true} onClick={() => onOpen(hash)}>
            <PencilRuler className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
