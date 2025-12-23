import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiVerifiedBadgeFill,
  RiPercentFill,
  RiFlashlightFill,
  RiFilterFill,
  RiPlaneLine,
} from "react-icons/ri";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSidebarFilter } from "@/providers/filter-sidebar-provider";
import { Skeleton } from "@/components/ui/skeleton";
import OneWayFlightCard from "@/components/ui/one-way-flight-card";
import RoundTripFlightCard from "@/components/ui/round-trip-flight-card";
import BaggageIcons from "@/components/ui/baggage-icons";
import { useRegionalSettings } from "../../context/RegionalSettingsContext";
import { generateAndStoreSimilarFlights } from "../../utils/similarFlightsUtils";
import { generateForwardLink } from "../../utils/forwardLinkUtils";
import PropTypes from "prop-types";
import { logClickOutEvent } from "@/lib/analytics";

import {
  timeToMinutes,
  formatDurationFromMinutes,
  processFlightOffer,
  getAirlineLogoUrl,
  formatDateFromISO,
} from "@/lib/flight-utils";

const FlightSearchResults = ({ flightOffersData, searchContext }) => {
  const navigate = useNavigate();
  const { openMobile, setOpenMobile } = useSidebarFilter();
  const { regionalSettings, convertPrice, selectedCurrencySymbol } =
    useRegionalSettings();
  const [selectedTimeCost, setSelectedTimeCost] = useState("best");
  const [processedFlights, setProcessedFlights] = useState([]);
  const [timeCostFilters, setTimeCostFilters] = useState([
    {
      id: "best",
      title: "Best",
      duration: "0h 00m",
      price: "$0",
      icon: <RiVerifiedBadgeFill size={24} />,
      showInMobile: true,
    },
    {
      id: "cheapest",
      title: "Cheapest",
      duration: "0h 00m",
      price: "$0",
      icon: <RiPercentFill size={24} />,
      showInMobile: true,
    },
    {
      id: "fastest",
      title: "Fastest",
      duration: "0h 00m",
      price: "$0",
      icon: <RiFlashlightFill size={24} />,
      showInMobile: true,
    },
  ]);
  const [visibleCount, setVisibleCount] = useState(14);

  // Optimized data processing using utility functions
  const processAmadeusData = useMemo(
    () => (data) => {
      if (!data?.data) return [];

      return data.data
        .map((offer, index) =>
          processFlightOffer(offer, index, data.dictionaries)
        )
        .filter(Boolean);
    },
    []
  );

  const generateTimeCostFilters = useCallback(
    (flights) => {
      if (flights.length === 0) {
        setTimeCostFilters([
          {
            id: "best",
            title: "Best",
            duration: "0h 00m",
            price: "$0",
            icon: <RiVerifiedBadgeFill size={24} />,
            showInMobile: true,
          },
          {
            id: "cheapest",
            title: "Cheapest",
            duration: "0h 00m",
            price: "$0",
            icon: <RiPercentFill size={24} />,
            showInMobile: true,
          },
          {
            id: "fastest",
            title: "Fastest",
            duration: "0h 00m",
            price: "$0",
            icon: <RiFlashlightFill size={24} />,
            showInMobile: true,
          },
        ]);
        return;
      }

      const cheapestOption = flights.reduce((prev, current) =>
        prev.price < current.price ? prev : current
      );

      const fastestOption = flights.reduce((prev, current) =>
        prev.totalDurationMinutes < current.totalDurationMinutes
          ? prev
          : current
      );

      // A more balanced "best" option: not the absolute cheapest if it's excessively long.
      // We'll score based on a combination of price and duration.
      const bestOption = flights.reduce((prev, current) => {
        // Lower score is better. Penalize long durations more heavily.
        const prevScore = prev.price + prev.totalDurationMinutes * 0.5; // Adjust multiplier as needed
        const currentScore = current.price + current.totalDurationMinutes * 0.5;
        return prevScore < currentScore ? prev : current;
      });

      setTimeCostFilters([
        {
          id: "best",
          title: "Best",
          duration: formatDurationFromMinutes(bestOption.totalDurationMinutes),
          price: `${selectedCurrencySymbol}${convertPrice(bestOption.price)}`,
          icon: <RiVerifiedBadgeFill size={24} />,
          showInMobile: true,
        },
        {
          id: "cheapest",
          title: "Cheapest",
          duration: formatDurationFromMinutes(
            cheapestOption.totalDurationMinutes
          ),
          price: `${selectedCurrencySymbol}${convertPrice(
            cheapestOption.price
          )}`,
          icon: <RiPercentFill size={24} />,
          showInMobile: true,
        },
        {
          id: "fastest",
          title: "Fastest",
          duration: formatDurationFromMinutes(
            fastestOption.totalDurationMinutes
          ),
          price: `${selectedCurrencySymbol}${convertPrice(
            fastestOption.price
          )}`,
          icon: <RiFlashlightFill size={24} />,
          showInMobile: true,
        },
      ]);
    },
    [selectedCurrencySymbol, convertPrice]
  );

  useEffect(() => {
    // Check if there is valid flight data to process
    if (flightOffersData?.data && flightOffersData.data.length > 0) {
      const flights = processAmadeusData(flightOffersData);
      setProcessedFlights(flights);
      generateTimeCostFilters(flights);
    } else {
      // Handle the case where there are no flight offers
      setProcessedFlights([]);
      generateTimeCostFilters([]); // Explicitly call with an empty array
    }
  }, [flightOffersData, processAmadeusData, generateTimeCostFilters]);

  const { filters } = useSidebarFilter();

  const sortedFlights = useMemo(() => {
    let filtered = [...processedFlights];

    // Apply filters
    if (filters.stops.length > 0) {
      filtered = filtered.filter((flight) => {
        return flight.itineraries.every((itinerary) =>
          filters.stops.includes(itinerary.flights.length - 1)
        );
      });
    }

    if (filters.airlines.length > 0) {
      filtered = filtered.filter((flight) =>
        flight.carrierCodes.some((code) => filters.airlines.includes(code))
      );
    }

    if (filters.baggage.length > 0) {
      filtered = filtered.filter((flight) => {
        const matchesChecked =
          !filters.baggage.includes("checked") || flight.hasCheckedBaggage;
        const matchesCabin =
          !filters.baggage.includes("cabin") || flight.hasCabinBaggage;
        return matchesChecked && matchesCabin;
      });
    }

    // Departure time filter
    filtered = filtered.filter((flight) => {
      const departureTime = timeToMinutes(
        flight.itineraries[0].flights[0].departure.time
      );
      return (
        departureTime >= filters.departureTime.min &&
        departureTime <= filters.departureTime.max
      );
    });

    // Journey duration filter
    filtered = filtered.filter(
      (flight) =>
        flight.totalDurationMinutes >= filters.journeyDuration.min &&
        flight.totalDurationMinutes <= filters.journeyDuration.max
    );

    let sorted = filtered;
    if (selectedTimeCost === "cheapest") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (selectedTimeCost === "fastest") {
      sorted.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    } else if (selectedTimeCost === "best") {
      sorted.sort(
        (a, b) =>
          a.price +
          a.totalDurationMinutes * 0.5 -
          (b.price + b.totalDurationMinutes * 0.5)
      );
    }
    return sorted;
  }, [processedFlights, selectedTimeCost, filters]);

  // Reset visible count when sorting changes
  useEffect(() => {
    setVisibleCount(14);
  }, [selectedTimeCost]);

  if (!flightOffersData) {
    return (
      <div className="tw:flex tw:flex-col tw:gap-6">
        <Skeleton className="tw:h-10 tw:w-full" />
        {Array.from({ length: 14 }).map((_, index) => (
          <Skeleton key={index} className="tw:h-[100px] tw:w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="tw:flex tw:flex-col tw:gap-6">
      {/* List Header */}
      <h4 className="tw:lg:hidden tw:text-[15px] tw:font-medium tw:!mb-2 tw:text-center">
        {sortedFlights.length} results sorted by{" "}
        <span className="tw:uppercase tw:font-semibold">
          {selectedTimeCost}
        </span>
      </h4>
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:h-7">
        <h4 className="tw:hidden tw:lg:block tw:text-[15px] tw:font-medium">
          {sortedFlights.length} results sorted by{" "}
          <span className="tw:uppercase tw:font-semibold">
            {selectedTimeCost}
          </span>
        </h4>
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="tw:flex tw:lg:hidden tw:items-center tw:justify-between tw:gap-2 tw:py-2 tw:px-3 tw:!rounded-md tw:border tw:border-muted tw:bg-white tw:text-[15px] tw:font-semibold tw:shadow-xs tw:transition tw:outline-none focus-visible:tw:border-primary focus-visible:tw:ring-0 disabled:tw:cursor-not-allowed disabled:tw:opacity-50"
        >
          <RiFilterFill size={24} />
          <span>Filter</span>
        </button>
        <div className="tw:flex tw:items-center tw:gap-2 tw:relative">
          <span className="tw:whitespace-nowrap tw:font-medium">Sort By</span>
          <Select
            value={selectedTimeCost}
            onValueChange={(value) => setSelectedTimeCost(value)}
          >
            <SelectTrigger className="tw:px-4 tw:py-2 tw:min-w-[183px]">
              <SelectValue placeholder="Best" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Best</SelectItem>
              <SelectItem value="cheapest">Cheapest</SelectItem>
              <SelectItem value="fastest">Fastest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time Cost Filter */}
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:shadow tw:grow tw:md:divide-x tw:md:divide-y-0 tw:divide-y tw:divide-muted tw:bg-white tw:rounded-md">
        {timeCostFilters.map((data) => {
          return (
            <label
              key={data.id}
              className={cn(
                "tw:snap-center tw:w-full tw:md:basis-[100px] tw:shrink-0 tw:items-center tw:!flex tw:justify-between tw:gap-1 tw:!py-3 tw:!px-[20px] tw:!mb-0 tw:cursor-pointer tw:grow tw:text-center tw:md:h-[57px] tw:first:rounded-t-md tw:md:first:rounded-t-none tw:last:rounded-b-md tw:md:last:rounded-b-none tw:md:first:rounded-l-md tw:md:last:rounded-r-md",
                selectedTimeCost === data.id
                  ? "tw:bg-primary tw:text-white"
                  : "tw:text-secondary"
              )}
              onClick={() => setSelectedTimeCost(data.id)}
            >
              <div className="tw:flex tw:items-center tw:gap-2">
                {data.icon}
                <div className="tw:text-left tw:text-sm">
                  <p>{data.title}</p>
                  <p className="tw:font-medium">{data.duration}</p>
                </div>
              </div>
              <span className="tw:text-[20px] tw:font-semibold">
                {data.price}
              </span>
            </label>
          );
        })}
      </div>

      {/* Available Flight List */}
      <div className="tw:grid tw:grid-cols-1 tw:gap-[30px]">
        {sortedFlights.length > 0 ? (
          sortedFlights.slice(0, visibleCount).map((itinerary) => {
            // FIRST: Check if this is actually a multi-city based on search context
            // Multi-city flights can have 2+ itineraries but should not be treated as round-trip
            const isActualMultiCity =
              searchContext?.tripType === "multicity" ||
              (searchContext?.segments && searchContext.segments.length > 0);

            if (
              isActualMultiCity &&
              itinerary.itineraries &&
              itinerary.itineraries.length > 1
            ) {
              // Multi-city flight - handle session storage
              const handleMultiCitySelect = () => {
                // Get all the airlines
                const airlinesInfo = itinerary.itineraries
                  .flatMap((it) => it.flights)
                  .map((f) => ({
                    airlineCode: f.operating?.carrierCode || f.airlineCode,
                    airlineName: f.operating?.airlineName || f.airlineName,
                  }));

                const flightDetailsData = {
                  tripType: "multi-city",
                  flightOffer: itinerary,
                  searchParams: searchContext?.searchParams || {},
                  passengerInfo: {
                    adults: searchContext?.adults || 1,
                    children: searchContext?.children || 0,
                    cabin: searchContext?.travelClass || "Economy",
                  },
                  routeInfo: {
                    segments: itinerary.itineraries.map((seg, index) => ({
                      segmentNumber: index + 1,
                      from: {
                        city:
                          seg.flights[0].departure.city ||
                          seg.flights[0].departure.cityName ||
                          searchContext?.segments?.[index]?.from?.city ||
                          seg.flights[0].departure.iataCode,
                        airport:
                          seg.flights[0].departure.airport ||
                          seg.flights[0].departure.iataCode,
                        iataCode: seg.flights[0].departure.iataCode,
                      },
                      to: {
                        city:
                          seg.flights[seg.flights.length - 1].arrival.city ||
                          seg.flights[seg.flights.length - 1].arrival
                            .cityName ||
                          searchContext?.segments?.[index]?.to?.city ||
                          seg.flights[seg.flights.length - 1].arrival.iataCode,
                        airport:
                          seg.flights[seg.flights.length - 1].arrival.airport ||
                          seg.flights[seg.flights.length - 1].arrival.iataCode,
                        iataCode:
                          seg.flights[seg.flights.length - 1].arrival.iataCode,
                      },
                      departureDate: seg.flights[0].departure.at,
                    })),
                    airlines: airlinesInfo,
                  },
                  regionalSettings: regionalSettings,
                };

                // Generate forward URL and add to flight details
                const forwardUrl = generateForwardLink(flightDetailsData);
                flightDetailsData.forwardUrl = forwardUrl;

                sessionStorage.setItem(
                  "selected-flight-details",
                  JSON.stringify(flightDetailsData)
                );

                // Generate and store similar flights
                try {
                  generateAndStoreSimilarFlights(itinerary, sortedFlights, 5);
                } catch (error) {
                  console.warn("Failed to generate similar flights:", error);
                }

                // Log click-out event (fire-and-forget)
                if (itinerary.itineraries.length > 0) {
                  const firstSeg = itinerary.itineraries[0];
                  const lastSeg =
                    itinerary.itineraries[itinerary.itineraries.length - 1];
                  logClickOutEvent({
                    origin: firstSeg.flights[0].departure.iataCode,
                    destination:
                      lastSeg.flights[lastSeg.flights.length - 1].arrival
                        .iataCode,
                    tripType: "multi-city",
                    partner: airlinesInfo[0]?.airlineCode,
                  });
                }

                navigate("/flight/details");
              };

              return (
                <div
                  key={itinerary.id}
                  className="tw:rounded-xl tw:bg-white tw:shadow tw:p-4 tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:justify-between"
                >
                  {/* Flight Details Section */}
                  <div className="tw:flex tw:flex-col tw:justify-between tw:grow tw:gap-4 tw:pl-[10px] tw:mb-8 tw:md:mb-0">
                    {itinerary.itineraries.map((segment, index) => {
                      const flights = segment.flights;
                      const firstFlight = flights[0];
                      const lastFlight = flights[flights.length - 1];
                      const totalDurationMinutes = flights.reduce(
                        (acc, flight) => acc + flight.durationMinutes,
                        0
                      );

                      return (
                        <div key={index}>
                          {/* FlightSegment - copied from round-trip */}
                          <div className="tw:flex tw:items-center tw:justify-between tw:flex-col tw:gap-4 tw:md:gap-0 tw:md:flex-row">
                            {/* Airline Logo, Code */}
                            <div className="tw:flex tw:flex-col tw:justify-center tw:items-center tw:gap-0.5 tw:text-center">
                              {getAirlineLogoUrl(firstFlight.airlineCode) ? (
                                <img
                                  src={getAirlineLogoUrl(
                                    firstFlight.airlineCode
                                  )}
                                  alt={firstFlight.airline}
                                  className="tw:w-[120px] tw:-mt-[35px]"
                                />
                              ) : (
                                <div className="tw:w-[120px] tw:h-[60px] tw:flex tw:items-center tw:justify-center tw:bg-gray-100 tw:rounded">
                                  <span className="tw:text-sm tw:text-gray-500">
                                    {firstFlight.airlineCode}
                                  </span>
                                </div>
                              )}
                              <span className="tw:text-sm tw:text-secondary tw:-mt-[25px]">
                                {firstFlight.airlineCode} -{" "}
                                {firstFlight.flightNumber}
                              </span>
                            </div>

                            {/* Time, Stop, Airline */}
                            <div className="tw:flex tw:items-center tw:gap-6 tw:grow tw:justify-center tw:px-6 tw:w-full tw:md:w-fit">
                              {/* Depart */}
                              <div className="tw:flex tw:flex-col tw:gap-1 tw:text-right">
                                <span className="tw:font-semibold tw:text-[20px]">
                                  {firstFlight.departure.time}
                                </span>
                                <span className="tw:text-sm tw:text-[#5D586C]">
                                  {firstFlight.departure.airport}
                                </span>
                                <span className="tw:text-sm tw:text-[#5D586C] tw:whitespace-nowrap">
                                  {formatDateFromISO(firstFlight.departure.at)}
                                </span>
                              </div>
                              {/* Duration & Stop */}
                              <div className="tw:flex tw:items-center tw:gap-2 tw:max-w-[300px] tw:w-full">
                                <div className="tw:flex tw:flex-col tw:text-center tw:gap-1 tw:w-full">
                                  <span className="tw:text-sm tw:font-semibold">
                                    {formatDurationFromMinutes(
                                      totalDurationMinutes
                                    )}
                                  </span>
                                  <span className="tw:h-px tw:w-full tw:bg-secondary" />
                                  <span className="tw:text-sm tw:text-primary">
                                    {(() => {
                                      const stops = flights.length - 1;
                                      if (stops === 0) {
                                        return "Direct";
                                      }
                                      const stopAirports = flights
                                        .slice(0, stops)
                                        .map(
                                          (flight) => flight.arrival.airport
                                        );
                                      return (
                                        <>
                                          {`${stops} Stop${
                                            stops > 1 ? "s" : ""
                                          }`}{" "}
                                          {stopAirports.map(
                                            (airport, airportIndex) => (
                                              <strong
                                                key={airportIndex}
                                                className="tw:text-[#5D586C] tw:font-normal!"
                                              >
                                                {airport}
                                                {airportIndex <
                                                stopAirports.length - 1
                                                  ? ", "
                                                  : ""}
                                              </strong>
                                            )
                                          )}
                                        </>
                                      );
                                    })()}
                                  </span>
                                </div>
                                <RiPlaneLine
                                  size={24}
                                  className="tw:text-secondary tw:rotate-90"
                                />
                              </div>
                              {/* Arrival */}
                              <div className="tw:flex tw:flex-col tw:gap-1 tw:text-left">
                                <span className="tw:font-semibold tw:text-[20px]">
                                  {lastFlight.arrival.time}
                                </span>
                                <span className="tw:text-sm tw:text-[#5D586C]">
                                  {lastFlight.arrival.airport}
                                </span>
                                <span className="tw:text-sm tw:text-[#5D586C] tw:whitespace-nowrap">
                                  {formatDateFromISO(lastFlight.arrival.at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Select Button */}
                  <div className="tw:w-full tw:md:w-fit tw:py-4 tw:px-6 tw:bg-[#F2FAFF] tw:rounded-xl tw:flex tw:flex-col tw:items-center tw:gap-3 tw:md:ml-4">
                    {/* Baggage Icons */}
                    <BaggageIcons
                      travelerPricings={
                        itinerary.originalOffer?.travelerPricings
                      }
                    />

                    <button
                      onClick={handleMultiCitySelect}
                      className="tw:w-full tw:md:w-fit tw:bg-primary tw:py-2 tw:px-[30px] tw:flex tw:flex-col tw:text-white! tw:rounded-full! hover:tw:bg-primary/90 tw:transition-colors"
                    >
                      <span className="tw:text-sm">Select</span>
                      <span className="tw:text-base tw:font-medium">
                        {selectedCurrencySymbol}
                        {convertPrice(itinerary.price)}
                      </span>
                    </button>
                    {/* <span className="tw:text-sm tw:text-[#939393]">
                      {regionalSettings?.currency?.symbol || "$"}{itinerary.totalPrice || itinerary.price} Total
                    </span> */}
                  </div>
                </div>
              );
            }

            // SECOND: Check if this is a round-trip (only if NOT multi-city)
            if (!isActualMultiCity && itinerary.tripType === "round-trip") {
              return (
                <RoundTripFlightCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  searchContext={searchContext}
                  allAvailableFlights={sortedFlights}
                />
              );
            }

            // THIRD: Single itinerary (one-way or single segment)
            const oneWayItinerary = {
              ...itinerary,
              ...itinerary.itineraries[0],
              departure: itinerary.itineraries[0].flights[0].departure,
              arrival:
                itinerary.itineraries[0].flights[
                  itinerary.itineraries[0].flights.length - 1
                ].arrival,
            };
            return (
              <OneWayFlightCard
                key={itinerary.id}
                itinerary={oneWayItinerary}
                searchContext={searchContext}
                allAvailableFlights={sortedFlights}
              />
            );
          })
        ) : (
          <div className="tw:text-center tw:py-12 tw:text-muted-foreground">
            No flights found matching your criteria.
          </div>
        )}

        {visibleCount < sortedFlights.length ? (
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="tw:flex tw:!mx-auto tw:items-center tw:gap-1.5 tw:hover:bg-primary/90 tw:px-[40px] tw:h-[56px] tw:!text-white tw:font-semibold tw:!rounded-[40px] tw:bg-primary tw:transition-colors"
          >
            <span>Explore More</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          sortedFlights.length > 0 && (
            <div className="tw:text-center tw:py-4 tw:text-muted-foreground">
              All offers loaded.
            </div>
          )
        )}
      </div>
    </div>
  );
};

FlightSearchResults.propTypes = {
  flightOffersData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    dictionaries: PropTypes.shape({
      carriers: PropTypes.object,
    }),
  }),
  searchContext: PropTypes.shape({
    searchParams: PropTypes.object,
    adults: PropTypes.number,
    children: PropTypes.number,
    travelClass: PropTypes.string,
    fromCity: PropTypes.string,
    toCity: PropTypes.string,
    tripType: PropTypes.string,
  }),
};

export default FlightSearchResults;
