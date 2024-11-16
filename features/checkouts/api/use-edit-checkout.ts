import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export const useEditCheckout = (hash?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.put(`/checkout/${hash}`, data);

      return response;
    },
    onSuccess: () => {
      toast.success("Checkout atualizado");
      queryClient.invalidateQueries({ queryKey: ["checkout", { hash }] });
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Falha ao atualizar checkout");
    },
  });

  return mutation;
};
