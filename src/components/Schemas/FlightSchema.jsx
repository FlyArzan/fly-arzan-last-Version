import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const FlightSchema = ({ flight }) => {
  if (!flight) return null;

  const flightSchema = {
    "@context": "https://schema.org",
    "@type": "Flight",
    "flightNumber": flight.flightNumber,
    "airline": {
      "@type": "Airline",
      "name": flight.airline?.name,
      "iataCode": flight.airline?.code
    },
    "departureAirport": {
      "@type": "Airport",
      "name": flight.departure?.airportName,
      "iataCode": flight.departure?.code,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": flight.departure?.city,
        "addressCountry": flight.departure?.country
      }
    },
    "arrivalAirport": {
      "@type": "Airport", 
      "name": flight.arrival?.airportName,
      "iataCode": flight.arrival?.code,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": flight.arrival?.city,
        "addressCountry": flight.arrival?.country
      }
    },
    "departureTime": flight.departureTime,
    "arrivalTime": flight.arrivalTime,
    "offers": {
      "@type": "Offer",
      "price": flight.price,
      "priceCurrency": flight.currency || "USD",
      "availability": "https://schema.org/InStock",
      "validThrough": flight.validThrough
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(flightSchema)}
      </script>
    </Helmet>
  );
};

FlightSchema.propTypes = {
  flight: PropTypes.shape({
    flightNumber: PropTypes.string,
    airline: PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string
    }),
    departure: PropTypes.shape({
      airportName: PropTypes.string,
      code: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string
    }),
    arrival: PropTypes.shape({
      airportName: PropTypes.string,
      code: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string
    }),
    departureTime: PropTypes.string,
    arrivalTime: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    validThrough: PropTypes.string
  })
};

export default FlightSchema;
