import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAxios } from "./useAxios";
import { formatDateForURL } from "@/lib/flight-utils";

export const useFlightOffers = (queries) => {
  const axios = useAxios();

  // Build Query with timezone-safe date formatting
  const searchParams = {
    originLocationCode: queries.originLocationCode,
    destinationLocationCode: queries.destinationLocationCode,
    departureDate: formatDateForURL(queries.departureDate),
    adults: queries.adults,
    children: queries.children,
    travelClass: queries.travelClass,
  };

  // Conditionally add returnDate if it exists
  if (queries.returnDate) {
    searchParams.returnDate = formatDateForURL(queries.returnDate);
  }

  // Remove undefined/null params
  Object.keys(searchParams).forEach(
    (key) =>
      (searchParams[key] === undefined ||
        searchParams[key] === null ||
        searchParams[key] === "") &&
      delete searchParams[key],
  );

  const searchQueries = new URLSearchParams(searchParams);

  const { isLoading, error, data } = useQuery({
    queryKey: ["flight-offers", queries],
    retry: 0,
    queryFn: () =>
      axios
        .get(`/flight-offers?${searchQueries.toString()}`)
        .then((res) => res.data),
    enabled:
      !!queries.originLocationCode &&
      !!queries.destinationLocationCode &&
      queries.departureDate instanceof Date &&
      !isNaN(queries.departureDate) &&
      (queries.adults || 0) > 0,
  });

  useEffect(() => {
    if (error) {
      console.error("[FlightOffers] Failed to fetch flight offers:", error);
      console.error("[FlightOffers] Request params:", {
        originLocationCode: queries.originLocationCode,
        destinationLocationCode: queries.destinationLocationCode,
        departureDate: queries.departureDate,
        adults: queries.adults,
        children: queries.children,
        travelClass: queries.travelClass,
      });
    }
  }, [error]);

  return {
    isLoading,
    error,
    data,
  };
};
