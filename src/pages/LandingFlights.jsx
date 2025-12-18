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
