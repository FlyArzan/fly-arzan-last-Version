import React, { useState, useEffect, useContext, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Import react-tabs CSS
import flylogo from "../../assets/Images/fly-logo.png";
import DropMoreFilters from "../drop-dwon/DropMoreFilters";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../ProgressBar/ProgressBar";
import { generateAccessToken, useGet, usePost } from "../../utils/ApiMethod";
import { BaseUrl } from "../../baseUrl";
import { FlightContext } from "../../context/FlightContext";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";

const cardsDatas = [
  {
    title: "Saver",
    price: "£ 350.00",
    baggage: "30Kg",
    cancellation: "Penalties Apply",
    modification: "Penalties Apply",
    NotIncluded: "Not Included",
    Included: "Included",
  },
  {
    title: "Standard",
    price: "£ 450.00",
    baggage: "40Kg",
    cancellation: "Free",
    modification: "Minimal Fees",
    NotIncluded: "Not Included",
    Included: "Included",
  },
  {
    title: "Premium",
    price: "£ 550.00",
    baggage: "50Kg",
    cancellation: "Free",
    modification: "Free",
    NotIncluded: "Not Included",
    Included: "Included",
  },
];
const cardData = [
  {
    flyLogo: flylogo,
    airline: "flydubai",
    flightNumber: "FZ-329",
    departureTime: "07:45",
    duration: "2h 5m",
    arrivalTime: "10:45 ",
    from: "Dubai (DXB)",
    to: "London (LDN)",
    baggage: "30kg",
    meal: "Meal",
    price: "£ 350.00",
    saveAmount: "£ 35.00",
  },
  {
    flyLogo: flylogo,
    airline: "flydubai",
    flightNumber: "FZ-329",
    departureTime: "07:45 ",
    duration: "2h 5m",
    arrivalTime: "10:45",
    from: "Dubai (DXB)",
    to: "London (LDN)",
    baggage: "30kg",
    meal: "Meal",
    price: "£ 350.00",
    saveAmount: "£ 35.00",
  },
  {
    flyLogo: flylogo,
    airline: "flydubai",
    flightNumber: "FZ-329",
    departureTime: "07:45",
    duration: "2h 5m",
    arrivalTime: "10:45",
    from: "Dubai (DXB)",
    to: "London (LDN)",
    baggage: "30kg",
    meal: "Meal",
    price: "£ 350.00",
    saveAmount: "£ 35.00",
  },
  // Add more card objects...
];
const   Tab8 = () => {
  // // To manage the visibility of the "my-new-box-card" for each card
  // const [visible, setVisible] = useState(Array(cardData.length).fill(false));

  // const toggleBoxVisibility = (index) => {
  //   const updatedVisible = [...visible];
  //   updatedVisible[index] = !updatedVisible[index]; // Toggle visibility
  //   setVisible(updatedVisible);
  // };
  const { contextData, setFlightBookingData } = useContext(FlightContext);
    const { convertPrice, currency:ContxtCurr, selectedLocalCurr } = useCurrency();
  
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [filterIataCode, setFilterIataCode] = useState("");
  const [maxAirFlights, setMaxAirFlights] = useState(5);
  const [cityMap, setCityMap] = useState({});
  const [airlineNames, setAirlineNames] = useState({});
  const [moreResultLoad, setmoreResultLoad] = useState(false);
  const [flightData, setFlightData] = useState([]);
  const [finalLoading, setFinalLoading] = useState(false);
  const [mapShow, setMapShow] = useState(false);
  const getSearchDetails = contextData;

  const [apiUrl, setApiUrl] = useState(() => {
    if (!getSearchDetails) return;
    let url = `/v2/shopping/flight-offers?originLocationCode=${
      getSearchDetails?.originLocationCode
    }&destinationLocationCode=${
      getSearchDetails?.destinationLocationCode
    }&departureDate=${getSearchDetails?.departureDate}&travelClass=${
      getSearchDetails?.cabin || "ECONOMY"
    }&adults=${getSearchDetails?.adults || 1}&children=${
      getSearchDetails?.children || 0
    }&max=${maxAirFlights}`;
    if (getSearchDetails?.type === "Return" && getSearchDetails?.returnDate) {
      url += `&returnDate=${getSearchDetails.returnDate}`;
    }
    return url;
  });

  const { data, loading, error, refetch } = useGet(apiUrl);
  const {   
    postData,
    loading: multiCityLoading,
    error: multiCityError,
  } = usePost("/v2/shopping/flight-offers");

  const latestRequestRef = useRef(null);

  useEffect(() => {
    if (!getSearchDetails) return;
    if (contextData) {
      let url = `/v2/shopping/flight-offers?originLocationCode=${
        contextData?.originLocationCode
      }&destinationLocationCode=${
        contextData?.destinationLocationCode
      }&departureDate=${contextData?.departureDate}&travelClass=${
        contextData?.cabin || "ECONOMY"
      }&adults=1&max=${maxAirFlights}`;

      if (contextData?.type === "Return" && contextData?.returnDate) {
        url += `&returnDate=${contextData.returnDate}`;
      }

      // ✅ Compare URLs properly before updating state
      if (url !== apiUrl) {
        setApiUrl(url);
      }
    }
    // else {
    //   navigate("/");
    // }
  }, [contextData, maxAirFlights]);

  useEffect(() => {
    if (!apiUrl || Array.isArray(getSearchDetails?.originDestinations)) return;

    refetch(); // ✅ Ensure only refetching when `apiUrl` actually changes
  }, [apiUrl]);

  useEffect(() => {
    if (!Array.isArray(getSearchDetails?.originDestinations)) return;

    const fetchMultiCityFlights = async () => {
      const response = await postData({
        originDestinations: getSearchDetails.originDestinations,
        travelers: getSearchDetails?.travelers,
        sources: ["GDS"], // Optional
        searchCriteria: {
          maxFlightOffers: maxAirFlights,
          carrierFilter: {
            includedCarrierCodes: [filterIataCode],
          },
        },
      });

      if (response?.data?.length > 0) {
        setFlightData(response.data);
        setmoreResultLoad(false);
      } else {
        setFlightData([]);
      }
    };

    fetchMultiCityFlights();
  }, [maxAirFlights, filterIataCode, contextData]); // Run when maxAirFlights changes

  useEffect(() => {
    if (Array.isArray(getSearchDetails?.originDestinations)) return;

    if (!loading && data?.data?.length > 0) {
      setFlightData(data?.data);
      setmoreResultLoad(moreResultLoad === true ? false : false);
    } else {
      setFlightData([]);
    }
  }, [data]);

  useEffect(() => {
    let interval;
    if (loading || multiCityLoading) {
      setProgress(0); // Reset progress when API starts loading
      interval = setInterval(() => {
        setProgress((oldProgress) =>
          oldProgress >= 90 ? 90 : oldProgress + 5
        );
      }, 100);
      setFinalLoading(true);
    } else {
      setFinalLoading(false);
      clearInterval(interval);
      setProgress(100); // Set to 100% when loading is complete
    }
    return () => clearInterval(interval);
  }, [loading, multiCityLoading]); // Runs when either `loading` or `multiCityLoading` changes

  useEffect(() => {
    if (!getSearchDetails) return;
    if (Array.isArray(getSearchDetails?.originDestinations)) return;

    setApiUrl((prevUrl) => {
      let newUrl = prevUrl?.split("&includedAirlineCodes")[0]; // Remove old filter
      if (filterIataCode) {
        newUrl += `&includedAirlineCodes=${filterIataCode}`;
      }
      return newUrl;
    });
  }, [filterIataCode]);

  const handleMoreResult = () => {
    if (!getSearchDetails) return;
    setApiUrl((prevUrl) => {
      // Use regex to replace only the existing max parameter while keeping others intact
      let newUrl = prevUrl?.replace(/&max=\d+/, "");

      let newMax = (maxAirFlights || 10) + 10; // Increase max by 10
      setMaxAirFlights(newMax); // Update state for next calls

      return `${newUrl}&max=${newMax}`;
    });
    setmoreResultLoad(true);
  };

  const formatDuration = (duration) => {
    if (!duration) return "Unknown Duration"; // Agar duration undefined hai to handle karo
    duration = duration.replace(/^[A-Z]+/, ""); // Remove any prefix like PT, IT, etc.
    const match = duration.match(/(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return "Unknown Duration";
    const hours = match[1] ? `${match[1]}h` : ""; // If hours exist, format "xh"
    const minutes = match[2] ? `${match[2]}m` : ""; // If minutes exist, format "xm"
    return `${hours} ${minutes}`.trim(); // Remove extra spaces
  };

  const fetchCityNames = async (iataCodes) => {
    if (!iataCodes || iataCodes.length === 0) return;
    try {
      const access_token = await generateAccessToken(); // We got access token here

      // Fetch city names one by one
      for (const iataCode of iataCodes) {
        if (cityMap[iataCode]) continue; // Skip if already fetched

        const response = await fetch(
          `${BaseUrl}/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${iataCode}`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const result = await response.json();
        if (result?.data?.length) {
          const cityName = result?.data[0]?.address.cityName;

          // Update state immediately for each fetched city
          setCityMap((prev) => ({ ...prev, [iataCode]: cityName }));
        }
      }
    } catch (error) {
      console.error("Error fetching city names:", error);
    }
  };

  const fetchAirlineNames = async (carrierCodes) => {
    if (!carrierCodes || carrierCodes.length === 0) return;

    try {
      // Get access token once
      const access_token = await generateAccessToken(); // we got access token here

      const response = await fetch(
        `${BaseUrl}/v1/reference-data/airlines?airlineCodes=${carrierCodes.join(
          ","
        )}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const result = await response.json();
      if (result?.data?.length) {
        const airlineMap = {};
        result?.data?.forEach((airline) => {
          airlineMap[airline.iataCode] = airline?.businessName;
        });

        setAirlineNames((prev) => ({ ...prev, ...airlineMap }));
      }
    } catch (error) {
      console.error("Error fetching airline names:", error);
    }
  };

  useEffect(() => {
    if (!flightData || flightData.length === 0) return;

    const uniqueCarrierCodes = new Set();
    const uniqueIataCodes = new Set();

    flightData?.forEach((flight) => {
      flight?.itineraries?.forEach((itinerary) => {
        itinerary?.segments?.forEach((segment) => {
          if (!airlineNames[segment.carrierCode]) {
            uniqueCarrierCodes.add(segment.carrierCode);
          }
          if (!cityMap[segment.departure.iataCode]) {
            uniqueIataCodes.add(segment.departure.iataCode);
          }
          if (!cityMap[segment.arrival.iataCode]) {
            uniqueIataCodes.add(segment.arrival.iataCode);
          }
        });
      });
    });
    if (uniqueCarrierCodes?.size > 0) {
      fetchAirlineNames([...uniqueCarrierCodes]); // Send as an array
    }
    if (uniqueIataCodes?.size > 0) {
      fetchCityNames([...uniqueIataCodes]); // Send as an array
    }
  }, [flightData]); // Runs when flightData changes
  const { t } = useTranslation();
  const handleBookTicket = (
    cityMap,
    airlineNames,
    cabin,
    carrierCode,
    departureCountry,
    currency,
    total,
    flylogo,
    itineraries,
    airline
  ) => {
    setFlightBookingData({
      cityMap,
      departureCountry: departureCountry,
      type: getSearchDetails?.type,
      cabin,
      price: convertPrice(total),
      currency,
      carrierCode,
      itineraries,
      flylogo,
      traveller: (getSearchDetails?.adults ?? 0) + (getSearchDetails?.children ?? 0),
      airline,
    });
    navigate("/BookYourTicket");
  };

  
  return (
    <div className="Suggested-Tab-box">
      <Tabs>
     

        <div className="Suggested-Tab-head">
          <TabList>
            <Tab>
              {" "}
              <p>£ 400-4h.13m</p> {t('FlightsInner.Suggested')} 
            </Tab>
            <Tab>
              {" "}
              <p>£ 400-4h.13m</p>{t('FlightsInner.Cheapest')} 
            </Tab>
            <Tab>
              {" "}
              <p>£ 400-4h.13m</p> {t('FlightsInner.Fastest')} 
            </Tab>
          </TabList>

          <div className="Nonstop-btn-box">
            {/* <button>Nonstop</button>
            <button>1 Stop</button> */}
            <DropMoreFilters setIataCode={setFilterIataCode} />
          </div>
        </div>

        <div className="pograsbar">
          <div className="main-class-ProgressBar">
            <ProgressBar progress={progress} />
          </div>
        </div>

        {finalLoading === false && flightData?.length === 0 && contextData && (
          <div className="No-Flight-Found">
            <h2>{t('FlightsInner.No_Flights_Found')} </h2>
            
          </div>
        )}

        <div className="Tab-body">
          <TabPanel>
            <div className="Select-departing-main">
              {flightData?.length > 0 && contextData ? (
                <>
                  <div className="add-more-flex-box">
                    <div className="Select-departing-tital">
                      <h2>
                      {t('FlightsInner.departing')} {" "}
                        {Array.isArray(getSearchDetails?.originDestinations)
                          ? ""
                          : "to " + getSearchDetails?.departureCountry || "---"}
                      </h2>
                    </div>

                    <p>  {t('FlightsInner.Results')} {flightData?.length} of 100</p>
                  </div>
                </>
              ) : contextData ? (
                ""
              ) : (
                <div className="add-more-flex-box">
                  <div className="Select-departing-tital">
                    <h2>  {t('FlightsInner.departingflight')}</h2>
                  </div>

                  <p> {t('FlightsInner.Results')} 5 of 100</p>
                </div>
              )}
              {!contextData ? (
                <>
                  <div className="Select-departing-card-box">
                    {cardData.map((card, index) => (
                      
                      <div className="Select-departing-card" key={index}>
                        <div className="fly-box">
                        <img src={new URL(`../../assets/Images/Airlines/Logos/Imeges/FZ.png`, import.meta.url).href} alt={`${card.airline} airline logo`} />
                          <p>{card.airline}</p>
                          <p>{card.flightNumber}</p>
                        </div>
                        <div className="fly-time-main">
                          <div className="fly-time-box">
                            <h2>{card.departureTime}</h2>
                            <button>{card.duration}</button>
                            <h2>{card.arrivalTime}</h2>
                          </div>
                          <ul>
                            <li>{card.from}</li>
                            <li>  {t('FlightsInner.Nonstop')}</li>
                            <li>{card.to}</li>
                          </ul>
                        </div>
                        <div className="fly-Save-box">
                          <h5> {t('FlightsInner.Economy')}</h5>
                          <Link to="/BookYourTicket">
                            <button>
                              <p>{t('FlightsInner.Select')}</p>
                              <h3>{ convertPrice((350))}</h3>
                            </button>
                          </Link>
                          <h4>{t('FlightsInner.Round')}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="Sec2-btn-box">
                    <button onClick={handleMoreResult}>
                    {t('FlightsInner.Show')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="Select-departing-card-box">
                    {flightData?.length > 0 &&
                      flightData?.map((flight, index) => {
                        const carrierCode = flight?.itineraries[0]?.segments[0]?.carrierCode;
                        const flylogo = `../../assets/Images/Airlines/Logos/Imeges/${carrierCode}.png`;

                        return (
                          <div className="Select-departing-card" key={index}>
                            <div className="fly-box">
                              {/* <img src={flylogo} alt="" /> */}
                              <img
                                src={new URL(flylogo, import.meta.url).href}
                                alt={`${
                                  airlineNames[carrierCode] || carrierCode
                                } airline logo`}
                              />
                              <p>
                                {airlineNames[carrierCode] ||
                                carrierCode}
                              </p>
                              <p>
                                {
                                  carrierCode
                                }{" "}
                                - {flight?.itineraries[0]?.segments[0]?.number}
                              </p>
                            </div>
                            <div className="main-time-div">
                              {flight?.itineraries?.map(
                                (itinerary, itineraryIndex) => (
                                  <div
                                    className="fly-time-main"
                                    key={itineraryIndex}
                                  >
                                    {itinerary?.segments?.map(
                                      (segment, segmentIndex) => (
                                        <div
                                          key={segmentIndex}
                                          className="segment-container"
                                        >
                                          <div className="fly-time-box">
                                            <h2>
                                              {new Date(
                                                segment?.departure?.at
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </h2>
                                            <button>
                                              {formatDuration(
                                                segment?.duration
                                              )}
                                            </button>
                                            <h2>
                                              {new Date(
                                                segment?.arrival?.at
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </h2>
                                          </div>

                                          <ul className="segment-details">
                                            <li>
                                              {cityMap[
                                                segment?.departure?.iataCode
                                              ] || "Loading..."}{" "}
                                              ({segment?.departure?.iataCode})
                                            </li>
                                            <li>
                                              {segment?.numberOfStops === 0
                                                ? "Nonstop"
                                                : "Stopover"}
                                            </li>
                                            <li>
                                              {cityMap[
                                                segment?.arrival?.iataCode
                                              ] || "Loading..."}{" "}
                                              ({segment?.arrival?.iataCode})
                                            </li>
                                          </ul>

                                          {/* Segment Separator */}
                                          {segmentIndex <
                                            itinerary?.segments.length - 1 && (
                                            <hr className="segment-separator" />
                                          )}
                                        </div>
                                      )
                                    )}

                                    {/* Itinerary Separator */}
                                    {itineraryIndex <
                                      flight?.itineraries.length - 1 && (
                                      <hr className="itinerary-separator" />
                                    )}
                                  </div>
                                )
                              )}
                            </div>

                            <div className="fly-Save-box">
                              <h5>
                                {
                                  flight?.travelerPricings[0]
                                    ?.fareDetailsBySegment[0]?.cabin
                                }
                              </h5>
                              {/* <Link to="/BookYourTicket"> */}
                              <button
                                onClick={() =>
                                  handleBookTicket(
                                    cityMap,
                                    airlineNames,
                                    flight?.travelerPricings[0]
                                      ?.fareDetailsBySegment[0]?.cabin,
                                    `${flight?.itineraries[0]?.segments[0]?.carrierCode}-${flight?.itineraries[0]?.segments[0]?.number}`,
                                    getSearchDetails?.departureCountry,
                                    ContxtCurr ? ContxtCurr : flight?.price?.currency,
                                    flight?.price?.total,
                                    flylogo,
                                    flight?.itineraries,
                                    airlineNames[carrierCode]
                                  )
                                }
                              >
                                <p>{t('FlightsInner.Select')}</p>
                                <h3>
                                  {ContxtCurr ? ContxtCurr : flight?.price?.currency}{" "}
                                  { convertPrice(flight?.price?.total)}
                                </h3>
                              </button>
                              {/* </Link> */}
                              <h4>{t('FlightsInner.Round')}</h4>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {flightData?.length > 0 && (
                    <div className="Sec2-btn-box">
                      <button onClick={handleMoreResult}>
                        {" "}
                        {moreResultLoad ? "Showing..." : "Show More Results"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default Tab8;
