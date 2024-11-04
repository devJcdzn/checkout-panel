import { api } from "@/lib/api";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetProduct = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["product", { id }],
    queryFn: async () => {
      const { data } = await api.get(`/product/${id}`);

      console.log(data);

      return {
        ...data.product,
        price: convertAmountFromMiliunits(data.product.price),
      };
    },
  });

  return query;
};
