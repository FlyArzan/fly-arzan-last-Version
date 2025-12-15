import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { format, startOfDay } from "date-fns";
import {
  useFlexibleDatesAPI,
  getFlexibleDatesFromAPI,
} from "./useFlexibleDatesAPI";

/**
 * Hook for managing flexible dates state with real API data
 * @param {Object} searchParams - Search parameters from the flight search
 * @param {string} searchParams.origin - Origin IATA code
 * @param {string} searchParams.destination - Destination IATA code
 * @param {boolean} searchParams.oneWay - Whether it's a one-way flight
 */
export const useFlexibleDates = (searchParams = {}) => {
  const [selectedFlexibleDate, setSelectedFlexibleDate] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [flexibleDates, setFlexibleDates] = useState([]);

  // Track if we've initialized the selected date to prevent infinite loops
  const hasInitializedRef = useRef(false);

  // Fetch real prices from Amadeus API
  const {
    priceData,
    isLoading: isPricesLoading,
    isError: isPricesError,
    error: pricesError,
    hasPrices,
  } = useFlexibleDatesAPI(
    searchParams,
    !!searchParams?.origin && !!searchParams?.destination
  );

  // Memoize the selected date string to prevent unnecessary re-renders
  const selectedDateKey = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );

  // Memoize price data keys to detect actual changes
  const priceDataKeys = useMemo(
    () =>
      Object.keys(priceData || {})
        .sort()
        .join(","),
    [priceData]
  );

  // Update flexible dates when price data or selected date changes
  // Using stable string keys to prevent infinite loops from object reference changes
  useEffect(() => {
    const dates = getFlexibleDatesFromAPI(
      selectedDate,
      priceData,
      3,
      isPricesLoading
    );
    setFlexibleDates(dates);

    // Only set the middle date on initial load, not on every update
    if (dates.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const middleIndex = Math.floor(dates.length / 2);
      const middleDate = dates[middleIndex];
      if (middleDate) {
        setSelectedFlexibleDate(middleDate.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateKey, priceDataKeys, isPricesLoading]);

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (date) => {
      const normalizedDate = startOfDay(date);
      setSelectedDate(normalizedDate);
      setIsCalendarOpen(false);

      // Update flexible dates around the new selected date
      const dates = getFlexibleDatesFromAPI(normalizedDate, priceData, 3);
      setFlexibleDates(dates);

      if (dates.length > 0) {
        const middleIndex = Math.floor(dates.length / 2);
        const middleDate = dates[middleIndex];
        if (middleDate) {
          setSelectedFlexibleDate(middleDate.id);
        }
      }
    },
    [priceData]
  );

  // Handle clicking on a flexible date in the horizontal bar
  const handleFlexibleDateClick = useCallback(
    (dateId) => {
      setSelectedFlexibleDate(dateId);
      const selectedFlexible = flexibleDates.find((d) => d.id === dateId);
      if (selectedFlexible?.fullDate) {
        setSelectedDate(startOfDay(selectedFlexible.fullDate));
      }
    },
    [flexibleDates]
  );

  // Get the currently selected date in URL format
  const getSelectedDateFormatted = useCallback(() => {
    return format(selectedDate, "yyyy-MM-dd");
  }, [selectedDate]);

  return {
    // State
    selectedFlexibleDate,
    isCalendarOpen,
    selectedDate,
    flexibleDates,
    priceData,

    // Loading states
    isPricesLoading,
    isPricesError,
    pricesError,
    hasPrices,

    // Actions
    setIsCalendarOpen,
    handleDateSelect,
    handleFlexibleDateClick,
    getSelectedDateFormatted,
  };
};
