import { Progress } from "@/components/ui/progress";
import SearchFilterSidebar from "./search-filter-sidebar";
import FlightSearchResults from "./flight-search-results";
import Footer from "@/header-footer/Footer";
import Header from "@/header-footer/Header";
import OneWayForm from "@/components/ui/hero-search-filter/flights/one-way-form";
import RoundWayForm from "@/components/ui/hero-search-filter/flights/round-way-form";
import MultiCityForm from "@/components/ui/hero-search-filter/flights/multi-city-form";
import FlexibleDatesCalendar from "@/components/ui/flexible-dates-calendar/FlexibleDatesCalendar";
import FlightSearchPageHeader from "@/components/ui/FlightSearchPageHeader";
import MultiCityFlightSearchPageHeader from "@/components/ui/MultiCityFlightSearchPageHeader";
import FlexibleDates from "@/components/ui/flexible-dates/FlexibleDates";
import { SidebarFilterProvider } from "@/providers/filter-sidebar-provider";
import { toast } from "sonner";
import { useFlightOffers } from "@/hooks/useFlightOffers";
import { useMulticityFlightOffers } from "@/hooks/useMulticityFlightOffers";
import { useFlexibleDates } from "@/hooks/useFlexibleDates";
import { useEffect, useState, useMemo } from "react";
import { parseDateFromURL, formatDateForURL } from "@/lib/flight-utils";
import { useSessionStorage } from "usehooks-ts";

import OneWayFilter from "@/components/ui/one-way-filter";
import RoundTripFilter from "@/components/ui/round-trip-filter";

