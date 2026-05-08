import { useNavigate } from "react-router-dom";
import { RiPlaneLine } from "react-icons/ri";
import { Loader } from "lucide-react";
import { memo, useState } from "react";
import {
  getAirlineLogoUrl,
  formatDurationFromMinutes,
  formatDateFromISO,
} from "@/lib/flight-utils";
import { useRegionalSettings } from "../../context/RegionalSettingsContext";
import { generateAndStoreSimilarFlights } from "../../utils/similarFlightsUtils";
import { generateForwardLink } from "../../utils/forwardLinkUtils";
import BaggageIcons from "./baggage-icons";
import PropTypes from "prop-types";
import { logClickOutEvent } from "@/lib/analytics";

const FlightSegment = ({ flights }) => {
  if (!flights || flights.length === 0) return null;

  const firstFlight = flights[0];
  const lastFlight = flights[flights.length - 1];
  const totalDurationMinutes = flights.reduce(
    (acc, flight) => acc + flight.durationMinutes,
    0
  );

  return (
    <div className="tw:flex tw:items-center tw:justify-between tw:flex-col tw:gap-4 tw:md:gap-0 tw:md:flex-row">
      {/* Airline Logo, Code */}
      <div className="tw:flex tw:flex-col tw:justify-center tw:items-center tw:gap-0.5 tw:text-center">
        {getAirlineLogoUrl(firstFlight.airlineCode) ? (
          <img
            src={getAirlineLogoUrl(firstFlight.airlineCode)}
            alt={`${firstFlight.airline || firstFlight.airlineCode} airline logo`}
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
          {firstFlight.airlineCode} - {firstFlight.flightNumber}
        </span>
      </div>

      {/* Time, Stop, Airline */}
      <div className="tw:flex tw:items-center tw:gap-6 tw:grow tw:justify-center">
        {/* Depart */}
        <div className="tw:flex tw:flex-col tw:gap-1 tw:text-right">
          <span className="tw:font-semibold tw:text-[20px]">
            {firstFlight.departure.time}
          </span>
          <span className="tw:text-sm tw:text-[#5D586C]">
            {firstFlight.departure.airport}
          </span>
          <span className="tw:text-sm tw:text-[#5D586C]">
            {formatDateFromISO(firstFlight.departure.at)}
          </span>
        </div>
        {/* Duration & Stop */}
        <div className="tw:flex tw:items-center tw:gap-2">
          <div className="tw:flex tw:flex-col tw:text-center tw:gap-1">
            <span className="tw:text-sm tw:font-semibold">
              {formatDurationFromMinutes(totalDurationMinutes)}
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
                  .map((flight) => flight.arrival.airport);
                return (
                  <>
                    {`${stops} Stop${stops > 1 ? "s" : ""}`}{" "}
                    {stopAirports.map((airport, index) => (
                      <strong
                        key={index}
                        className="tw:text-[#5D586C] tw:!font-normal"
                      >
                        {airport}
                        {index < stopAirports.length - 1 ? ", " : ""}
                      </strong>
                    ))}
                  </>
                );
              })()}
            </span>
          </div>
          <RiPlaneLine size={24} className="tw:text-secondary tw:rotate-90" />
        </div>
        {/* Arrival */}
        <div className="tw:flex tw:flex-col tw:gap-1 tw:text-left">
          <span className="tw:font-semibold tw:text-[20px]">
            {lastFlight.arrival.time}
          </span>
          <span className="tw:text-sm tw:text-[#5D586C]">
            {lastFlight.arrival.airport}
          </span>
          <span className="tw:text-sm tw:text-[#5D586C]">
            {formatDateFromISO(lastFlight.arrival.at)}
          </span>
        </div>
      </div>
    </div>
  );
};

