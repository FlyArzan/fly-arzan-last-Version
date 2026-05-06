import { useContext, useEffect, useRef } from "react";
// import HeaderOld2 from "../header-footer/HeaderOld2";
import Footer from "../header-footer/Footer";
import FlightSec2 from "../components/Landing_page_1_componets/FlightSec2";
import FlightSec3 from "../components/Landing_page_1_componets/FlightSec3";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
// import FlightHero from "../components/Landing_page_1_componets/FlightHero";
import FlightFaq from "../components/Landing_page_1_componets/FlightFaq";
import FlightSec1 from "../components/Landing_page_1_componets/FlightSec1";
import { FlightContext } from "../context/FlightContext";
import { useLocation } from "react-router-dom";
import HeroSearchFilter from "@/components/ui/hero-search-filter/flights";
import Header from "@/header-footer/Header";
import { Toaster } from "sonner";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://flyarzan.com/";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";

const landingWebsiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: "Fly Arzan",
  description:
    "Fly Arzan helps you find the best flight deals, hotels, and car rentals all in one place. Compare prices, book confidently, and save on your travels.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://flyarzan.com/?search={search_term}",
    "query-input": "required name=search_term",
  },
  publisher: {
    "@type": "Organization",
    name: "Fly Arzan",
    logo: {
      "@type": "ImageObject",
      url: "https://flyarzan.com/logo.png",
    },
  },
};

const landingFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I search for flights on your website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To search for flights, simply enter your departure and destination locations, along with your travel dates and number of passengers. Our search engine will show you the best available options.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book a flight directly on your website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, we are a travel search engine. We help you find the best flight options, but bookings are made directly with airlines or other travel providers.",
      },
    },
    {
      "@type": "Question",
      name: "Are the flight prices shown in real-time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the flight prices are updated in real-time, reflecting the latest available fares from airlines.",
      },
    },
    {
      "@type": "Question",
      name: "Do your flight prices include taxes and fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our flight prices include taxes and fees unless otherwise stated. You will see a breakdown of all costs before confirming your booking.",
      },
    },
    {
      "@type": "Question",
      name: "Can I search for one-way, round-trip, or multi-city flights?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can search for one-way, round-trip, or multi-city flights using our search engine, depending on your travel preferences.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer flexible date search options?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our search engine allows you to choose flexible dates to find the best deals that fit your travel schedule.",
      },
    },
    {
      "@type": "Question",
      name: "How can I filter flights by airline, price, or duration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can filter flights by airline, price range, or duration using the filter options provided in the search results.",
      },
    },
  ],
};

const LandingFlights = () => {
  const { hash } = useLocation();

  const { setContextData } = useContext(FlightContext);
  useEffect(() => {
    setContextData(null);
  }, [setContextData]);

  const sectionRefs = {
    sec2: useRef(null),
    sec3: useRef(null),
    sec4: useRef(null),
    faq: useRef(null),
  };

  // const scrollToSection = (key) => {

  //   sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
  // };
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const target = params.get("scrollTo");

  //   if (target && sectionRefs[target]) {
  //     // Add small delay to wait for render
  //     setTimeout(() => {
  //       scrollToSection(target);
  //     }, 300);
  //   }
  // }, [location]);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <>
      <Helmet>
        <title>Search For Best Flight Deals Worldwide with FlyArzan</title>
        <meta
          name="description"
          content="Find the best flight deals to top destinations with FlyArzan. Compare prices, book with confidence, and maximize your savings with just one simple search."
        />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Best Flight Deals Worldwide - Compare & Save with FlyArzan"
        />
        <meta
          property="og:description"
          content="Find the best flight deals to top destinations with FlyArzan. Compare prices, book with confidence, and maximize your savings with just one simple search."
        />
        <meta property="og:image" content={OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={SITE_URL} />
        <meta
          name="twitter:title"
          content="Best Flight Deals Worldwide - Compare & Save with FlyArzan"
        />
        <meta
          name="twitter:description"
          content="Find the best flight deals to top destinations with FlyArzan. Compare prices, book with confidence, and maximize your savings with just one simple search."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json">
          {JSON.stringify(landingWebsiteJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(landingFaqJsonLd)}
        </script>
      </Helmet>
      {/* <Header onNavigate={scrollToSection} /> */}
      {/* <HeaderOld2 /> */}
      {/* <FlightHero /> */}
      <Header />
      <HeroSearchFilter />
      <FlightSec1 />
      <FlightSec2 ref={sectionRefs.sec2} />
      <FlightSec3 ref={sectionRefs.sec3} />
      <FlightFaq ref={sectionRefs.faq} />
      <FlightSec4 ref={sectionRefs.sec4} />
      <Footer />
      <Toaster position="top-center" richColors />
    </>
  );
};

export default LandingFlights;
