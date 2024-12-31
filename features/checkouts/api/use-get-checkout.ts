import type { IProduct } from "@/features/products/api/use-get-products";
import { api } from "@/lib/api";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export interface OrderBump {
  id: string;
  checkoutId: number;
  productId: number;
  discount: number;
  product: IProduct;
}

export interface ICheckout {
  id: number;
  slug: string;
  color: string | null;
  banner: string | null;
  bottomBanner: string | null;
  testimonials: string | null;
  redirectLink: string | null;
  product: IProduct;
  lightMode?: boolean;
  createdAt: Date;
  updatedAt: Date;

  timer: number;
  topBoxColor: string | null;
  topBoxPhrase: string | null;
  bottomBoxColor: string | null;
  bottomBoxPhrase: string | null;
  checkoutColor: string | null;

  orderBump: OrderBump[];
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
        orderBump: data.checkout.orderBump.map((bump) => ({
          ...bump,
          product: {
            ...bump.product,
            price: convertAmountFromMiliunits(
              bump.product.price - bump.product.price * bump.discount
            ),
          },
        })),
      };
    },
  });

  return query;
};
