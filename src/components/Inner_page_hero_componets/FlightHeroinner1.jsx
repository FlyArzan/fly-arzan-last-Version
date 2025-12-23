import Tab4 from "../Tab-componet/Tab4";
import { useTimeBasedBackground } from "@/hooks/useTimeBasedBackground";

const FlightHeroinner1 = () => {
  const { backgroundImage } = useTimeBasedBackground();

  return (
    <>
      <section
        className="hero-sec"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="container">
          <div className="main-hero">
            <div className="Flights-box">
              <Tab4 />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightHeroinner1;
