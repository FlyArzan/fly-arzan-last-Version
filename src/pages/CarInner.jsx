import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import CarsSec4 from "../components/Landing_page_3_componets/CarsSec4";
import Carinner2 from "../components/Inner_page_Sec_2_componets/Carinner2";

const CarInner = () => {
  return (
    <>
      <Helmet>
        <title>Car Rental Search Results | FlyArzan</title>
        <meta
          name="description"
          content="Browse car rental search results and find the best vehicle hire deals with FlyArzan."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      {/* <CarHeroinner1 /> */}
      <Carinner2 />
      {/* <CarsSec4 /> */}
      <Footer />
    </>
  );
};

export default CarInner;
