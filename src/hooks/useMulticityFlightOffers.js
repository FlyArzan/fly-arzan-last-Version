import { useMutation } from "@tanstack/react-query";
import { useAxios } from "./useAxios";
import { toast } from "sonner";

export const useMulticityFlightOffers = () => {
  const axios = useAxios();

  const mutation = useMutation({
    mutationKey: ["multicity-data"],
    mutationFn: (multicityData) =>
      axios.post("/flight-offers", multicityData).then((res) => res.data),
    onError: (error) => {
      console.error(
        "[MultiCityFlightOffers] Failed to fetch multi-city offers:",
        error,
      );
      toast.error("Something went wrong");
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
