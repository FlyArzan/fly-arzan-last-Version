import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useCityLocation = (keyword) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["locations", keyword],

    queryFn: () =>
      api.get(`/locations?keyword=${keyword}`).then((res) => res.data),
    enabled: !!keyword,
    // Reuse cached results for 5 min so deleting/retyping the same prefix is instant
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    error,
    data,
  };
};
