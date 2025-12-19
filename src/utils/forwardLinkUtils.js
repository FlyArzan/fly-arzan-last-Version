/**
 * Generate Trip.com forward link for affiliate bookings
 * This function creates the Trip.com URL with all flight parameters
 */
export function generateForwardLink(flightDetailsData) {
  if (!flightDetailsData) return "#";

  const { tripType, routeInfo, passengerInfo } = flightDetailsData;

  // Common parameters
  const adults = passengerInfo?.adults || 1;
  const children = passengerInfo?.children || 0;
  const cabin = passengerInfo?.cabin?.toLowerCase() || "economy";

  // Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const getCabinClass = (cabin) => {
    const map = { economy: "y", premium: "w", business: "c", first: "f" };
    return map[cabin] || "y";
  };

  // Build base parameters common to all trip types
  const baseParams = {
    class: getCabinClass(cabin),
    lowpricesource: "searchform",
    quantity: adults.toString(),
    // locale: regionalSettings?.language?.code || "en-US",
    // curr: regionalSettings?.currency?.curr || "USD",
  };

  let params = new URLSearchParams();

  try {
    // Build URL parameters based on trip type
    if (tripType === "one-way" && routeInfo?.from && routeInfo?.to) {
      // One-way trip parameters
      Object.assign(baseParams, {
        airline:
          routeInfo.flights
            ?.map(({ airlineCode }) => airlineCode.toUpperCase())
            ?.join(",") || "",
        dcity: routeInfo.from.airport?.toUpperCase() || "",
        acity: routeInfo.to.airport?.toUpperCase() || "",
        ddate: formatDate(routeInfo.departureDate),
        dairport: routeInfo.from.airport?.toUpperCase() || "",
        aairport: routeInfo.to.airport?.toUpperCase() || "",
        triptype: "ow",
        searchbox: "arg=t",
        nonstoponl: "y=off",
      });
      params = new URLSearchParams(baseParams);
    } else if (
      tripType === "round-trip" &&
      routeInfo?.from &&
      routeInfo?.to &&
      routeInfo?.returnDate
    ) {
      // Combine airline codes
      const outboundAirlines =
        routeInfo.outboundFlights?.map(({ airlineCode }) =>
          airlineCode.toUpperCase()
        ) || [];
      const returnAirlines =
        routeInfo.returnFlights?.map(({ airlineCode }) =>
          airlineCode.toUpperCase()
        ) || [];
      const combinedAirlines = [...outboundAirlines, ...returnAirlines];

      // Remove duplicates
      const uniqueAirlines = Array.from(new Set(combinedAirlines));

      // Round-trip parameters
      Object.assign(baseParams, {
        airline: uniqueAirlines.join(","),
        dcity: routeInfo.from.airport?.toUpperCase() || "",
        acity: routeInfo.to.airport?.toUpperCase() || "",
        ddate: formatDate(routeInfo.departureDate),
        rdate: formatDate(routeInfo.returnDate),
        dairport: routeInfo.from.airport?.toUpperCase() || "",
        aairport: routeInfo.to.airport?.toUpperCase() || "",
        triptype: "rt",
        searchbox: "arg=t",
        nonstoponl: "y=off",
      });
      params = new URLSearchParams(baseParams);
    } else if (tripType === "multi-city" && routeInfo?.segments?.length > 0) {
      // Multi-city parameters
      params = new URLSearchParams();

      // Add each segment
      routeInfo.segments.forEach((segment, index) => {
        if (segment.from?.airport && segment.to?.airport) {
          params.append(
            `multdcity${index}`,
            segment.from.airport.toLowerCase()
          );
          params.append(`multacity${index}`, segment.to.airport.toLowerCase());
          params.append(`dairport${index}`, segment.from.airport.toLowerCase());
          params.append(`multddate${index}`, formatDate(segment.departureDate));
        }
      });

      // Add multi-city specific params (including airline if present)
      const airlineCodes = [
        ...new Set(routeInfo.airlines?.map((a) => a.airlineCode) || []),
      ].join(",");

      Object.entries({
        ...baseParams,
        triptype: "mt",
        searchboxarg: "t",
        nonstoponly: "off",
        airline: airlineCodes,
      }).forEach(([key, value]) => params.append(key, value));
    } else {
      // Fallback - use basic search parameters
      Object.assign(baseParams, {
        triptype: "ow",
        searchbox: "arg=t",
        nonstoponl: "y=off",
      });
      params = new URLSearchParams(baseParams);
    }

    // Add children for all trip types
    if (children > 0) {
      params.append("childquantity", children.toString());
    }

    // Trip.com Direct Affiliate params (appended to deepLink for dual tracking)
    const tripAffiliateParams =
      "Allianceid=7464080&SID=284201968&trip_sub1=&trip_sub3=D8671931";

    // Build final affiliate URL (Travelpayouts wrapper + Trip.com affiliate params)
    const deepLink = `https://trip.com/flights/showfarefirst?${params.toString()}&${tripAffiliateParams}`;
    const affiliateBase =
      "https://tp.media/r?marker=593963&trs=413727&p=8626&u=";

    return affiliateBase + encodeURIComponent(deepLink) + "&campaign_id=121";
  } catch {
    // Return basic URL if something goes wrong
    const tripAffiliateParams =
      "Allianceid=7464080&SID=284201968&trip_sub1=&trip_sub3=D8671931";
    const basicParams = new URLSearchParams(baseParams);
    const basicDeepLink = `https://trip.com/flights/showfarefirst?${basicParams.toString()}&${tripAffiliateParams}`;
    const affiliateBase =
      "https://tp.media/r?marker=593963&trs=413727&p=8626&u=";
    return (
      affiliateBase + encodeURIComponent(basicDeepLink) + "&campaign_id=121"
    );
  }
}

