import React, { useState } from "react";
import { Link } from "react-router-dom";
import Search from "../../assets/Images/Search.png";
import Comparison from "../../assets/Images/Comparison.png";
import Maximize from "../../assets/Images/Maximize.png";
import { useTranslation } from "react-i18next";

const FlightSec1 = () => {
  const { t} = useTranslation()
  return (
    <>
      <section className="Sec1-sec">
        <div className="container">
          <div className="main-Sec1">
            <div className="Sec1-card">
              <div className="Sec1-card-icon">
                <img src={Search} alt={t("section2.Search_simply")} />
              </div>
              <h2>{t("section2.Search_simply")}</h2>
              <p>{t("section2.Search_simply_para")}</p>
            </div>

            <div className="Sec1-card">
              <div className="Sec1-card-icon">
                <img src={Comparison} alt={t("section2.Comparison")} />
              </div>
              <h2>{t("section2.Comparison")}</h2>
              <p>{t("section2.Comparison_para")}</p>
            </div>

            <div className="Sec1-card">
              <div className="Sec1-card-icon">
                <img src={Maximize} alt={t("section2.Maximize_Savings")} />
              </div>
              <h2>{t("section2.Maximize_Savings")} </h2>
              <p>{t("section2.Maximize_Savings_para")}              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightSec1;
