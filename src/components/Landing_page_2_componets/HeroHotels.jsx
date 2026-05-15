import React, { useState } from "react";
import { Link } from "react-router-dom";
import Tab2 from "../Tab-componet/Tab2";
import { useTranslation } from "react-i18next";

const HeroHotels = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="hero-sec HeroHotels-sec add-more-height top-margin">
        <div className="container">
          <div className="main-hero">
            <div className="hero-tital">
              <h1>{t("hotel_section.Cheap_hotels_para")}</h1>
              <p> {t("hotel_section.Our_search")}</p>
            </div>
            <div className="Flights-box">
              <Tab2 />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroHotels;
