import { RiPlaneLine } from "react-icons/ri";
import { memo } from "react";
import {
  formatDurationFromMinutes,
  formatDateFromISO,
} from "@/lib/flight-utils";
import AirlineLogo from "@/components/ui/airline-logo";
import BaggageIcons from "./baggage-icons";
import PropTypes from "prop-types";

const UnifiedFlightSegment = memo(
  ({ segment, tripType, segmentIndex, totalSegments, segmentLabel, baggageInfo }) => {
    // Handle different data structures based on trip type
    const flights = segment.flights || [];
    if (flights.length === 0) return null;

    const firstFlight = flights[0];
    const lastFlight = flights[flights.length - 1];

    // Calculate total duration for this segment
    const totalDurationMinutes =
      segment.totalDurationMinutes ||
      flights.reduce((acc, flight) => acc + (flight.durationMinutes || 0), 0);

    // Safely get flight times and airports
    const departureTime = firstFlight.departure?.time || "00:00";
    const arrivalTime = lastFlight.arrival?.time || "00:00";
    const departureAirport =
      firstFlight.departure?.airport ||
      firstFlight.departure?.iataCode ||
      "N/A";
    const arrivalAirport =
      lastFlight.arrival?.airport || lastFlight.arrival?.iataCode || "N/A";
    const airlineCode = firstFlight.airlineCode || "XX";
    const flightNumber = firstFlight.flightNumber || "0000";

    // Determine segment type for labeling
    const getSegmentTypeLabel = () => {
      if (tripType === "round-trip") {
        return segmentIndex === 0 ? "Outbound" : "Return";
      } else if (tripType === "multi-city") {
        return segmentLabel || `Segment ${segmentIndex + 1}`;
      }
      return ""; // No label for one-way
    };

    const segmentTypeLabel = getSegmentTypeLabel();

    return (
      <div className="tw:flex tw:flex-col tw:gap-4">
        {/* Segment Label */}
        {segmentTypeLabel && (
          <div className="tw:flex tw:items-center tw:justify-between tw:border tw:rounded-md tw:border-gray-300 tw:py-2 tw:px-4">
            <h4 className="tw:!text-base tw:font-semibold tw:text-[#5D586C]">
              {segmentTypeLabel}
            </h4>
            <span className="tw:text-sm tw:text-gray-700">
              {formatDateFromISO(firstFlight.departure.at)}
            </span>
          </div>
        )}

        {/* Flight Details */}
        <div className="tw:flex tw:items-center tw:justify-between tw:flex-col tw:gap-4 tw:md:gap-0">
          {/* Airline Logo & Details */}
          <div className="tw:flex tw:flex-col tw:justify-center tw:items-center tw:gap-0.5 tw:text-center">
            <AirlineLogo
              code={airlineCode}
              name={firstFlight.airline}
              className="tw:w-[120px] tw:-mt-[35px] tw:mr-4"
              fallbackClassName="tw:w-[120px] tw:h-[60px]"
            />
            <span className="tw:text-sm tw:text-secondary tw:mb-6 tw:-mt-[25px]">
              {firstFlight.airline || airlineCode}
            </span>
            <span className="tw:text-sm tw:text-secondary tw:-mt-[25px]">
              {airlineCode} - {flightNumber}
            </span>

            {/* Baggage Icons */}
            {baggageInfo?.travelerPricings && (
              <div className="tw:mt-4">
                <BaggageIcons travelerPricings={baggageInfo.travelerPricings} />
              </div>
            )}
          </div>

          {/* Flight Path & Times */}
          <div className="tw:flex tw:items-center tw:gap-6 tw:grow tw:justify-between tw:w-full">
            {/* Departure */}
            <div className="tw:flex tw:flex-col tw:gap-1 tw:text-right">
              <span className="tw:font-semibold tw:text-[20px]">
                {departureTime}
              </span>
              <span className="tw:text-sm tw:text-[#5D586C]">
                {departureAirport}
              </span>
              <span className="tw:text-sm tw:text-[#5D586C]">
                {firstFlight.departure?.at
                  ? formatDateFromISO(firstFlight.departure.at)
                  : ""}
              </span>
            </div>

            {/* Duration & Stops */}
            <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:grow">
              <div className="tw:flex tw:flex-col tw:text-center tw:gap-1 tw:w-full">
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
                      .map(
                        (flight) =>
                          flight.arrival?.airport ||
                          flight.arrival?.iataCode ||
                          "N/A"
                      );
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
              <RiPlaneLine
                size={24}
                className="tw:text-secondary tw:rotate-90"
              />
            </div>

            {/* Arrival */}
            <div className="tw:flex tw:flex-col tw:gap-1 tw:text-left">
              <span className="tw:font-semibold tw:text-[20px]">
                {arrivalTime}
              </span>
              <span className="tw:text-sm tw:text-[#5D586C]">
                {arrivalAirport}
              </span>
              <span className="tw:text-sm tw:text-[#5D586C]">
                {lastFlight.arrival?.at
                  ? formatDateFromISO(lastFlight.arrival.at)
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Trip Information */}
        <div className="tw:text-sm tw:text-center tw:text-[#A5A2AD] tw:space-x-2">
          <span>
            Journey duration: {formatDurationFromMinutes(totalDurationMinutes)}
          </span>
          {flights.length > 1 && (
            <span>
              | {flights.length - 1} stop{flights.length > 2 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    );
  }
);

UnifiedFlightSegment.displayName = "UnifiedFlightSegment";

UnifiedFlightSegment.propTypes = {
  segment: PropTypes.shape({
    flights: PropTypes.arrayOf(
      PropTypes.shape({
        departure: PropTypes.shape({
          time: PropTypes.string.isRequired,
          airport: PropTypes.string.isRequired,
          at: PropTypes.string.isRequired,
        }).isRequired,
        arrival: PropTypes.shape({
          time: PropTypes.string.isRequired,
          airport: PropTypes.string.isRequired,
          at: PropTypes.string.isRequired,
        }).isRequired,
        airline: PropTypes.string,
        airlineCode: PropTypes.string.isRequired,
        flightNumber: PropTypes.string.isRequired,
        durationMinutes: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  tripType: PropTypes.oneOf(["one-way", "round-trip", "multi-city"]).isRequired,
  segmentIndex: PropTypes.number.isRequired,
  totalSegments: PropTypes.number.isRequired,
  segmentLabel: PropTypes.string,
  baggageInfo: PropTypes.shape({
    hasCabinBaggage: PropTypes.bool,
    hasCheckedBaggage: PropTypes.bool,
    baggageDetails: PropTypes.shape({
      cabin: PropTypes.array,
      checked: PropTypes.array,
    }),
  }),
};

export default UnifiedFlightSegment;
