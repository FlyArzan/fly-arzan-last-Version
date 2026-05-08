import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'react-tabs/style/react-tabs.css'; // Import react-tabs CSS
import flylogo from "../../assets/Images/fly-logo.png";
import DropMoreFilters from "../drop-dwon/DropMoreFilters";

const cardsDatas = [
  {
    title: "Saver",
    price: "£ 350.00",
    baggage: "30Kg",
    cancellation: "Penalties Apply",
    modification: "Penalties Apply",
    NotIncluded: "Not Included",
    Included: "Included"
  },
  {
    title: "Standard",
    price: "£ 450.00",
    baggage: "40Kg",
    cancellation: "Free",
    modification: "Minimal Fees",
    NotIncluded: "Not Included",
    Included: "Included"
  },
  {
    title: "Premium",
    price: "£ 550.00",
    baggage: "50Kg",
    cancellation: "Free",
    modification: "Free",
    NotIncluded: "Not Included",
    Included: "Included"
  },
];
const cardData = [
  {
    flyLogo: flylogo,
    airline: "flydubai",
    flightNumber: "FZ-329",
    departureTime: "07:45 ",
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
    arrivalTime: "10:45 ",
    from: "Dubai (DXB)",
    to: "London (LDN)",
    baggage: "30kg",
    meal: "Meal",
    price: "£ 350.00",
    saveAmount: "£ 35.00",
  },
  // Add more card objects...
];;

