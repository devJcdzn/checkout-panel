import { getMembersAction } from "@/app/dashboard/members/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetMembers = () => {
  const query = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await getMembersAction();

      if (error) {
        throw new Error(error);
      }

      return data;
    },
  });

  return query;
};
