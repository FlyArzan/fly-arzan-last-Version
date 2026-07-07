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
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { parseDateFromURL, formatDateForURL } from "@/lib/flight-utils";
import { useSessionStorage } from "usehooks-ts";

import OneWayFilter from "@/components/ui/one-way-filter";
import RoundTripFilter from "@/components/ui/round-trip-filter";
import BreadcrumbSchema from "@/components/Schemas/BreadcrumbSchema";

const FLIGHT_SEARCH_PAGE_URL = "https://flyarzan.com/search/flight";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const FLIGHT_SEARCH_DESCRIPTION =
  "Experience the best flight search with FlyArzan. Compare flights from top airlines, find the best deals, and book your next trip with ease. Travel smarter!";

const FlightSearchPage = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [multicityValues, setMulticityValues] = useState(null);
  const [multicityResults, setMulticityResults] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Session storage for all flight form data
  const [sessionData, setSessionData] = useSessionStorage("selected-flight", null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get trip type from session storage or default to one-way
  const tripType = sessionData?.type || "one-way";

  // Hydrate the search from the URL query string when there's no session yet.
  // This makes /search/flight links work on ANY device — e.g. opened fresh on a
  // phone or from another app — instead of only in the tab where the search was
  // performed (the previous behaviour caused a blank/skeleton page on mobile).
  useEffect(() => {
    if (sessionData) return; // a search already exists in this session
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const depart = searchParams.get("depart");
    if (!from || !to || !depart) return;
    setSessionData({
      type: searchParams.get("type") || "one-way",
      flyingFrom: { city: searchParams.get("fromCity") || "", iataCode: from },
      flyingTo: { city: searchParams.get("toCity") || "", iataCode: to },
      travellers: {
        cabin: searchParams.get("cabin") || "economy",
        adults: Number(searchParams.get("adults") || 1),
        children: Number(searchParams.get("children") || 0),
      },
      depart,
      return: searchParams.get("return") || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect the active one-way/round-way search into the address bar so the
  // link is shareable and re-openable on other devices.
  useEffect(() => {
    if (!sessionData || sessionData.type === "multicity") return;
    const fmtDate = (d) =>
      !d ? "" : typeof d === "string" ? d : formatDateForURL(d);
    const params = new URLSearchParams();
    params.set("type", sessionData.type || "one-way");
    if (sessionData.flyingFrom?.iataCode)
      params.set("from", sessionData.flyingFrom.iataCode);
    if (sessionData.flyingFrom?.city)
      params.set("fromCity", sessionData.flyingFrom.city);
    if (sessionData.flyingTo?.iataCode)
      params.set("to", sessionData.flyingTo.iataCode);
    if (sessionData.flyingTo?.city)
      params.set("toCity", sessionData.flyingTo.city);
    if (sessionData.depart) params.set("depart", fmtDate(sessionData.depart));
    if (sessionData.return) params.set("return", fmtDate(sessionData.return));
    params.set("adults", String(sessionData.travellers?.adults ?? 1));
    params.set("children", String(sessionData.travellers?.children ?? 0));
    params.set("cabin", sessionData.travellers?.cabin || "economy");
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData]);

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
  const {
    mutate: searchMulticityFlights,
    isPending: isMulticityLoading,
    isError: isMulticityError,
    error: multicityError,
  } = useMulticityFlightOffers();

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
                }),
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
                    "No complete trips were found for the selected cities and dates. Please try adjusting your search.",
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
    [initialValues, tripType, sessionData],
  );

  // Flight Offers (for one-way and round-way)
  const {
    isLoading,
    error: flightOffersError,
    data: flightOffersData,
  } = useFlightOffers(flightOffersParams);

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
    ],
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
      <BreadcrumbSchema
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Flight Search", url: "/search/flight" },
        ]}
      />
      <Helmet>
        <title>Best Flight Search – Find the Best Deals | FlyArzan</title>
        <meta name="description" content={FLIGHT_SEARCH_DESCRIPTION} />
        <link rel="canonical" href={FLIGHT_SEARCH_PAGE_URL} />
        <meta property="og:url" content={FLIGHT_SEARCH_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Best Flight Search – Find the Best Deals | FlyArzan"
        />
        <meta property="og:description" content={FLIGHT_SEARCH_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={FLIGHT_SEARCH_PAGE_URL} />
        <meta
          name="twitter:title"
          content="Best Flight Search – Find the Best Deals | FlyArzan"
        />
        <meta name="twitter:description" content={FLIGHT_SEARCH_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
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
                {tripType === "one-way" && (
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
                              "No complete trips were found for the selected cities and dates. Please try adjusting your search.",
                            );
                          }
                          // Store results in state for FlightSearchResults component
                          setMulticityResults(data);
                        },
                        onError: (error) => {
                          console.error("Multi-city search error:", error);
                          toast.error(
                            "Failed to search flights. Please try again.",
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
                    error={
                      tripType === "multicity"
                        ? isMulticityError
                          ? multicityError
                          : null
                        : flightOffersError
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
