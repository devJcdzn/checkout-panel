import type { IProduct } from "@/features/products/api/use-get-products";
import { api } from "@/lib/api";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

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

export const useGetCheckout = (hash?: string) => {
  const query = useQuery({
    enabled: !!hash,
    queryKey: ["checkout", { hash }],
    queryFn: async () => {
      const { data } = await api.get<{ checkout: ICheckout }>(
        `/checkout/${hash}`
      );

      console.log(data);

      return {
        ...data.checkout,
        product: {
          ...data.checkout.product,
          price: convertAmountFromMiliunits(data.checkout.product.price),
        },
      };
    },
  });

  return query;
};
