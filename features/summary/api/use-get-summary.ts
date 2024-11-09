import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { convertAmountFromMiliunits } from "@/lib/utils";

interface TopCheckout {
  model: string | null;
  id: number;
  slug: string;
  conversions: number;
}

interface FormattedRecentCheckouts {
  id: number;
  slug: string;
  conversions: number;
  updatedAt: any;
  model: string | null;
}

export interface ISummary {
  totalImpressions: number;
  totalConversions: number;
  topCheckout: TopCheckout | null;
  recentCheckouts: FormattedRecentCheckouts[] | [];
  recentMetricsOfWeek: any;
  totalProducts: number;
  message: string;
}

export const useGetSummary = () => {
  const query = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const { data } = await api.get<ISummary>("/summary");

      console.log(data);

      return {
        ...data,
        recentCheckouts: data.recentCheckouts.map((checkout) => ({
          ...checkout,
          conversions: convertAmountFromMiliunits(checkout.conversions),
        })),
      };
    },
  });

  return query;
};
