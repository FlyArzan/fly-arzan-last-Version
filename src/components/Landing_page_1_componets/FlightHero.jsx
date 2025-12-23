import Tab1 from "../Tab-componet/Tab1";
import { useTranslation } from "react-i18next";
import { useTimeBasedBackground } from "@/hooks/useTimeBasedBackground";

const FlightHero = () => {
  const { t } = useTranslation();
  const { backgroundImage } = useTimeBasedBackground();

  return (
    <>
      <section
        className="hero-sec"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="main-hero">
            <div className="hero-tital">
              <h2> {t("upperSection.Cheap_flights_para")}</h2>
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
