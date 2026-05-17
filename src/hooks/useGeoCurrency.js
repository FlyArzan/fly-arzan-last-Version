import { useQuery } from "@tanstack/react-query";
import { useAxios } from "./useAxios";

export const useGeoCurrency = ({ enabled = true } = {}) => {
  const axios = useAxios();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["geoCurrency"],
    queryFn: () => axios.get(`/geo-currency`).then((res) => res.data),
    enabled,
    // Geo data rarely changes within a session — match backend 10-min cache
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    isLoading,
    error,
    data,
    refetch,
  };
};
