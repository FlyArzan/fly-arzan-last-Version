import { useContext, useEffect, useRef } from "react";
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

import { Helmet } from "react-helmet-async";

const SITE_URL = "https://flyarzan.com/";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";

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
      </Helmet>
      {/* <FlightHero /> */}
      <Header />
      <HeroSearchFilter />
      <FlightSec1 />
      <FlightSec2 ref={sectionRefs.sec2} />
      <FlightSec3 ref={sectionRefs.sec3} />
      <FlightFaq ref={sectionRefs.faq} />
      <FlightSec4 ref={sectionRefs.sec4} />
      <Footer />
    </>
  );
};

export default LandingFlights;