// New Experimental Link (From Manual Search in Trip.com)
// export function generateForwardLinkNew(flightDetailsData) {
//   if (!flightDetailsData) return "#";

//   const { tripType, routeInfo, passengerInfo } = flightDetailsData;

//   // Common parameters
//   const adults = passengerInfo?.adults || 1;
//   const children = passengerInfo?.children || 0;
//   const cabin = passengerInfo?.cabin?.toLowerCase() || "economy";

//   // Trip.com Direct Affiliate credentials
//   const AFFILIATE_PARAMS = {
//     Allianceid: "7464080",
//     SID: "284201968",
//     trip_sub1: "",
//     trip_sub3: "D8671931",
//   };

//   // Helper functions
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
//     return new Date(dateStr).toISOString().split("T")[0];
//   };

//   const getCabinClass = (cabin) => {
//     const map = { economy: "y", premium: "w", business: "c", first: "f" };
//     return map[cabin] || "y";
//   };

//   // Build base parameters common to all trip types
//   const baseParams = {
//     class: getCabinClass(cabin),
//     lowpricesource: "searchform",
//     quantity: adults.toString(),
//     searchboxarg: "t",
//     nonstoponly: "off",
//   };

//   let params = new URLSearchParams();

//   try {
//     // Build URL parameters based on trip type
//     if (tripType === "one-way" && routeInfo?.from && routeInfo?.to) {
//       // One-way trip parameters
//       const airlineCodes =
//         routeInfo.flights
//           ?.map(({ airlineCode }) => airlineCode?.toUpperCase())
//           ?.filter(Boolean)
//           ?.join(",") || "";

//       Object.assign(baseParams, {
//         dcity: routeInfo.from.airport?.toLowerCase() || "",
//         acity: routeInfo.to.airport?.toLowerCase() || "",
//         ddate: formatDate(routeInfo.departureDate),
//         dairport: routeInfo.from.airport?.toLowerCase() || "",
//         triptype: "ow",
//         ...(airlineCodes && { airline: airlineCodes }),
//       });
//       params = new URLSearchParams(baseParams);
//     } else if (
//       tripType === "round-trip" &&
//       routeInfo?.from &&
//       routeInfo?.to &&
//       routeInfo?.returnDate
//     ) {
//       // Combine airline codes from outbound and return flights
//       const outboundAirlines =
//         routeInfo.outboundFlights
//           ?.map(({ airlineCode }) => airlineCode?.toUpperCase())
//           ?.filter(Boolean) || [];
//       const returnAirlines =
//         routeInfo.returnFlights
//           ?.map(({ airlineCode }) => airlineCode?.toUpperCase())
//           ?.filter(Boolean) || [];
//       const uniqueAirlines = [
//         ...new Set([...outboundAirlines, ...returnAirlines]),
//       ];

//       Object.assign(baseParams, {
//         dcity: routeInfo.from.airport?.toLowerCase() || "",
//         acity: routeInfo.to.airport?.toLowerCase() || "",
//         ddate: formatDate(routeInfo.departureDate),
//         rdate: formatDate(routeInfo.returnDate),
//         dairport: routeInfo.from.airport?.toLowerCase() || "",
//         triptype: "rt",
//         ...(uniqueAirlines.length > 0 && { airline: uniqueAirlines.join(",") }),
//       });
//       params = new URLSearchParams(baseParams);
//     } else if (tripType === "multi-city" && routeInfo?.segments?.length > 0) {
//       // Multi-city parameters
//       params = new URLSearchParams();

//       // Add each segment
//       routeInfo.segments.forEach((segment, index) => {
//         if (segment.from?.airport && segment.to?.airport) {
//           params.append(
//             `multdcity${index}`,
//             segment.from.airport.toLowerCase()
//           );
//           params.append(`multacity${index}`, segment.to.airport.toLowerCase());
//           params.append(`dairport${index}`, segment.from.airport.toLowerCase());
//           params.append(`multddate${index}`, formatDate(segment.departureDate));
//         }
//       });

//       // Add multi-city specific params
//       const airlineCodes = [
//         ...new Set(
//           routeInfo.airlines
//             ?.map((a) => a.airlineCode?.toUpperCase())
//             ?.filter(Boolean) || []
//         ),
//       ].join(",");

//       Object.entries({
//         ...baseParams,
//         triptype: "mt",
//         ...(airlineCodes && { airline: airlineCodes }),
//       }).forEach(([key, value]) => params.append(key, value));
//     } else {
//       // Fallback - use basic search parameters
//       Object.assign(baseParams, {
//         triptype: "ow",
//       });
//       params = new URLSearchParams(baseParams);
//     }

//     // Add children for all trip types
//     if (children > 0) {
//       params.append("childquantity", children.toString());
//     }

//     // Add Trip.com affiliate parameters
//     Object.entries(AFFILIATE_PARAMS).forEach(([key, value]) => {
//       params.append(key, value);
//     });

//     // Build final Trip.com URL with affiliate tracking
//     return `https://www.trip.com/flights/showfarefirst?${params.toString()}`;
//   } catch {
//     // Return basic URL with affiliate params if something goes wrong
//     const basicParams = new URLSearchParams({
//       ...baseParams,
//       triptype: "ow",
//       ...AFFILIATE_PARAMS,
//     });
//     return `https://www.trip.com/flights/showfarefirst?${basicParams.toString()}`;
//   }
// }
