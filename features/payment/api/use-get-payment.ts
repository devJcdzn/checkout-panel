import { api } from "@/lib/api";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetPayment = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["payment", { id }],
    queryFn: async () => {
      const { data } = await api.get(`/payment/${id}`);

      return data.payment;
    },
  });

  return query;
};
