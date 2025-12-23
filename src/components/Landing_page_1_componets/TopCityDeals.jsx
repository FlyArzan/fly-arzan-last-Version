import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNearestAirportCached } from "@/utils/locationUtils";

// Top 9 most visited cities in the world with their IATA codes
// Images from /public/Pics folder - using actual file names
const TOP_CITIES = [
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

const TopCityDeals = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nearestAirport, setNearestAirport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch nearest airport on mount
  useEffect(() => {
    const fetchNearestAirport = async () => {
      try {
        const airport = await getNearestAirportCached();
        setNearestAirport(airport);
      } catch (error) {
        console.error("Failed to get nearest airport:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearestAirport();
  }, []);

  // Handle city card click - navigate to search with pre-filled departure/destination
  const handleCityClick = (city) => {
    // Get today's date for default search
    const today = new Date();
    const departDate = today.toISOString().split("T")[0];

    // Build search data
    const searchData = {
      type: "one-way",
      flyingFrom: nearestAirport
        ? {
            city: nearestAirport.city || "",
            iataCode: nearestAirport.iataCode || "",
          }
        : { city: "", iataCode: "" },
      flyingTo: {
        city: city.city,
        iataCode: city.iataCode,
      },
      depart: departDate,
      travellers: {
        cabin: "economy",
        adults: 1,
        children: 0,
      },
    };

    // Store in session storage
    sessionStorage.setItem("selected-flight", JSON.stringify(searchData));

    // Navigate to search page
    navigate("/search/flight");
  };

  return (
    <section id="top-city-deals" className="tw:py-12 tw:bg-gray-50">
      <div className="container">
        <div className="tw:text-center tw:mb-8">
          <h2 className="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-gray-800 tw:mb-2">
            {t(
              "flightFaqSection.flightCard.TopDestinations",
              "Top Destinations"
            )}
          </h2>
          <p className="tw:text-gray-600 tw:text-sm tw:md:text-base">
            {nearestAirport ? (
              <>
                {t("flightFaqSection.flightCard.FlightsFrom", "Flights from")}{" "}
                <span className="tw:font-semibold">
                  {nearestAirport.city} ({nearestAirport.iataCode})
                </span>
              </>
            ) : (
              t(
                "flightFaqSection.flightCard.ExploreTopCities",
                "Explore the world's most visited cities"
              )
            )}
          </p>
        </div>

        {/* City Cards Grid */}
        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4 tw:md:gap-6">
          {TOP_CITIES.map((city) => (
            <div
              key={city.id}
              onClick={() => handleCityClick(city)}
              className="tw:group tw:relative tw:overflow-hidden tw:rounded-xl tw:shadow-md tw:cursor-pointer tw:transition-all tw:duration-300 hover:tw:shadow-2xl hover:tw:-translate-y-1"
            >
              {/* Image with zoom effect on hover */}
              <div className="tw:aspect-[4/3] tw:overflow-hidden">
                <img
                  src={city.image}
                  alt={city.city}
                  className="tw:w-full tw:h-full tw:object-cover tw:transition-transform tw:duration-500 tw:ease-out tw:group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/Pics/Airline wing/Air line wings 1.jpg";
                  }}
                />
              </div>

              {/* Overlay */}
              <div
                className="tw:absolute tw:inset-0 tw:transition-all tw:duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div
                className="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:p-4"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    marginBottom: "0.25rem",
                    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  {city.city}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "0.875rem",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {city.country}
                </p>

                {/* Airport code badge */}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "0.25rem",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {city.iataCode}
                </span>
              </div>

              {/* Hover indicator */}
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

        {/* Loading indicator for nearest airport */}
        {isLoading && (
          <div className="tw:text-center tw:mt-4 tw:text-gray-500 tw:text-sm">
            {t("common.detectingLocation", "Detecting your nearest airport...")}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCityDeals;
