import Tab4 from "../Tab-componet/Tab4";
import { useTimeBasedBackground } from "@/hooks/useTimeBasedBackground";

const FlightHeroinner1 = () => {
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
