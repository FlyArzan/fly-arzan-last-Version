import { Helmet } from 'react-helmet-async';

const TravelAgencySchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Fly Arzan",
    "url": "https://flyarzan.com",
    "logo": "https://flyarzan.com/logo.png",
    "description": "Book cheap flights, hotels, and car rentals worldwide. Compare prices and find the best travel deals.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Arabic", "French", "German", "Spanish"]
    },
    "sameAs": [
      "https://facebook.com/flyarzan",
      "https://twitter.com/flyarzan",
      "https://instagram.com/flyarzan"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Flight Booking",
          "description": "Book flights worldwide at competitive prices"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Hotel Reservation",
          "description": "Reserve hotels and accommodations globally"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Car Rental",
          "description": "Rent cars for your travel needs"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Travel Planning",
          "description": "Complete travel planning and booking services"
        }
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fly Arzan",
    "url": "https://flyarzan.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flyarzan.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default TravelAgencySchema;
