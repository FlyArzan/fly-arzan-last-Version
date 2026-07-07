import { format, parseISO } from "date-fns";

// Sensible default departure date (tomorrow) so search forms never show an
// empty Depart field when no date has been chosen yet.
export const getDefaultDepartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Helper to convert "HH:mm" to minutes from midnight
export const timeToMinutes = (timeStr) => {
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};

// Helper function to format duration from minutes to "Xh Ym" format
export const formatDurationFromMinutes = (minutes) => {
  if (isNaN(minutes) || minutes <= 0) return "0h 0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

// Helper function to format time from ISO date string
export const formatTimeFromISO = (dateTime) => {
  try {
    return format(parseISO(dateTime), "HH:mm");
  } catch {
    return "00:00";
  }
};

// Helper function to format date from ISO date string
export const formatDateFromISO = (dateTime) => {
  try {
    return format(parseISO(dateTime), "eee, dd MMM");
  } catch {
    return "";
  }
};

// Helper function to calculate total price
export const calculateTotalPrice = (priceData) => {
  // For Amadeus API: price.total is the complete price including all fees
  const totalPrice = parseFloat(priceData?.total) || parseFloat(priceData?.grandTotal) || 0;
  const basePrice = parseFloat(priceData?.base) || totalPrice;

  return {
    price: totalPrice, // This is the actual price to charge
    basePrice: basePrice, // Base fare without taxes/fees
    totalPrice: totalPrice, // Same as price for consistency
    currency: priceData?.currency || "USD",
  };
};

// Helper function to get airline logo URL based on carrier code
export const getAirlineLogoUrl = (carrierCode) => {
  if (!carrierCode) {
    return null;
  }
  // Construct the path using the carrier code.
  return `/logos/${carrierCode.toUpperCase()}.png`;
};


// Helper to parse duration from ISO format (PT4H25M) or minutes
export const parseDuration = (duration) => {
  if (typeof duration === "number") return duration;
  if (typeof duration === "string") {
    if (duration.startsWith("PT")) {
      // ISO 8601 format like "PT4H25M"
      const hoursMatch = duration.match(/(\d+)H/);
      const minutesMatch = duration.match(/(\d+)M/);
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      return hours * 60 + minutes;
    }
    return parseInt(duration) || 0;
  }
  return 0;
};

// Timezone-safe date utilities to prevent date shifting issues
export const createLocalDate = (dateString) => {
  if (!dateString) return null;

  // If it's already a Date object, return as is
  if (dateString instanceof Date) return dateString;

  // Parse date string in local timezone to prevent shifting
  const date = new Date(dateString + "T00:00:00");
  return isNaN(date.getTime()) ? null : date;
};

export const formatDateForURL = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";

  // Use local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateFromURL = (dateString) => {
  if (!dateString) return null;

  // Parse YYYY-MM-DD format in local timezone
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

// Optimized function to extract baggage information
// Simply checks quantity - no weight extraction
export const extractBaggageInfo = (offer) => {
  const fareDetails = offer.travelerPricings?.[0]?.fareDetailsBySegment || [];

  // Check if baggage info exists at all
  const hasCheckedBagInfo = fareDetails.some(segment => segment.includedCheckedBags);
  const hasCabinBagInfo = fareDetails.some(segment => segment.includedCabinBags);

  // Extract checked bag info - just quantity
  const checkedBagDetails = fareDetails
    .filter((segment) => segment.includedCheckedBags)
    .map((segment) => ({
      quantity: segment.includedCheckedBags.quantity || 0,
    }));

  // Extract cabin bag info - just quantity
  const cabinBagDetails = fareDetails
    .filter((segment) => segment.includedCabinBags)
    .map((segment) => ({
      quantity: segment.includedCabinBags.quantity || 0,
    }));

  const hasCheckedBaggage = checkedBagDetails.some(bag => bag.quantity > 0);
  const hasCabinBaggage = cabinBagDetails.some(bag => bag.quantity > 0);

  return {
    hasCheckedBaggage,
    hasCabinBaggage,
    hasCheckedBagInfo,  // true if the field exists, false if missing
    hasCabinBagInfo,    // true if the field exists, false if missing
    checkedBagDetails,
    cabinBagDetails,
  };
};

// Optimized function to extract operating carriers
export const extractOperatingCarriers = (offer) => {
  const operatingCarriers = new Set();

  offer.itineraries.forEach((itinerary) => {
    itinerary.segments.forEach((segment) => {
      const operatingCarrier =
        segment.operating?.carrierCode || segment.carrierCode;
      operatingCarriers.add(operatingCarrier);
    });
  });

  return Array.from(operatingCarriers);
};

// Memoized flight processing function
export const processFlightOffer = (offer, index, dictionaries) => {
  const { price: priceData } = offer;
  const { price, totalPrice, currency } = calculateTotalPrice(priceData);
  const isRoundTrip = offer.itineraries.length === 2;

  const processedItineraries = offer.itineraries.map((itinerary) => {
    const flights =
      itinerary.segments
        ?.map((segment) => {
          const carrierCode =
            segment.operating?.carrierCode || segment.carrierCode;
          const airlineName =
            dictionaries?.carriers?.[carrierCode] || "Unknown Airline";
          const durationMinutes = parseDuration(segment.duration);

          return {
            airline: airlineName,
            airlineCode: carrierCode,
            airlineName: airlineName, // Add explicit airline name
            flightNumber: `${carrierCode}${segment.number}`,
            departure: {
              time: formatTimeFromISO(segment.departure?.at),
              airport: segment.departure?.iataCode || "N/A",
              iataCode: segment.departure?.iataCode,
              city: dictionaries?.locations?.[segment.departure?.iataCode]?.cityCode,
              at: segment.departure?.at,
            },
            arrival: {
              time: formatTimeFromISO(segment.arrival?.at),
              airport: segment.arrival?.iataCode || "N/A",
              iataCode: segment.arrival?.iataCode,
              city: dictionaries?.locations?.[segment.arrival?.iataCode]?.cityCode,
              at: segment.arrival?.at,
            },
            duration: formatDurationFromMinutes(durationMinutes),
            durationMinutes,
            stops:
              segment.numberOfStops === 0
                ? "Direct"
                : `${segment.numberOfStops} Stop${
                    segment.numberOfStops > 1 ? "s" : ""
                  }`,
            // Add operating airline info for session storage
            operating: {
              carrierCode: segment.operating?.carrierCode || segment.carrierCode,
              airlineName: dictionaries?.carriers?.[segment.operating?.carrierCode || segment.carrierCode] || airlineName,
            },
          };
        })
        .filter(Boolean) || [];

    return {
      flights,
      totalDurationMinutes: flights.reduce(
        (acc, flight) => acc + flight.durationMinutes,
        0
      ),
    };
  });

  if (processedItineraries.some((it) => it.flights.length === 0)) {
    return null;
  }

  const baggageInfo = extractBaggageInfo(offer);
  const carrierCodes = extractOperatingCarriers(offer);
  const firstAirlineCode = processedItineraries[0]?.flights[0]?.airlineCode;

  return {
    id: `${index + 1}-${offer.id || Date.now()}`,
    price: Math.round(price * 100) / 100, // This is the complete price including fees
    totalPrice: Math.round(totalPrice * 100) / 100, // Same as price for consistency
    currency,
    logo: firstAirlineCode,
    airlineCode: firstAirlineCode,
    carrierCodes,
    itineraries: processedItineraries,
    hasCheckedBaggage: baggageInfo.hasCheckedBaggage,
    hasCabinBaggage: baggageInfo.hasCabinBaggage,
    baggageDetails: {
      checked: baggageInfo.checkedBagDetails,
      cabin: baggageInfo.cabinBagDetails,
    },
    totalDurationMinutes: processedItineraries.reduce(
      (acc, it) => acc + it.totalDurationMinutes,
      0
    ),
    tripType: isRoundTrip ? "round-trip" : "one-way",
    // Add original offer for advanced processing
    originalOffer: offer,
  };
};
