import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegionalSettings } from "../../context/RegionalSettingsContext";
import { useTranslation } from "react-i18next";
import { getNearestAirportCached } from "@/utils/locationUtils";

// Popular flight destinations with IATA codes and images
const DESTINATIONS = [
  {
    id: 1,
    city: "Bangkok",
    country: "Thailand",
    iataCode: "BKK",
    image: "/Pics/Bangkok/Bangkok1.jpg",
  },
  {
    id: 2,
    city: "Istanbul",
    country: "Turkey",
    iataCode: "IST",
    image: "/Pics/Istanbul/Istanbul 1.jpg",
  },
  {
    id: 3,
    city: "London",
    country: "United Kingdom",
    iataCode: "LHR",
    image: "/Pics/London/London 1.jpg",
  },
  {
    id: 4,
    city: "Hong Kong",
    country: "China",
    iataCode: "HKG",
    image: "/Pics/Hong Kong/pexels-harry-shum-17627821-6726522.jpg",
  },
  {
    id: 5,
    city: "Mecca",
    country: "Saudi Arabia",
    iataCode: "JED",
    image: "/Pics/Mecca/pexels-haydan-as-soendawy-730525-5004002.jpg",
  },
  {
    id: 6,
    city: "Antalya",
    country: "Turkey",
    iataCode: "AYT",
    image: "/Pics/Antalya/pexels-ahmetkurt-12662282.jpg",
  },
  {
    id: 7,
    city: "Dubai",
    country: "United Arab Emirates",
    iataCode: "DXB",
    image: "/Pics/Dubai/pexels-pixabay-162031.jpg",
  },
  {
    id: 8,
    city: "Barcelona",
    country: "Spain",
    iataCode: "BCN",
    image: "/Pics/Barcelona/pexels-monica-1548024.jpg",
  },
  {
    id: 9,
    city: "Paris",
    country: "France",
    iataCode: "CDG",
    image: "/Pics/Paris/pexels-alejandro-aznar-155337093-17976859.jpg",
  },
];

const FlightSec2 = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { regionalSettings } = useRegionalSettings();
  const [nearestAirport, setNearestAirport] = useState(null);

  // Fetch nearest airport on mount for auto-populating origin
  useEffect(() => {
    const fetchNearestAirport = async () => {
      try {
        const airport = await getNearestAirportCached();
        setNearestAirport(airport);
      } catch (error) {
        console.error("Failed to get nearest airport:", error);
      }
    };
    fetchNearestAirport();
  }, []);

  // Handle destination card click - navigate to search with pre-filled origin/destination
  const handleDestinationClick = (destination) => {
    const today = new Date();
    const departDate = today.toISOString().split("T")[0];

    const searchData = {
      type: "one-way",
      flyingFrom: nearestAirport
        ? {
            city: nearestAirport.city || "",
            iataCode: nearestAirport.iataCode || "",
          }
        : { city: "", iataCode: "" },
      flyingTo: {
        city: destination.city,
        iataCode: destination.iataCode,
      },
      depart: departDate,
      travellers: {
        cabin: "economy",
        adults: 1,
        children: 0,
      },
    };

    sessionStorage.setItem("selected-flight", JSON.stringify(searchData));
    navigate("/search/flight");
  };

  return (
    <section ref={ref} id="flight-main-deals" className="Sec2-sec">
      <div className="container">
        <div className="main-Sec2">
          {/* Keep existing heading/tagline design */}
          {regionalSettings?.country?.name ? (
            <div className="Sec2-tital">
              <h2>
                {t("flightFaqSection.flightCard.FlightDealsFrom", {
                  country: regionalSettings.country.name || "",
                })}
              </h2>
              <p>
                {t("flightFaqSection.flightCard.Discover_flight_deals")}{" "}
                {regionalSettings.country.name}{" "}
                {t("flightFaqSection.flightCard.at_the_lowest_prices")}
              </p>
            </div>
          ) : (
            <div className="Sec2-tital">
              <h2>{t("flightFaqSection.flightCard.PlacesLike")}</h2>
              <p>{t("flightFaqSection.flightCard.PlacesLikePara")}</p>
            </div>
          )}

          {/* Clean, flight-focused destination cards */}
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4 tw:md:gap-6">
            {DESTINATIONS.map((destination) => (
              <div
                key={destination.id}
                onClick={() => handleDestinationClick(destination)}
                className="tw:group tw:relative tw:overflow-hidden tw:rounded-lg tw:shadow-md tw:cursor-pointer tw:transition-all tw:duration-300 hover:tw:shadow-2xl hover:tw:-translate-y-1"
              >
                {/* Single main image */}
                <div className="tw:aspect-4/3 tw:overflow-hidden">
                  <img
                    src={destination.image}
                    alt={`${destination.city}, ${destination.country}`}
                    className="tw:w-full tw:h-full tw:object-cover tw:transition-transform tw:duration-500 tw:ease-out tw:group-hover:scale-105 tw:will-change-transform tw:backface-hidden"
                    style={{ transform: "translateZ(0)" }}
                    onError={(e) => {
                      e.target.src = "/Pics/Airline wing/Air line wings 1.jpg";
                    }}
                  />
                </div>

                {/* Gradient overlay */}
                <div
                  className="tw:absolute tw:inset-0 tw:transition-all tw:duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                  }}
                />

                {/* City + Country info */}
                <div
                  className="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:p-4"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                >
                  <h3
                    style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      marginBottom: "0.5rem",
                      textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                    }}
                  >
                    {destination.city}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: "9999px",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {destination.country}
                  </span>
                </div>

                {/* Hover arrow indicator */}
                <div className="tw:absolute tw:top-3 tw:right-3 tw:opacity-0 tw:group-hover:opacity-100 tw:transition-opacity tw:duration-300">
                  <div className="tw:bg-white tw:rounded-full tw:p-2 tw:shadow-lg">
                    <svg
                      className="tw:w-4 tw:h-4 tw:text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

FlightSec2.displayName = "FlightSec2";

export default FlightSec2;
