import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetSummary = () => {
  const query = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const { data } = await api.get("/summary");

      console.log(data);

      return data;
    },
  });

  return query;
};