FlightSegment.propTypes = {
  flights: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const RoundTripFlightCard = ({
  itinerary,
  searchContext,
  allAvailableFlights = [],
}) => {
  const navigate = useNavigate();
  const { regionalSettings, convertPrice, selectedCurrencySymbol } =
    useRegionalSettings();
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const outboundFlights = itinerary.itineraries[0].flights;
  const returnFlights = itinerary.itineraries[1].flights;

  const handleFlightSelect = async () => {
    // If there's a custom onFlightSelect function (for similar flights), use that instead
    if (searchContext?.onFlightSelect) {
      searchContext.onFlightSelect();
      return;
    }

    setIsLoadingSimilar(true);

    try {
      // Store complete round-trip flight details in session storage
      const flightDetailsData = {
        tripType: "round-trip",
        flightOffer: itinerary,
        searchParams: searchContext?.searchParams || {},
        passengerInfo: {
          adults: searchContext?.adults || 1,
          children: searchContext?.children || 0,
          cabin: searchContext?.travelClass || "Economy",
        },
        routeInfo: {
          from: {
            city: outboundFlights[0].departure.city || searchContext?.fromCity,
            airport: outboundFlights[0].departure.airport,
            iataCode: outboundFlights[0].departure.iataCode,
          },
          to: {
            city:
              outboundFlights[outboundFlights.length - 1].arrival.city ||
              searchContext?.toCity,
            airport:
              outboundFlights[outboundFlights.length - 1].arrival.airport,
            iataCode:
              outboundFlights[outboundFlights.length - 1].arrival.iataCode,
          },
          departureDate: outboundFlights[0].departure.at,
          returnDate: returnFlights[0].departure.at,
          // Add airline information for both outbound and return flights
          outboundFlights: outboundFlights.map((flight) => ({
            airlineCode: flight.operating?.carrierCode || flight.airlineCode,
            airlineName: flight.operating?.airlineName || flight.airlineName,
            flightNumber: flight.flightNumber,
            departure: flight.departure,
            arrival: flight.arrival,
          })),
          returnFlights: returnFlights.map((flight) => ({
            airlineCode: flight.operating?.carrierCode || flight.airlineCode,
            airlineName: flight.operating?.airlineName || flight.airlineName,
            flightNumber: flight.flightNumber,
            departure: flight.departure,
            arrival: flight.arrival,
          })),
        },
        regionalSettings: regionalSettings,
      };

      // Generate forward URL and add to flight details
      const forwardUrl = generateForwardLink(flightDetailsData);
      flightDetailsData.forwardUrl = forwardUrl;

      // Store in session storage
      sessionStorage.setItem(
        "selected-flight-details",
        JSON.stringify(flightDetailsData)
      );

      // Generate and store similar flights using the passed available flights
      generateAndStoreSimilarFlights(itinerary, allAvailableFlights, 5);

      // Log click-out event (fire-and-forget) for round-trip
      const origin = outboundFlights?.[0]?.departure?.iataCode;
      const destination =
        returnFlights?.[returnFlights.length - 1]?.arrival?.iataCode ||
        outboundFlights?.[outboundFlights.length - 1]?.arrival?.iataCode;
      const partner =
        outboundFlights?.[0]?.operating?.carrierCode ||
        outboundFlights?.[0]?.airlineCode;
      if (origin && destination) {
        logClickOutEvent({
          origin,
          destination,
          tripType: "round-trip",
          partner,
        });
      }

      // Navigate to details page
      navigate("/flight/details");
    } catch (error) {
      console.warn("Failed to process flight selection:", error);
      setIsLoadingSimilar(false);
    }
  };

  return (
    <div
      key={itinerary.id}
      className="tw:rounded-xl tw:bg-white tw:shadow tw:p-4 tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:justify-between"
    >
      {/* Flight Details Section */}
      <div className="tw:flex tw:flex-col tw:justify-between tw:grow tw:gap-4 tw:pl-[10px] tw:mb-8 tw:md:mb-0">
        <FlightSegment flights={outboundFlights} />
        <FlightSegment flights={returnFlights} />
      </div>

      {/* Price Select Button */}
      <div className="tw:w-full tw:md:w-fit tw:py-4 tw:px-6 tw:bg-[#F2FAFF] tw:rounded-xl tw:flex tw:flex-col tw:items-center tw:gap-3 tw:md:ml-4">
        {/* Baggage Icons */}
        <BaggageIcons
          travelerPricings={itinerary.originalOffer?.travelerPricings}
        />

        <button
          onClick={handleFlightSelect}
          disabled={isLoadingSimilar}
          className="tw:w-full tw:md:w-fit tw:bg-primary tw:py-2 tw:px-[30px] tw:flex tw:flex-col tw:!text-white tw:!rounded-full hover:tw:bg-primary/90 tw:transition-colors disabled:tw:bg-gray-400 disabled:tw:cursor-not-allowed"
        >
          {isLoadingSimilar ? (
            <Loader className="tw:animate-spin tw:size-4" />
          ) : (
            <>
              <span className="tw:text-sm">Select</span>
              <span className="tw:text-base tw:font-medium">
                {selectedCurrencySymbol}
                {convertPrice(itinerary.price)}
              </span>
            </>
          )}
        </button>
        {/* <span className="tw:text-sm tw:text-[#939393]">
          {regionalSettings?.currency?.symbol || "$"}{itinerary.totalPrice} Total
        </span> */}
      </div>
    </div>
  );
};

RoundTripFlightCard.propTypes = {
  itinerary: PropTypes.shape({
    id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    itineraries: PropTypes.arrayOf(
      PropTypes.shape({
        flights: PropTypes.arrayOf(PropTypes.object).isRequired,
      })
    ).isRequired,
    hasCabinBaggage: PropTypes.bool,
    hasCheckedBaggage: PropTypes.bool,
    baggageDetails: PropTypes.shape({
      cabin: PropTypes.array,
      checked: PropTypes.array,
    }),
  }).isRequired,
  searchContext: PropTypes.shape({
    onFlightSelect: PropTypes.func,
    searchParams: PropTypes.object,
    adults: PropTypes.number,
    children: PropTypes.number,
    travelClass: PropTypes.string,
    fromCity: PropTypes.string,
    toCity: PropTypes.string,
  }),
  allAvailableFlights: PropTypes.array,
};

export default memo(RoundTripFlightCard);
