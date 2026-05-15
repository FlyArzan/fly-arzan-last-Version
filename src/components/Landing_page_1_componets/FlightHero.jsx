import Tab1 from "../Tab-componet/Tab1";
import { useTranslation } from "react-i18next";
import { useTimeBasedBackground } from "@/hooks/useTimeBasedBackground";

const FlightHero = () => {
  const { t } = useTranslation();
  const { backgroundImage } = useTimeBasedBackground();

  return (
    <>
      <section className="hero-sec">
        <img
          src={encodeURI(backgroundImage)}
          alt=""
          className="hero-sec__bg"
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          aria-hidden
        />
        <div className="container">
          <div className="main-hero">
            <div className="hero-tital">
              <h1> {t("upperSection.Cheap_flights_para")}</h1>
              <p> {t("upperSection.Our_search")}</p>
            </div>
            <div className="Flights-box">
              <Tab1 />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightHero;
