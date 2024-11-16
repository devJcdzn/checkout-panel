import { useQuery } from "@tanstack/react-query";

import { convertAmountFromMiliunits } from "@/lib/utils";
import { api } from "@/lib/api";

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  createdAt: Date;
}

export const useGetProducts = () => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<{ products: IProduct[] }>("/products");

      return data.products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: convertAmountFromMiliunits(product.price),
        image: product.image,
        createdAt: product.createdAt,
      }));
    },
  });

  return query;
};
