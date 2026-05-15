import React, { useState } from "react";
import { Link } from "react-router-dom";
import Tab1 from "../Tab-componet/Tab1";
import Tab3 from "../Tab-componet/Tab3";
import { useTranslation } from "react-i18next";

const CarHero = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="hero-sec CarHero-sec add-more-height top-margin">
        <div className="container">
          <div className="main-hero">
            <div className="hero-tital">
              <h1> {t(`carsection.Find_the_best_car`)}</h1>
              <p> {t(`carsection.Our_search`)}</p>
            </div>
            <div className="Flights-box">
              <Tab3 />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CarHero;
