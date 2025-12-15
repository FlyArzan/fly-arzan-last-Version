import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfDay } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

/**
 * Fetch prices for a date range using Flight Cheapest Date Search API
 * Single efficient API call instead of multiple calls per date
 * @param {Object} params - Search parameters
 * @param {string} params.origin - Origin IATA code (e.g., "DAC")
 * @param {string} params.destination - Destination IATA code (e.g., "IST")
 * @param {string} params.departureDate - Start date YYYY-MM-DD
 * @param {string} params.endDate - End date YYYY-MM-DD
 * @param {boolean} params.oneWay - One-way flight
 * @param {string} params.viewBy - DATE, DURATION, or WEEK
 * @returns {Promise} - API response with flight prices per date
 */
const fetchFlexiblePrices = async ({
  origin,
  destination,
  departureDate,
  endDate,
  oneWay = true,
  viewBy = "DATE",
}) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const params = new URLSearchParams({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    oneWay: oneWay.toString(),
    viewBy,
  });

  if (departureDate) {
    params.append("departureDate", departureDate);
  }
  if (endDate) {
    params.append("endDate", endDate);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/flight-offers/flexible-prices?${params.toString()}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to fetch flexible prices: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Get flexible dates around a selected date for the horizontal bar
 * @param {Date} selectedDate - The currently selected date
 * @param {Object} priceData - Price data from API
 * @param {number} daysBeforeAfter - Number of days to show before/after
 * @param {boolean} isLoading - Whether API is still loading
 * @returns {Array} - Array of date objects with prices
 */
export const getFlexibleDatesFromAPI = (
  selectedDate,
  priceData,
  daysBeforeAfter = 3,
  isLoading = false
) => {
  const dates = [];
  const today = startOfDay(new Date());

  for (let i = -daysBeforeAfter; i <= daysBeforeAfter; i++) {
    const currentDate = addDays(selectedDate, i);
    const dateKey = format(currentDate, "yyyy-MM-dd");
    const priceInfo = priceData[dateKey];

    // Skip past dates
    if (currentDate < today) {
      continue;
    }

    dates.push({
      id: dates.length + 1,
      date: format(currentDate, "d MMM"),
      fullDate: currentDate,
      dateKey,
      price: priceInfo ? `$${priceInfo.price}` : null,
      priceValue: priceInfo?.price || null,
      isCheapest: priceInfo?.isCheapest || false,
      isRecommended: priceInfo?.isRecommended || false,
      // Only show as loading if API is still fetching, otherwise show as no data
      isLoading: isLoading && !priceInfo,
    });
  }

  return dates;
};

/**
 * Hook to fetch flight prices for flexible dates
 * Uses Flight Cheapest Date Search API (single efficient call)
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.origin - Origin IATA code
 * @param {string} searchParams.destination - Destination IATA code
 * @param {boolean} searchParams.oneWay - One-way flight
 * @param {boolean} enabled - Whether to enable the query
 */
export const useFlexibleDatesAPI = (searchParams, enabled = true) => {
  const { origin, destination, oneWay = true } = searchParams || {};

  // Calculate date range: today to 30 days from now
  const today = startOfDay(new Date());
  const departureDate = format(today, "yyyy-MM-dd");
  const endDate = format(addDays(today, 30), "yyyy-MM-dd");

  const query = useQuery({
    queryKey: [
      "flexiblePrices",
      origin,
      destination,
      departureDate,
      endDate,
      oneWay,
    ],
    queryFn: async () => {
      console.log(
        `[FlexibleDates] Fetching prices for ${origin} → ${destination}, range: ${departureDate} to ${endDate}`
      );
      try {
        const result = await fetchFlexiblePrices({
          origin,
          destination,
          departureDate,
          endDate,
          oneWay,
          viewBy: "DATE",
        });
        console.log(
          `[FlexibleDates] Got prices for ${
            Object.keys(result?.data || {}).length
          } dates (source: ${result?.meta?.source || "unknown"})`
        );
        return result;
      } catch (error) {
        console.error("[FlexibleDates] API Error:", error);
        throw error;
      }
    },
    enabled: enabled && !!origin && !!destination,
    staleTime: 10 * 60 * 1000, // 10 minutes (cached data doesn't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // The API returns data in the correct format already
  const priceData = query.data?.data || {};

  return {
    ...query,
    priceData,
    hasPrices: Object.keys(priceData).length > 0,
  };
};

export default useFlexibleDatesAPI;