const FlightSearchPage = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [multicityValues, setMulticityValues] = useState(null);
  const [multicityResults, setMulticityResults] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Session storage for all flight form data
  const [sessionData] = useSessionStorage("selected-flight", null);

  // Get trip type from session storage or default to one-way
  const tripType = sessionData?.type || "one-way";

  // Reset initialization flag when trip type changes
  useEffect(() => {
    setHasInitialized(false);
  }, [tripType]);

  // Initialize and update one-way/round-way form data from session storage
  useEffect(() => {
    if ((tripType === "one-way" || tripType === "round-way") && sessionData) {
      try {
        // Construct the initialValues with timezone-safe dates
        setInitialValues({
          flyingFrom: sessionData.flyingFrom || { city: "", iataCode: "" },
          flyingTo: sessionData.flyingTo || { city: "", iataCode: "" },
          travellers: sessionData.travellers || {
            cabin: "economy",
            adults: 1,
            children: 0,
          },
          depart: sessionData.depart
            ? parseDateFromURL(sessionData.depart)
            : null,
          return: sessionData.return
            ? parseDateFromURL(sessionData.return)
            : null,
        });
        setHasInitialized(true);
      } catch (error) {
        console.warn("Failed to parse session flight data:", error);
      }
    }
  }, [tripType, sessionData]);

  // Multi-city Flight Offers
  const { mutate: searchMulticityFlights, isPending: isMulticityLoading } =
    useMulticityFlightOffers();

  useEffect(() => {
    if (tripType === "multicity" && sessionData) {
      try {
        // Extract form data without the type field
        const { ...formData } = sessionData;

        // Convert to the format expected by MultiCityFlightSearchPageHeader
        if (formData.segments && formData.travellers) {
          const travelClass =
            formData.travellers.cabin === "premium_economy"
              ? "PREMIUM_ECONOMY"
              : formData.travellers.cabin.toUpperCase();

          const convertedData = {
            // Convert segments to originDestinations format for header display
            originDestinations: formData.segments.map((segment, index) => ({
              id: (index + 1).toString(),
              originLocationCode: segment.from.iataCode,
              destinationLocationCode: segment.to.iataCode,
              departureDateTimeRange: {
                date: formatDateForURL(parseDateFromURL(segment.depart)),
              },
              originCity: segment.from.city,
              destinationCity: segment.to.city,
            })),
            // Convert travellers to travelers format for header display
            travelers: [
              ...Array(formData.travellers.adults)
                .fill(null)
                .map((_, i) => ({
                  id: (i + 1).toString(),
                  travelerType: "ADULT",
                })),
              ...Array(formData.travellers.children)
                .fill(null)
                .map((_, i) => ({
                  id: (formData.travellers.adults + i + 1).toString(),
                  travelerType: "CHILD",
                })),
            ],
            searchCriteria: {
              flightFilters: {
                cabinRestrictions: [
                  {
                    cabin: travelClass,
                  },
                ],
              },
            },
            // Keep original form data for form re-population, ensuring dates are Date objects
            originalFormData: {
              ...formData,
              segments: formData.segments.map((segment) => ({
                ...segment,
                depart: segment.depart ? new Date(segment.depart) : "",
              })),
            },
          };
          setMulticityValues(convertedData);

          // Only trigger automatic search if not yet initialized to avoid repeated searches
          if (!hasInitialized) {
            const apiSearchData = {
              originDestinations: convertedData.originDestinations.map(
                (od) => ({
                  ...od,
                  departureDateTimeRange: {
                    ...od.departureDateTimeRange,
                  },
                })
              ),
              travelers: convertedData.travelers,
              sources: ["GDS"],
              searchCriteria: {
                maxFlightOffers: 25,
                flightFilters: {
                  cabinRestrictions: [
                    {
                      cabin: travelClass,
                      coverage: "MOST_SEGMENTS",
                      originDestinationIds:
                        convertedData.originDestinations.map((od) => od.id),
                    },
                  ],
                },
              },
            };

            searchMulticityFlights(apiSearchData, {
              onSuccess: (data) => {
                if (
                  data?.data?.length === 0 &&
                  data?.warnings?.[0]?.title === "IncompleteSearchWarning"
                ) {
                  toast.warning(
                    "No complete trips were found for the selected cities and dates. Please try adjusting your search."
                  );
                }
                setMulticityResults(data);
              },
              onError: (error) => {
                console.error("Auto multi-city search error:", error);
              },
            });
          }

          setHasInitialized(true);
        } else {
          setMulticityValues(formData);
          setHasInitialized(true);
        }
      } catch (error) {
        console.warn("Failed to parse multi-city form data:", error);
      }
    }
  }, [tripType, sessionData, hasInitialized, searchMulticityFlights]);

  // Memoized flight offers query parameters to prevent unnecessary re-renders
  const flightOffersParams = useMemo(
    () => ({
      originLocationCode: initialValues?.flyingFrom?.iataCode,
      destinationLocationCode: initialValues?.flyingTo?.iataCode,
      departureDate:
        initialValues?.depart instanceof Date ? initialValues.depart : null,
      returnDate:
        tripType === "round-way" && initialValues?.return instanceof Date
          ? initialValues.return
          : null,
      adults: sessionData?.travellers?.adults || 1,
      children: sessionData?.travellers?.children || 0,
      travelClass: sessionData?.travelClass || "ECONOMY",
    }),
    [initialValues, tripType, sessionData]
  );

  // Flight Offers (for one-way and round-way)
  const { isLoading, data: flightOffersData } =
    useFlightOffers(flightOffersParams);

  // Flexible dates with real API data - pass search params
  const flexibleDatesParams = useMemo(
    () => ({
      origin: initialValues?.flyingFrom?.iataCode,
      destination: initialValues?.flyingTo?.iataCode,
      oneWay: tripType === "one-way",
    }),
    [
      initialValues?.flyingFrom?.iataCode,
      initialValues?.flyingTo?.iataCode,
      tripType,
    ]
  );

  const {
    selectedFlexibleDate,
    isCalendarOpen,
    selectedDate,
    flexibleDates,
    priceData,
    isPricesLoading,
    setIsCalendarOpen,
    handleDateSelect,
    handleFlexibleDateClick,
  } = useFlexibleDates(flexibleDatesParams);

  // Memoized filter component selection
  const FilterComponent = useMemo(() => {
    if (tripType === "round-way") return RoundTripFilter;
    if (tripType === "multicity") return OneWayFilter; // Use OneWayFilter for multicity for now
    return OneWayFilter;
  }, [tripType]);

  // Create search context for flight cards
  const searchContext = useMemo(() => {
    const context = {
      tripType,
      adults: sessionData?.travellers?.adults || 1,
      children: sessionData?.travellers?.children || 0,
      travelClass: sessionData?.travelClass || "ECONOMY",
    };

    // Add route information based on trip type
    if (tripType === "one-way" || tripType === "round-way") {
      if (initialValues) {
        context.fromCity = initialValues.flyingFrom?.city;
        context.toCity = initialValues.flyingTo?.city;
        context.fromIataCode = initialValues.flyingFrom?.iataCode;
        context.toIataCode = initialValues.flyingTo?.iataCode;
        context.departureDate = initialValues.depart;
        if (tripType === "round-way" && initialValues.return) {
          context.returnDate = initialValues.return;
        }
      }
    } else if (tripType === "multicity" && multicityValues) {
      // Handle multi-city context
      context.segments =
        multicityValues.originalFormData?.segments ||
        multicityValues.segments ||
        [];
    }

    return context;
  }, [tripType, sessionData, initialValues, multicityValues]);

  return (
    <>
      <SidebarFilterProvider>
        <Header />
        <div className="tw:flex tw:flex-col tw:min-h-screen tw:mt-16 tw:md:mt-[92px]">
          <div className="tw:py-6 tw:bg-[#F2FAFF]">
            <div className="container">
              {/* Header */}
              {tripType === "multicity" && multicityValues && (
                <MultiCityFlightSearchPageHeader
                  multicityFormValues={multicityValues}
                />
              )}
              {(tripType === "one-way" || tripType === "round-way") &&
                initialValues && (
                  <FlightSearchPageHeader
                    initialOneWayFormValues={initialValues}
                  />
                )}

              <div className="tw:rounded-xl tw:bg-white tw:shadow tw:!p-5">
                {/* One Way Form */}
                {tripType === "one-way" && initialValues && (
                  <OneWayForm initialValues={initialValues} />
                )}
                {/* Round Way Form */}
                {tripType === "round-way" && (
                  <RoundWayForm initialValues={initialValues} />
                )}
                {/* Multi City Form */}
                {tripType === "multicity" && (
                  <MultiCityForm
                    initialValues={
                      multicityValues?.originalFormData || multicityValues
                    }
                    onSearch={(searchData) => {
                      searchMulticityFlights(searchData, {
                        onSuccess: (data) => {
                          if (
                            data?.data?.length === 0 &&
                            data?.warnings?.[0]?.title ===
                              "IncompleteSearchWarning"
                          ) {
                            toast.warning(
                              "No complete trips were found for the selected cities and dates. Please try adjusting your search."
                            );
                          }
                          // Store results in state for FlightSearchResults component
                          setMulticityResults(data);
                        },
                        onError: (error) => {
                          console.error("Multi-city search error:", error);
                          toast.error(
                            "Failed to search flights. Please try again."
                          );
                        },
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="tw:bg-[#EFF3F8] tw:py-10 tw:grow">
            {/* Flexible Dates */}
            <FlexibleDates
              flexibleDates={flexibleDates}
              selectedFlexibleDate={selectedFlexibleDate}
              handleFlexibleDateClick={handleFlexibleDateClick}
              setIsCalendarOpen={setIsCalendarOpen}
              isLoading={isPricesLoading}
            />

            {/* Progress Bar */}
            <div className="container tw:!py-[30px]">
              <Progress isLoading={isLoading || isMulticityLoading} />
            </div>

            {/* Flight Search Results */}
            <div className="container">
              <div className="tw:flex tw:gap-[30px]">
                <div className="tw:w-[270px] tw:shrink-0 tw:hidden tw:lg:block">
                  <SearchFilterSidebar
                    flightOffersData={
                      tripType === "multicity"
                        ? multicityResults
                        : flightOffersData
                    }
                    FilterComponent={FilterComponent}
                  />
                </div>
                <div className="tw:grow">
                  <FlightSearchResults
                    flightOffersData={
                      tripType === "multicity"
                        ? multicityResults
                        : flightOffersData
                    }
                    searchContext={searchContext}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </SidebarFilterProvider>

      {/* Flexible Dates Calendar Modal */}
      <FlexibleDatesCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        priceData={priceData}
        isLoading={isPricesLoading}
      />
    </>
  );
};

export default FlightSearchPage;
