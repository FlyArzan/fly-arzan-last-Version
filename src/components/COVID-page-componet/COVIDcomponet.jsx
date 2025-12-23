import React from "react";
import { useTranslation } from "react-i18next";


const COVIDcomponet = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="PrivacyPolicysec1-sec">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>COVID-19 Updates </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default COVIDcomponet;
