"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, PencilRuler, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProduct } from "@/features/products/api/use-delete-product";

interface Props {
  id: string;
}

export function ProductsActionsMenu({ id }: Props) {
  // const { toast } = useToast();
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza que deseja deletar?",
    "Está prestes a deletar essa transação permanentemente."
  );

  const deleteMutation = useDeleteProduct(id);

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
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
          <DropdownMenuItem disabled>
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
