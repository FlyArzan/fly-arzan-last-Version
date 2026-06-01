import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useCurrencies = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => api.get(`/geo-currency/currencies`).then((res) => res.data),
    gcTime: Infinity, // Cache forever
    staleTime: Infinity, // Never refetch
  });

  return {
    isLoading,
    error,
    currencies: data || {},
  };
};
