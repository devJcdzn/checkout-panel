import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCheckout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      const { data: response } = await api.post("/checkout", data);

      return response;
    },
    onSuccess: () => {
      toast.success("Checkout criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Erro ao criar checkout");
    },
  });

  return mutation;
};