const Flightsinner3 = () => {

  // To manage the visibility of the "my-new-box-card" for each card
  const [visible, setVisible] = useState(Array(cardData.length).fill(false));
  const [showAll, setShowAll] = useState(false);
  const toggleBoxVisibility = (index) => {
    const updatedVisible = [...visible];
    updatedVisible[index] = !updatedVisible[index]; // Toggle visibility
    setVisible(updatedVisible);
  };
  return (
    <>
      <section className="Flight-Departing">
        <div className="container">
          <div className="main-Flight-Departing ">
            <div className="Select-Departing-Flight-tab-box">
              <div className="Select-departing-main">
                <div className="Select-departing-tital">
                  <h2>Select your departing flight to London</h2>
                  <p>Total round trip price for all travelers</p>
                </div>

                <div className="Select-departing-card-box">
                  {cardData.map((card, index) => (
                    <div className="Select-departing-card  height-auto" key={index}>
                      <div className="fly-box">
                        <img
                          src={card.flyLogo}
                          alt={`${card.airline} airline logo`}
                        />
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
                          <li>Nonstop</li>
                          <li>{card.to}</li>
                        </ul>
                        <div className="fly-min-box">
                          <span>
                            <p>Total: {card.baggage}</p>
                          </span>
                          <span>
                            <p>{card.meal}</p>
                          </span>
                        </div>
                      </div>

                      <div className="fly-Save-box">
                        <span>Save {card.saveAmount}</span>
                        <button onClick={() => toggleBoxVisibility(index)}>
                          <p>Reserve Now</p>
                          <h3>{card.price}</h3>
                        </button>
                        <h4>Round Trip Price</h4>
                      </div>

                      {/* Show the "my-new-box-card" when button is clicked */}
                      {visible[index] && (
                        <div className="my-new-box-card">
                          <h2>Select a fare option</h2>

                          <div className="fare-option-box">
                            {cardsDatas.map((card, index) => (
                              <div className="fare-option-card" key={index}>
                                <div className="fare-option-head">
                                  <h2>{card.title}</h2>
                                  <h3>{card.price}</h3>
                                </div>
                                <div className="fare-option-body">
                                  <div className="box-icon">
                                    <span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <g clipPath="url(#clip0_261_755)">
                                          <path d="M15.5938 5.93736H14.3605V2.20899C14.3605 1.32814 13.6439 0.611328 12.7629 0.611328H8.45799C7.57713 0.611328 6.86024 1.32814 6.86024 2.20899V5.93728H5.62706C4.85662 5.93728 4.23193 6.56196 4.23193 7.33241V17.866C4.23193 18.6368 4.85678 19.2613 5.62706 19.2613H5.81414V20.2741C5.81414 20.4605 5.96521 20.6113 6.15124 20.6113H7.74665C7.93308 20.6113 8.08392 20.4603 8.08392 20.2741V19.2613H13.1365V20.2741C13.1365 20.4605 13.2878 20.6113 13.4738 20.6113H15.0691C15.2557 20.6113 15.4063 20.4603 15.4063 20.2741V19.2613H15.5936C16.3641 19.2613 16.9888 18.6366 16.9888 17.866V7.33249C16.9889 6.56188 16.3642 5.93736 15.5938 5.93736ZM13.2952 5.93728H7.92519V2.20899C7.92519 1.91537 8.16413 1.67644 8.45774 1.67644H12.7626C13.0563 1.67644 13.2952 1.91537 13.2952 2.20899V5.93728Z" fill="#353978" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_261_755">
                                            <rect width="20" height="20" fill="white" transform="translate(0.610352 0.611328)" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <h3>Check-in Baggage</h3>
                                    </span>
                                    <h3>Total: {card.baggage}</h3>
                                  </div>
                                  <div className="box-icon">
                                    <span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <g clipPath="url(#clip0_261_761)">
                                          <path d="M16.4697 12.3672C14.2083 12.3672 12.3682 14.2074 12.3682 16.4687C12.3682 18.7301 14.2083 20.6093 16.4697 20.6093C18.731 20.6093 20.6103 18.7301 20.6103 16.4687C20.6103 14.2074 18.731 12.3672 16.4697 12.3672ZM18.0558 17.2263C18.2847 17.4551 18.2847 17.826 18.0558 18.0548C17.8269 18.2837 17.4561 18.2837 17.2273 18.0548L16.4696 17.2972L15.712 18.0548C15.4832 18.2837 15.1124 18.2837 14.8835 18.0548C14.6546 17.826 14.6546 17.4551 14.8835 17.2263L15.6411 16.4687L14.8835 15.7111C14.6546 15.4822 14.6546 15.1114 14.8835 14.8825C15.1124 14.6536 15.4832 14.6536 15.712 14.8825L16.4696 15.6401L17.2273 14.8825C17.4561 14.6536 17.8269 14.6536 18.0558 14.8825C18.2847 15.1114 18.2847 15.4822 18.0558 15.7111L17.2982 16.4687L18.0558 17.2263Z" fill="#353978" />
                                          <path d="M18.2826 1.27955C17.3963 0.39323 15.8525 0.394363 14.9684 1.27955L11.3732 4.86955L4.83465 1.23724C4.60633 1.10963 4.32083 1.14971 4.13598 1.3351L2.47834 2.99219C2.36104 3.10949 2.29866 3.2714 2.30725 3.43734C2.31639 3.60328 2.39479 3.75718 2.52412 3.86191L8.19231 8.44924L5.19629 11.843L3.07799 11.1374C2.86686 11.0659 2.63451 11.122 2.4783 11.2787L0.782189 12.9358C0.64887 13.0692 0.587659 13.258 0.617972 13.444C0.648284 13.6299 0.766173 13.7901 0.934414 13.8743L4.11372 15.4438L5.68327 18.5841C5.76737 18.7523 5.92761 18.8702 6.11358 18.9005C6.29424 18.93 6.48623 18.8725 6.6217 18.7363L8.27879 17.0792C8.43559 16.9224 8.49051 16.6901 8.42012 16.4795L7.71458 14.3612L11.0705 11.3984L12.3328 13.2381C13.2785 12.0301 14.7242 11.2382 16.3663 11.2057L14.688 8.18436L18.2826 4.59377C19.1985 3.6789 19.199 2.19485 18.2826 1.27955Z" fill="#353978" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_261_761">
                                            <rect width="20" height="20" fill="white" transform="translate(0.610352 0.611328)" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <h3>Cancellation</h3>
                                    </span>
                                    <h3>{card.cancellation}</h3>
                                  </div>
                                  <div className="box-icon">
                                    <span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <g clipPath="url(#clip0_261_767)">
                                          <path d="M12.0379 13.327C11.8457 13.519 11.6082 13.6658 11.3508 13.7516L8.86484 14.5802C8.68543 14.6401 8.49832 14.6705 8.30902 14.6705C7.83945 14.6705 7.39801 14.4876 7.06602 14.1556C6.59215 13.6816 6.42949 12.9924 6.64141 12.3567L7.47008 9.87086C7.55582 9.6134 7.7027 9.37574 7.89469 9.18375L13.264 3.81445H2.75879C1.57414 3.81445 0.610352 4.77824 0.610352 5.96289V18.4629C0.610352 19.6475 1.57414 20.6113 2.75879 20.6113H15.2588C16.4434 20.6113 17.4072 19.6475 17.4072 18.4629V7.95766L12.0379 13.327Z" fill="#353978" />
                                          <path d="M8.72343 10.013C8.6591 10.0773 8.61066 10.1557 8.58191 10.242L7.75324 12.7279C7.68304 12.9385 7.73785 13.1706 7.89476 13.3275C8.05171 13.4845 8.28382 13.5393 8.49437 13.4691L10.9803 12.6404C11.0666 12.6117 11.145 12.5632 11.2093 12.4989L18.529 5.17926L16.0431 2.69336L8.72343 10.013Z" fill="#353978" />
                                          <path d="M19.2194 0.897354C18.838 0.515986 18.2197 0.515986 17.8383 0.897354L16.8716 1.86411L19.3575 4.35005L20.3243 3.38329C20.7056 3.00192 20.7056 2.3836 20.3243 2.00224L19.2194 0.897354Z" fill="#353978" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_261_767">
                                            <rect width="20" height="20" fill="white" transform="translate(0.610352 0.611328)" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <h3>Modification</h3>
                                    </span>
                                    <h3>{card.modification}</h3>
                                  </div>
                                  <div className="box-icon">
                                    <span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <g clipPath="url(#clip0_261_775)">
                                          <path d="M3.96541 4.7512C4.87043 5.3812 6.11543 5.16121 6.74543 4.26121C7.38044 3.3562 7.16041 2.1112 6.25544 1.47623C5.35043 0.841215 4.10543 1.0612 3.47041 1.96621C2.84041 2.87118 3.06044 4.11618 3.96541 4.7512Z" fill="#353978" />
                                          <path d="M4.57536 15.5713L2.61037 6.11133H0.610352L2.60535 15.8663C2.97533 18.3063 5.07533 20.1113 7.54536 20.1113H14.6104V18.1113H7.54035C6.06036 18.1113 4.80036 17.0313 4.57536 15.5713Z" fill="#353978" />
                                          <path d="M14.8401 14.1103H9.96015L8.93513 10.0103C10.5101 10.9003 12.2151 11.5553 14.0851 11.2303V9.10535C12.4552 9.41037 10.6451 8.83034 9.39516 7.86035L7.75018 6.58034C7.52518 6.40535 7.2602 6.28034 6.98518 6.20032C6.67018 6.11032 6.3302 6.08534 5.99518 6.14032L5.9702 6.14534C4.74521 6.36035 3.92518 7.52534 4.1402 8.75032L5.49521 14.6703C5.76521 16.0853 7.00023 17.1103 8.44023 17.1103H15.2902L19.1102 20.1103L20.6102 18.6103L14.8401 14.1103Z" fill="#353978" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_261_775">
                                            <rect width="20" height="20" fill="white" transform="translate(0.610352 0.611328)" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <h3>Seat</h3>
                                    </span>
                                    <h3>{card.NotIncluded}</h3>
                                  </div>
                                  <div className="box-icon">
                                    <span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <g clipPath="url(#clip0_261_784)">
                                          <path d="M11.4045 4.71875C9.17086 4.71875 7.35352 6.5361 7.35352 8.76977C7.35352 11.004 9.17086 12.8218 11.4045 12.8218C13.6382 12.8218 15.4556 11.004 15.4556 8.76977C15.4556 6.5361 13.6382 4.71875 11.4045 4.71875ZM11.9142 5.9575C11.9023 5.9575 11.8901 5.95651 11.878 5.95452C11.723 5.92866 11.5637 5.91544 11.4045 5.91544C11.284 5.91544 11.1863 5.81768 11.1863 5.69719C11.1863 5.57669 11.284 5.47894 11.4045 5.47894C11.5877 5.47894 11.7711 5.49414 11.9499 5.52398C12.0688 5.54387 12.1491 5.65641 12.1292 5.7752C12.1113 5.88191 12.0189 5.9575 11.9142 5.9575ZM14.4773 8.98816C14.3568 8.98816 14.259 8.89041 14.259 8.76991C14.259 7.65208 13.6011 6.6313 12.5829 6.16922C12.4732 6.11934 12.4246 5.99004 12.4743 5.8802C12.5241 5.77065 12.6535 5.72191 12.7634 5.77164C13.937 6.30434 14.6955 7.48129 14.6955 8.76991C14.6955 8.89041 14.5977 8.98816 14.4773 8.98816Z" fill="#353978" />
                                          <path d="M11.4034 2.34375C9.02875 2.34375 6.95393 3.63294 5.84229 5.54769L6.29335 6.64186C6.74734 7.7273 6.79969 8.935 6.44759 10.0553L8.23148 14.3593C9.16558 14.8947 10.2481 15.1973 11.4034 15.1973C12.4422 15.1973 13.4229 14.9529 14.2901 14.5106L16.0128 10.3551L16.3475 9.54898L17.5057 6.74957C16.6617 4.19165 14.2465 2.34375 11.4034 2.34375ZM11.4034 13.2593C8.92985 13.2593 6.91614 11.2456 6.91614 8.76911C6.91614 6.29559 8.92985 4.28188 11.4034 4.28188C13.8798 4.28188 15.8906 6.29559 15.8906 8.76911C15.8906 11.2456 13.8798 13.2593 11.4034 13.2593Z" fill="#353978" />
                                          <path d="M8.28964 17.8166C7.86166 17.9925 7.37605 17.7835 7.20414 17.3656L4.61133 11.109L6.15074 10.4746L8.74071 16.7283C8.91527 17.1532 8.7145 17.6391 8.28964 17.8166Z" fill="#353978" />
                                          <path d="M17.951 11.1588L15.5531 16.9527C15.3765 17.3822 14.8797 17.5754 14.4677 17.4037C14.0427 17.2262 13.842 16.7402 14.0166 16.3153L16.4174 10.5215L17.951 11.1588Z" fill="#353978" />
                                          <path d="M16.5835 10.1192L18.9478 4.41126C19.0658 4.12634 19.3924 3.99104 19.6774 4.10906C19.9046 4.20319 20.0435 4.43496 20.0194 4.67975L19.6987 7.93071C19.5882 9.05088 19.0163 10.0745 18.1202 10.7557L16.5835 10.1192Z" fill="#353978" />
                                          <path d="M5.89135 6.80788L4.92591 4.47709C4.61353 3.72261 3.62014 4.23169 3.89411 4.89306L4.89543 7.31038C4.94161 7.42178 4.88875 7.54938 4.77736 7.59556C4.66776 7.64122 4.53884 7.59003 4.49218 7.47748L3.40946 4.86359C3.31608 4.63816 3.05773 4.53101 2.83222 4.62418L2.82337 4.62784C2.59733 4.72123 2.48991 4.98026 2.58351 5.20621L3.66606 7.8195C3.71224 7.9309 3.65938 8.05849 3.54798 8.10467C3.43839 8.15034 3.30947 8.09915 3.26281 7.9866L2.27827 5.60989C2.01134 4.96553 0.939629 5.28504 1.25689 6.05096L2.20323 8.33557C2.63377 9.37497 3.43218 10.2193 4.44586 10.7073L5.98257 10.0708C6.35443 9.00894 6.32189 7.84734 5.89135 6.80788Z" fill="#353978" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_261_784">
                                            <rect width="20" height="20" fill="white" transform="translate(0.610352 0.111328)" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <h3>Meal</h3>
                                    </span>
                                    <h3>{card.Included}</h3>
                                  </div>
                                </div>
                                <div className="fare-option-btn-box">
                                  <button>Select</button>

                                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0_261_736)">
                                      <path d="M7.89893 0.626953C3.75368 0.626953 0.398926 3.98133 0.398926 8.12695C0.398926 12.2721 3.7533 15.627 7.89893 15.627C12.0442 15.627 15.3989 12.2726 15.3989 8.12695C15.3989 3.98177 12.0446 0.626953 7.89893 0.626953ZM7.89893 14.5804C4.34047 14.5804 1.44544 11.6854 1.44544 8.12695C1.44544 4.56847 4.34047 1.67347 7.89893 1.67347C11.4574 1.67347 14.3524 4.56847 14.3524 8.12695C14.3524 11.6854 11.4574 14.5804 7.89893 14.5804Z" fill="#939393" />
                                      <path d="M7.89933 6.87891C7.45507 6.87891 7.13916 7.06652 7.13916 7.34294V11.1042C7.13916 11.3412 7.45507 11.5781 7.89933 11.5781C8.32384 11.5781 8.66934 11.3412 8.66934 11.1042V7.34288C8.66934 7.06649 8.32384 6.87891 7.89933 6.87891Z" fill="#939393" />
                                      <path d="M7.89935 4.55859C7.44522 4.55859 7.08984 4.88438 7.08984 5.25952C7.08984 5.6347 7.44524 5.97035 7.89935 5.97035C8.3436 5.97035 8.69903 5.6347 8.69903 5.25952C8.69903 4.88438 8.34357 4.55859 7.89935 4.55859Z" fill="#939393" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_261_736">
                                        <rect width="15" height="15" fill="white" transform="translate(0.398926 0.626953)" />
                                      </clipPath>
                                    </defs>
                                  </svg> <p>Total Round Trip Price</p></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="Sec2-btn-box">
                  <button onClick={toggleShowAll}>
                    {showAll ? t("buttons.showLess") : t("buttons.more")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Flightsinner3;
