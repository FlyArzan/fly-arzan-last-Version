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
