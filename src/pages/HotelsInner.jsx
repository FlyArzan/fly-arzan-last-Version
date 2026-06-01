import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import CarsSec4 from "../components/Landing_page_3_componets/CarsSec4";
import Hotelsinner2 from "../components/Inner_page_Sec_2_componets/Hotelsinner2";

const HotelsInner = () => {
  return (
    <>
      <Helmet>
        <title>Hotel Search Results | FlyArzan</title>
        <meta
          name="description"
          content="Browse hotel search results and find the best accommodation deals with FlyArzan."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      {/* <HotelsHeroinner1 /> */}
      <Hotelsinner2 />
      {/* <CarsSec4 /> */}
      <Footer />
    </>
  );
};

export default HotelsInner;
