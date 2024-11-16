import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { IProduct } from "@/features/products/api/use-get-products";
import { convertAmountFromMiliunits } from "@/lib/utils";

export interface ICheckout {
  id: number;
  slug: string;
  color: string | null;
  banner: string | null;
  redirectLink: string | null;
  product: IProduct;
  createdAt: Date;
  updatedAt: Date;
}

export const useGetCheckouts = () => {
  const query = useQuery({
    queryKey: ["checkouts"],
    queryFn: async () => {
      const { data } = await api.get<{ checkouts: ICheckout[] }>("/checkouts");

      return data.checkouts.map((checkout) => ({
        ...checkout,
        product: {
          ...checkout.product,
          price: convertAmountFromMiliunits(checkout.product.price),
        },
      }));
    },
  });

  return query;
};
