import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteCheckout = (hash?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any>({
    mutationFn: async () => {
      const { data } = await api.delete(`/checkout/${hash}`);

      return data;
    },
    onSuccess: () => {
      toast.success("Checkout deletado.");
      queryClient.invalidateQueries({ queryKey: ["checkout", { hash }] });
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Falha ao deletar checkout.");
    },
  });

  return mutation;
};
