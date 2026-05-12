import { useState, useEffect, useContext } from "react";
import logo from "../assets/Images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Login from "../components/login/Login";
import { FlightContext } from "../context/FlightContext";
import { useTranslation } from "react-i18next";
import RegionModal from "../components/RegionModal/RegionModal";
import { useRegionalSettings } from "../context/RegionalSettingsContext";
import { HiMenuAlt3 } from "react-icons/hi";

const Header = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { selectedCurrencySymbol } = useRegionalSettings();

  const selectCount = JSON.parse(localStorage.getItem("selectCountry"));
  const selectLocalLang = JSON.parse(localStorage.getItem("selectLang"));
  const userToken = localStorage.getItem("token");

  const [showPopup, setShowPopup] = useState(false);
  const { setContextData, setFlightBookingData } = useContext(FlightContext);

  const [isFixed, setIsFixed] = useState(false);
  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }

      // Close the menu when scrolling
      if (menuOpen) {
        setClosing(true);
        setTimeout(() => {
          setClosing(false);
          setMenuOpen(false);
        }, 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]); // Add menuOpen as a dependency

  const toggleMenu = () => {
    if (menuOpen) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        setMenuOpen(false);
      }, 10);
    } else {
      setMenuOpen(true);
    }
  };
  const hanldeNavigate = () => {
    setFlightBookingData({});
    setContextData(null);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <>
      <header className={`header ${isFixed ? "fixed-header" : ""}`}>
        <div className="top-bar">
          <div className="container top-bar-container">
            <div className="top-bar-social-links">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/icons/dribbble.svg" alt="Dribbble" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/icons/youtube.svg" alt="Youtube" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/icons/facebook.svg" alt="Facebook" />
              </a>
            </div>
            <a href="mailto:flyarzan@mail.com" className="top-bar-mail">
              <img src="/icons/sms.svg" alt="Mail" />
              <p>flyarzan@mail.com</p>
            </a>
          </div>
        </div>
        <div className="container">
          <nav className="nav-1">
            <div onClick={() => hanldeNavigate()} className="nav-logo">
              <img src={logo} alt="Fly Arzan" />
            </div>
            <div className="nav-box">
              <div onClick={() => setModal(true)} className="nav-btn-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <g clipPath="url(#clip0_146_9)">
                    <path
                      d="M24.3242 16.8871C24.7743 15.5987 25.0199 14.215 25.0199 12.7748C25.0199 11.3347 24.7743 9.95101 24.3242 8.66255C24.3132 8.62384 24.3002 8.5861 24.2844 8.54978C22.5482 3.7303 17.9304 0.274902 12.5201 0.274902C7.10976 0.274902 2.49181 3.7303 0.755743 8.54978C0.739974 8.58622 0.726834 8.62384 0.715964 8.66255C0.265851 9.95101 0.0202484 11.3347 0.0202484 12.7748C0.0202484 14.215 0.265851 15.5987 0.715964 16.8871C0.726954 16.9258 0.739974 16.9636 0.755743 16.9999C2.49193 21.8195 7.10976 25.2748 12.5201 25.2748C17.9304 25.2748 22.5482 21.8194 24.2844 16.9999C24.3002 16.9636 24.3132 16.926 24.3242 16.8871ZM12.5201 23.4831C12.044 23.4831 11.2765 22.6215 10.635 20.6968C10.3254 19.7681 10.0775 18.7004 9.89692 17.5389H15.1432C14.9626 18.7004 14.7147 19.768 14.4052 20.6968C13.7636 22.6215 12.9961 23.4831 12.5201 23.4831ZM9.67951 15.747C9.59338 14.7916 9.54787 13.7949 9.54787 12.7748C9.54787 11.7548 9.59338 10.7581 9.67951 9.80264H15.3605C15.4466 10.7581 15.4921 11.7548 15.4921 12.7748C15.4921 13.7949 15.4466 14.7916 15.3605 15.747H9.67951ZM1.81198 12.775C1.81198 11.7441 1.95879 10.7468 2.23199 9.80276H7.88229C7.79855 10.7779 7.75602 11.7773 7.75602 12.775C7.75602 13.7727 7.79843 14.772 7.88229 15.7472H2.23199C1.95879 14.803 1.81198 13.8059 1.81198 12.775ZM12.5201 2.06675C12.9961 2.06675 13.7637 2.92827 14.4052 4.85296C14.7147 5.78173 14.9627 6.84944 15.1432 8.01079H9.8968C10.0774 6.84932 10.3253 5.78173 10.6349 4.85296C11.2765 2.92827 12.044 2.06675 12.5201 2.06675ZM17.1577 9.80276H22.808C23.0812 10.7468 23.228 11.7441 23.228 12.775C23.228 13.8059 23.0812 14.8031 22.808 15.7472H17.1577C17.2415 14.772 17.284 13.7727 17.284 12.775C17.284 11.7773 17.2415 10.7779 17.1577 9.80276ZM22.1079 8.01091H16.9521C16.6334 5.81327 16.0867 3.84164 15.3197 2.43898C18.2935 3.24519 20.7573 5.30355 22.1079 8.01091ZM9.72036 2.43886C8.95333 3.84152 8.40658 5.81315 8.08787 8.01091H2.93212C4.28282 5.30355 6.74649 3.24519 9.72036 2.43886ZM2.93212 17.5389H8.08787C8.40658 19.7365 8.95333 21.7082 9.72036 23.1109C6.74649 22.3046 4.28282 20.2464 2.93212 17.5389ZM15.3197 23.1109C16.0867 21.7083 16.6334 19.7367 16.9521 17.5389H22.1079C20.7573 20.2464 18.2935 22.3046 15.3197 23.1109Z"
                      fill="#272727"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_146_9">
                      <rect
                        width="25"
                        height="25"
                        fill="white"
                        transform="translate(0.0200195 0.274902)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                {/* <p>{selectCount?.countryCode?.toUpperCase()} - £</p> */}
                <p className="tw:whitespace-nowrap">
                  {selectLocalLang?.code?.toUpperCase()?.replace(/-.*$/, "") ||
                    "EN"}{" "}
                  - {selectedCurrencySymbol}
                </p>
              </div>
              {!userToken ? (
                <Link>
                  <button
                    className="nav-btn-box nav-login-btn tw:whitespace-nowrap"
                    onClick={() => setShowPopup(true)}
                  >
                    Register / Login
                  </button>
                </Link>
              ) : (
                <Link>
                  <button className="nav-btn-box" onClick={handleLogout}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      data-name="Layer 1"
                      viewBox="0 0 32 32"
                    >
                      <path d="M10.0835,17.03467H2.189a1,1,0,1,1,0-2h7.96L7.56934,12.68115A.99991.99991,0,1,1,8.917,11.20361l4.4541,4.06348a.99978.99978,0,0,1-.00048,1.478L8.92432,20.79688a.99995.99995,0,0,1-1.34668-1.47852ZM22.73779,1H9.26221A3.26585,3.26585,0,0,0,6,4.26221V5.85156a1,1,0,0,0,2,0V4.26221A1.26388,1.26388,0,0,1,9.26221,3H22.73779A1.26388,1.26388,0,0,1,24,4.26221V27.73779A1.26388,1.26388,0,0,1,22.73779,29H9.26221A1.26388,1.26388,0,0,1,8,27.73779V26.0791a1,1,0,1,0-2,0v1.65869A3.26585,3.26585,0,0,0,9.26221,31H22.73779A3.26585,3.26585,0,0,0,26,27.73779V4.26221A3.26585,3.26585,0,0,0,22.73779,1ZM11,23.5a1,1,0,0,0,0,2H21a1,1,0,0,0,1-1V7.5a1,1,0,0,0-1-1H11a1,1,0,0,0,0,2h9v15Z" />
                    </svg>

                    <p>{t(`Logsec.btn4`)}</p>
                  </button>
                </Link>
              )}

              {/* <Link to="/Recentactivities">
            <div className="nav-btn-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <g clipPath="url(#clip0_146_13)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.52 0.0756836C5.61646 0.0756836 0.0200195 5.67213 0.0200195 12.5757C0.0200195 19.4793 5.61646 25.0757 12.52 25.0757C19.4236 25.0757 25.02 19.4793 25.02 12.5757C25.02 5.67213 19.4236 0.0756836 12.52 0.0756836ZM12.5101 5.88964C10.4219 5.88964 8.72696 7.58042 8.72696 9.66871C8.72696 11.757 10.4219 13.4478 12.5101 13.4478C14.5984 13.4478 16.2934 11.757 16.2934 9.66871C16.2934 7.58042 14.5984 5.88964 12.5101 5.88964ZM12.52 15.192C10.0249 15.192 7.75809 16.1706 6.10208 17.7606C5.9308 17.925 5.83397 18.1522 5.83397 18.3896C5.83397 18.6271 5.9308 18.8543 6.10208 19.0187C7.75809 20.6087 10.0249 21.5873 12.52 21.5873C15.0151 21.5873 17.282 20.6087 18.9379 19.0187C19.1092 18.8543 19.2061 18.6271 19.2061 18.3896C19.2061 18.1522 19.1092 17.925 18.9379 17.7606C17.282 16.1706 15.0151 15.192 12.52 15.192Z" fill="#272727" />
                  </g>
                  <defs>
                    <clipPath id="clip0_146_13">
                      <rect width="25" height="25" fill="white" transform="translate(0.0200195 0.0756836)" />
                    </clipPath>
                  </defs>
                </svg>
       
            </div>
            </Link> */}
              <button
                className="tw:flex tw:items-center tw:gap-2 tw:text-[#272727]"
                onClick={toggleMenu}
              >
                <HiMenuAlt3 size={25} />
                <span className="text-xl">
                  {menuOpen
                    ? t("upperSection.closeMenu")
                    : t("upperSection.menu")}
                </span>
              </button>

              <div
                className={`menu-dropdown ${
                  menuOpen ? (closing ? "closing" : " menu-open") : ""
                }`}
              >
                <div className="main-page-box-toogle">
                  <div className="toogle-box">
                    <h2>{t(`HeaderMenu.tital1`)}</h2>
                    <ul>
                      <Link to="/">
                        <li>{t(`HeaderMenu.text1`)}</li>
                      </Link>
                      <Link to="/About">
                        <li>{t(`HeaderMenu.text2`)}</li>
                      </Link>
                      <Link to="/Faq">
                        <li>{t(`HeaderMenu.text3`)}</li>
                      </Link>
                      <Link to="/Contact">
                        <li>{t(`HeaderMenu.text4`)}</li>
                      </Link>
                    </ul>
                  </div>

                  <div className="toogle-box">
                    <h2>{t(`HeaderMenu.tital2`)}</h2>
                    <ul>
                      <li
                        onClick={() => {
                          if (window.location.pathname === "/") {
                            onNavigate("sec2");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/?scrollTo=sec2";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text5`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname === "/") {
                            onNavigate("sec3");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/?scrollTo=sec3";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text6`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname === "/") {
                            onNavigate("faq");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/?scrollTo=faq";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text7`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname === "/") {
                            onNavigate("sec4");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/?scrollTo=sec4";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text8`)}
                      </li>
                    </ul>
                  </div>

                  <div className="toogle-box">
                    <h2>{t(`HeaderMenu.tital3`)}</h2>
                    <ul>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Hotels")) {
                            onNavigate("sec5");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/Hotels?scrollTo=sec5";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text5`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Hotels")) {
                            onNavigate("sec6");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/Hotels?scrollTo=sec6";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text6`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Hotels")) {
                            onNavigate("Hfaq"); // Already on hotels
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/Hotels?scrollTo=Hfaq";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text7`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Hotels")) {
                            onNavigate("sec7");
                          } else {
                            // Navigate to hotels page with section info
                            window.location.href = "/Hotels?scrollTo=sec7";
                          }
                        }}
                      >
                        {t(`HeaderMenu.texth8`)}
                      </li>
                    </ul>
                  </div>

                  <div className="toogle-box">
                    <h2>{t(`HeaderMenu.tital4`)}</h2>
                    <ul>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Car")) {
                            onNavigate("sec8");
                          } else {
                            // Navigate to Car page with section info
                            window.location.href = "/Car?scrollTo=sec8";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text5`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Car")) {
                            onNavigate("sec9");
                          } else {
                            // Navigate to Car page with section info
                            window.location.href = "/Car?scrollTo=sec9";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text6`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Car")) {
                            onNavigate("Cfaq");
                          } else {
                            // Navigate to Car page with section info
                            window.location.href = "/Car?scrollTo=Cfaq";
                          }
                        }}
                      >
                        {t(`HeaderMenu.text7`)}
                      </li>
                      <li
                        onClick={() => {
                          if (window.location.pathname.includes("Car")) {
                            onNavigate("sec10");
                          } else {
                            // Navigate to Car page with section info
                            window.location.href = "/Car?scrollTo=sec10";
                          }
                        }}
                      >
                        {t(`HeaderMenu.textc8`)}
                      </li>
                    </ul>
                  </div>

                  <div className="toogle-box">
                    <h2>{t(`HeaderMenu.tital5`)}</h2>
                    <ul>
                      <Link to="/VisaRequirements">
                        <li>{t(`HeaderMenu.text9`)}</li>
                      </Link>
                      <Link to="/Airport">
                        <li>{t(`HeaderMenu.text10`)}</li>
                      </Link>
                      {/* <li>{t(`HeaderMenu.text11`)}</li> */}
                      <Link to="/">
                        <li>{t(`HeaderMenu.text12`)}</li>
                      </Link>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {showPopup && (
          <div className="popup-overlay addd-lost">
            <div className="popup-main-box">
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                ✖
              </button>

              <Login setShowPopup={setShowPopup} />
            </div>
          </div>
        )}
      </header>
      {modal && (
        <div className="modal-overlay">
          <div className="myModal-content">
            <RegionModal setModal={setModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
