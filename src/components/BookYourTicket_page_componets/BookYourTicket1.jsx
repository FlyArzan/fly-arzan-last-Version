import React, { useContext, useEffect, useState } from "react";

import dubai from "../../assets/Images/dubai.png";
import DropBookTicket from "../drop-dwon/DropBookTicket";
import { Link, useNavigate } from "react-router-dom";
import ClosedFaq from "../../assets/Images/ClosedFaq.png";
import Openedfaq from "../../assets/Images/Openedfaq.png";
import { FlightContext } from "../../context/FlightContext";
import Extraservice from "../Extra-service-componets/Extraservice";
import { useTranslation } from "react-i18next";
const BookYourTicket1 = () => {
  const [openFaq, setOpenFaq] = useState(null); // Track which FAQ is open
  const [showAll, setShowAll] = useState(false); // Track if all FAQs should be shown
  const { FlightBookingData } = useContext(FlightContext);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index); // Toggle the selected FAQ
  };

  const toggleShowAll = () => {
    setShowAll(!showAll); // Toggle showing all FAQs
  };
  const faqs = [
    {
      question: "Pre-Booking Notice",
    },
  ];
  // useEffect(() => {
  //   if (!FlightBookingData && FlightBookingData == null) {
  //     navigate("/");
  //   }
  // }, [FlightBookingData]);
  const [isVisible, setIsVisible] = useState(null);
  const { t } = useTranslation();
  const formatDuration = (duration) => {
    if (!duration) return "Unknown Duration"; // Agar duration undefined hai to handle karo
    duration = duration.replace(/^[A-Z]+/, ""); // Remove any prefix like PT, IT, etc.
    const match = duration.match(/(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return "Unknown Duration";
    const hours = match[1] ? `${match[1]}h` : ""; // If hours exist, format "xh"
    const minutes = match[2] ? `${match[2]}m` : ""; // If minutes exist, format "xm"
    return `${hours} ${minutes}`.trim(); // Remove extra spaces
  };
  const formatDate = (dateString) => {
    if (!dateString) return;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short", // Sun
      day: "2-digit", // 12
      month: "short", // Jan
      year: "numeric", // 2025
    })
      .format(date)
      .replace(",", "");
  };
  const navigateTo = () => navigate("/");

  return (
    <>
      {FlightBookingData?.itineraries?.length === 0 ? (
        <section className="Book-Your-Ticket1-sec withOutContxtClass">
          <div className="container">
            <div className="Book-Your-Ticket1-main">
              <div className="Book-Your-Ticket-Back-box">
                <Link to="/FlightsInner">
                  <div className="Back-to-result-box">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="37"
                      height="18"
                      viewBox="0 0 37 18"
                      fill="none"
                    >
                      <path
                        d="M0.423927 7.97248C0.424362 7.97204 0.424725 7.97153 0.425228 7.9711L7.97727 0.422705C8.54304 -0.142771 9.45814 -0.140667 10.0213 0.42764C10.5844 0.995874 10.5822 1.91496 10.0165 2.48051L4.94602 7.54839H35.5547C36.3529 7.54839 37 8.19827 37 9C37 9.80173 36.3529 10.4516 35.5547 10.4516H4.94609L10.0164 15.5195C10.5822 16.085 10.5843 17.0041 10.0212 17.5724C9.45807 18.1407 8.54289 18.1427 7.9772 17.5773L0.425156 10.0289C0.424725 10.0285 0.424362 10.028 0.423855 10.0275C-0.1422 9.46009 -0.140392 8.53802 0.423927 7.97248Z"
                        fill="black"
                      />
                    </svg>
                    <p>{t("BookYourTicket.Back_result")}</p>
                  </div>
                </Link>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={navigateTo}
                  className="fly-ticket-box"
                >
                  <h2>Dubai</h2>

                  <ul>
                    <li className="traveller">1 traveller</li>
                    <li>Return</li>
                    <li>Economy class</li>
                  </ul>
                </div>
              </div>
              <div className="Book-Your-Ticket-box">
                <h2>{t("BookYourTicket.Book")}</h2>
                <div className="BookTicket-box">
                  <div className="faqs--descriptionxx">
                    {faqs
                      .slice(0, showAll ? faqs.length : 7)
                      .map((faq, index) => (
                        <div key={index} className="faq--1">
                          <div
                            className="faq--item--heading"
                            onClick={() => toggleFaq(index)}
                          >
                            <h1>{faq.question}</h1>
                            <span>
                              {openFaq === index ? (
                                <img src={ClosedFaq} alt="Collapse" />
                              ) : (
                                <img src={Openedfaq} alt="Expand" />
                              )}
                            </span>
                          </div>
                          {openFaq === index && (
                            <div className="faq--1--paragraph">
                              <p>{t("BookYourTicket.text1")}</p>
                              <p>{t("BookYourTicket.text2")}</p>
                              <p>{t("BookYourTicket.text3")}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="Extra-main-box">
                  <div className="Extra-service-box">
                    {/* <h3 onClick={() => setIsVisible(!isVisible)} style={{ cursor: "pointer" }}>
          Extra service
        </h3> */}
                    <div className="Extra-service-btn-box">
                      <button style={{ cursor: "text" }}>
                        <h3>{t("BookYourTicket.Extra")}</h3>
                      </button>
                      <button
                        onClick={() => setIsVisible(isVisible === 1 ? null : 1)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3>{t("BookYourTicket.Saver")}</h3>
                      </button>
                      <button
                        onClick={() => setIsVisible(isVisible === 2 ? null : 2)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3>{t("BookYourTicket.Standard")}</h3>
                      </button>
                      <button
                        onClick={() => setIsVisible(isVisible === 3 ? null : 3)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3>{t("BookYourTicket.Premium")}</h3>
                      </button>
                    </div>
                  </div>
                  {isVisible && (
                    <div className="Book-Your-Ticket-card-box">
                      <Extraservice toDisplay={isVisible} />
                    </div>
                  )}
                </div>

                <div className="Book-Your-Ticket-card-box">
                  <div className="Book-Your-Ticket-card">
                    <div className="Book-Your-Ticket-card-tital">
                      <h3>Trip.com</h3>
                      <div className="Book-Your-star">
                        <div className="Book-Your-star-box">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="22"
                            viewBox="0 0 24 22"
                            fill="none"
                          >
                            <path
                              d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                              fill="#F55D42"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="22"
                            viewBox="0 0 24 22"
                            fill="none"
                          >
                            <path
                              d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                              fill="#F55D42"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="22"
                            viewBox="0 0 24 22"
                            fill="none"
                          >
                            <path
                              d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                              fill="#F55D42"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="22"
                            viewBox="0 0 24 22"
                            fill="none"
                          >
                            <path
                              d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                              fill="#F55D42"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="22"
                            viewBox="0 0 24 22"
                            fill="none"
                          >
                            <path
                              d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                              fill="#F55D42"
                            />
                          </svg>
                        </div>
                        <button>20:00</button>
                      </div>
                      <p>24/7 live Chat & Telephone Support</p>
                    </div>
                    <div className="Book-Your-Ticket-btn-box">
                      <h4>EUR 200</h4>
                      <Link to="/loader">
                        <button>Select</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Flight-Details-box">
                <h2> {t("BookYourTicket.Flight_Details")}</h2>
                <span>
                  {t("BookYourTicket.Outbound")} <p>Sun,12 -Jan-2025</p>
                </span>
                <div className="Flight-Details-card-box">
                  <div className="Flight-Details-card">
                    <div className="Flight-Details-card-head">
                      <div className="Flight-Details-card-head-logo">
                        <img src={dubai} alt="" />
                        <p>FZ-329</p>
                      </div>
                      <div className="Flight-Details-card-head-time-box">
                        <div className="Flight-Details-time-card">
                          <h2>07:45</h2>
                          <p>Dubai (DXB)</p>
                        </div>

                        <div className="Flight-Details-time-card">
                          <button>2h 5m</button>
                          <p>Nonstop</p>
                        </div>

                        <div className="Flight-Details-time-card">
                          <h2>10:45</h2>
                          <p>London (LDN)</p>
                        </div>
                      </div>
                    </div>

                    <div className="Flight-Details-card-body">
                      <p>FZ-329</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="73"
                        viewBox="0 0 6 73"
                        fill="none"
                      >
                        <path
                          d="M3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333ZM3 67.3333C1.52724 67.3333 0.333336 68.5272 0.333336 70C0.333336 71.4728 1.52724 72.6667 3 72.6667C4.47276 72.6667 5.66667 71.4728 5.66667 70C5.66667 68.5272 4.47276 67.3333 3 67.3333ZM2.5 3L2.5 70L3.5 70L3.5 3L2.5 3Z"
                          fill="black"
                        />
                      </svg>
                      <div className="Flight-Details-fly-dubai">
                        <img src={dubai} alt="" />
                        <span>
                          <h2>07:45</h2> <p>Dubai (DXB)</p>
                        </span>

                        <span className="padding-top-span">
                          <h2>10:45</h2> <p>London (LDN)</p>
                        </span>
                      </div>
                    </div>

                    <div className="Flight-Details-card-bottom">
                      <p>04 Jan, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="Book-Your-Ticket1-sec">
          <div className="container">
            <div className="Book-Your-Ticket1-main">
              <div className="Book-Your-Ticket-Back-box">
                <Link to="/FlightsInner">
                  <div className="Back-to-result-box">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="37"
                      height="18"
                      viewBox="0 0 37 18"
                      fill="none"
                    >
                      <path
                        d="M0.423927 7.97248C0.424362 7.97204 0.424725 7.97153 0.425228 7.9711L7.97727 0.422705C8.54304 -0.142771 9.45814 -0.140667 10.0213 0.42764C10.5844 0.995874 10.5822 1.91496 10.0165 2.48051L4.94602 7.54839H35.5547C36.3529 7.54839 37 8.19827 37 9C37 9.80173 36.3529 10.4516 35.5547 10.4516H4.94609L10.0164 15.5195C10.5822 16.085 10.5843 17.0041 10.0212 17.5724C9.45807 18.1407 8.54289 18.1427 7.9772 17.5773L0.425156 10.0289C0.424725 10.0285 0.424362 10.028 0.423855 10.0275C-0.1422 9.46009 -0.140392 8.53802 0.423927 7.97248Z"
                        fill="black"
                      />
                    </svg>
                    <p>Back to result</p>
                  </div>
                </Link>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={navigateTo}
                  className="fly-ticket-box"
                >
                  <h2>{FlightBookingData?.departureCountry}</h2>
                  <ul>
                    <li className="traveller">
                      {FlightBookingData?.traveller} traveller
                    </li>
                    <li>{FlightBookingData?.type}</li>
                    <li>{FlightBookingData?.cabin} class</li>
                  </ul>
                </div>
              </div>

              <div className="Book-Your-Ticket-box">
                <h2>Book Your Flight</h2>
                <div className="BookTicket-box">
                  <div className="faqs--descriptionxx">
                    {faqs
                      .slice(0, showAll ? faqs.length : 7)
                      .map((faq, index) => (
                        <div key={index} className="faq--1">
                          <div
                            className="faq--item--heading"
                            onClick={() => toggleFaq(index)}
                          >
                            <h1>{faq.question}</h1>
                            <span>
                              {openFaq === index ? (
                                <img src={ClosedFaq} alt="Collapse" />
                              ) : (
                                <img src={Openedfaq} alt="Expand" />
                              )}
                            </span>
                          </div>
                          {openFaq === index && (
                            <div className="faq--1--paragraph">
                              <p>
                                Please note that flight prices, schedules, and
                                durations may change at any time. When you
                                proceed to book, you will be redirected to our
                                partner&apos;s website, where the final price
                                and flight information will be confirmed.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="Extra-main-box">
                  <div className="Extra-service-box">
                    {/* <h3 onClick={() => setIsVisible(!isVisible)} style={{ cursor: "pointer" }}>
          Extra service
        </h3> */}
                    <div className="Extra-service-btn-box">
                      <button
                        // onClick={() => setIsVisible(!isVisible)}
                        style={{ cursor: "text" }}
                      >
                        {" "}
                        <h3> {t("BookYourTicket.Extra")}</h3>
                      </button>
                      <button
                        onClick={() => setIsVisible(1)}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        <h3> {t("BookYourTicket.Saver")}</h3>
                      </button>
                      <button
                        onClick={() => setIsVisible(2)}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        <h3> {t("BookYourTicket.Standard")}</h3>
                      </button>
                      <button
                        onClick={() => setIsVisible(3)}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        <h3> {t("BookYourTicket.Premium")}</h3>
                      </button>
                      {/* <button>1 Stop  </button> */}
                    </div>
                  </div>
                  {isVisible && (
                    <div className="Book-Your-Ticket-card-box">
                      <Extraservice toDisplay={isVisible} />
                    </div>
                  )}
                </div>

                <div className="Book-Your-Ticket-card-box">
                  <div className="Book-Your-Ticket-card">
                    <div className="Book-Your-Ticket-card-tital">
                      <h3>{FlightBookingData?.airline}</h3>
                      <div className="Book-Your-star">
                        <div className="Book-Your-star-box">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="22"
                              viewBox="0 0 24 22"
                              fill="none"
                            >
                              <path
                                d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                                fill="#F55D42"
                              />
                            </svg>
                          ))}
                        </div>
                        <button>20:00</button>
                      </div>
                      <p>24/7 live Chat & Telephone Support</p>
                    </div>
                    <div className="Book-Your-Ticket-btn-box">
                      <h4>
                        {FlightBookingData?.currency} {FlightBookingData?.price}
                      </h4>
                      <Link to="/loader">
                        <button>Select</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Flight-Details-box">
                <h2>Flight Details</h2>
                <span>
                  Outbound{" "}
                  <p>
                    {formatDate(
                      FlightBookingData?.itineraries[0]?.segments[0]?.departure
                        ?.at
                    )}
                  </p>
                </span>
                <div className="Flight-Details-card-box">
                  {FlightBookingData?.itineraries.map(
                    (itinerary, itineraryIndex) => (
                      <div key={itineraryIndex} className="Flight-Details-card">
                        <div className="Flight-Details-card-head">
                          <div className="Flight-Details-card-head-logo">
                            <img
                              src={
                                new URL(
                                  FlightBookingData?.flylogo,
                                  import.meta.url
                                ).href
                              }
                              alt="Logo"
                            />
                            <p>{FlightBookingData?.carrierCode}</p>
                          </div>
                          <div className="Flight-Details-card-head-time-box">
                            <div className="Flight-Details-time-card">
                              <h2>
                                {new Date(
                                  itinerary?.segments[0]?.departure?.at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </h2>
                              <p>
                                {
                                  FlightBookingData?.cityMap[
                                    itinerary?.segments[0]?.departure?.iataCode
                                  ]
                                }{" "}
                                ({itinerary?.segments[0]?.departure?.iataCode})
                              </p>
                            </div>
                            <div className="Flight-Details-time-card">
                              <button>
                                {formatDuration(itinerary?.duration)}
                              </button>
                              <p>
                                {itinerary?.segments[0]?.numberOfStops === 0
                                  ? "Nonstop"
                                  : "Stopover"}
                              </p>
                            </div>
                            <div className="Flight-Details-time-card">
                              <h2>
                                {new Date(
                                  itinerary?.segments[0]?.arrival?.at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </h2>
                              <p>
                                {
                                  FlightBookingData?.cityMap[
                                    itinerary?.segments[0]?.arrival?.iataCode
                                  ]
                                }{" "}
                                ({itinerary?.segments[0]?.arrival?.iataCode})
                              </p>
                            </div>
                          </div>
                        </div>

                        {itinerary?.segments.map((segment, segmentIndex) => (
                          <div
                            key={segmentIndex}
                            className="Flight-Details-card-body"
                          >
                            <p>{FlightBookingData.carrierCode}</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="73"
                              viewBox="0 0 6 73"
                              fill="none"
                            >
                              <path
                                d="M3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333ZM3 67.3333C1.52724 67.3333 0.333336 68.5272 0.333336 70C0.333336 71.4728 1.52724 72.6667 3 72.6667C4.47276 72.6667 5.66667 71.4728 5.66667 70C5.66667 68.5272 4.47276 67.3333 3 67.3333ZM2.5 3L2.5 70L3.5 70L3.5 3L2.5 3Z"
                                fill="black"
                              />
                            </svg>
                            <div className="Flight-Details-fly-dubai">
                              {segmentIndex === 0 && <img src={dubai} alt="" />}
                              <span>
                                <h2>
                                  {new Date(
                                    segment?.departure?.at
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </h2>
                                <p>
                                  {
                                    FlightBookingData?.cityMap[
                                      segment?.departure?.iataCode
                                    ]
                                  }{" "}
                                  ({segment?.departure?.iataCode})
                                </p>
                              </span>
                              <span className="padding-top-span">
                                <h2>
                                  {new Date(
                                    segment?.arrival?.at
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </h2>
                                <p>
                                  {
                                    FlightBookingData?.cityMap[
                                      segment?.arrival?.iataCode
                                    ]
                                  }{" "}
                                  ({segment?.arrival?.iataCode})
                                </p>
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className="Flight-Details-card-bottom">
                          <p>
                            {new Date(
                              itinerary?.segments[0]?.arrival?.at
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BookYourTicket1;
