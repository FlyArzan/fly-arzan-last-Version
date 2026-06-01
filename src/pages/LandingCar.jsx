import { useEffect, useRef } from "react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import CarsFaq from "../components/Landing_page_3_componets/CarsFaq";
import FlightSec1 from "../components/Landing_page_1_componets/FlightSec1";
import CarSec2 from "../components/Landing_page_3_componets/CarSec2";
import CarSec3 from "../components/Landing_page_3_componets/CarSec3";
import CarHero from "../components/Landing_page_3_componets/CarHero";
import CarsSec4 from "../components/Landing_page_3_componets/CarsSec4";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const LandingCar = () => {
  const location = useLocation();

  const sectionRefs = {
    sec8: useRef(null),
    sec9: useRef(null),
    sec10: useRef(null),
    Cfaq: useRef(null),
  };

  const scrollToSection = (key) => {
    sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("scrollTo");

    if (target && sectionRefs[target]) {
      // Add small delay to wait for render
      setTimeout(() => {
        scrollToSection(target);
      }, 300);
    }
  }, [location]);

  const { hash } = useLocation();

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
        <title>Affordable Car Rentals Worldwide | FlyArzan</title>
        <meta
          name="description"
          content="Find and compare car rental deals worldwide with FlyArzan. Get the best rates on vehicle hire and travel your way."
        />
        <link rel="canonical" href="https://flyarzan.com/Car" />
        <meta
          property="og:title"
          content="Affordable Car Rentals Worldwide - FlyArzan"
        />
        <meta
          property="og:description"
          content="Find and compare car rental deals worldwide with FlyArzan. Get the best rates on vehicle hire and travel your way."
        />
        <meta property="og:url" content="https://flyarzan.com/Car" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Affordable Car Rentals Worldwide - FlyArzan"
        />
        <meta
          name="twitter:description"
          content="Find and compare car rental deals worldwide with FlyArzan."
        />
        <meta
          name="twitter:image"
          content="https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg"
        />
      </Helmet>
      <Header onNavigate={scrollToSection} />
      <CarHero />
      <FlightSec1 />
      <CarSec2 ref={sectionRefs.sec8} />
      <CarSec3 ref={sectionRefs.sec9} />
      <CarsFaq ref={sectionRefs.Cfaq} />
      <CarsSec4 ref={sectionRefs.sec10} />
      <Footer />
    </>
  );
};

export default LandingCar;
