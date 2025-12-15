import { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer_logo from "../assets/Images/Footer_logo.png";
import fb_logo from "../assets/Images/fb_logo.png";
import Instagram_Logo from "../assets/Images/Instagram_Logo.png";
import X_logo from "../assets/Images/X_logo.png";
import youtube_logo from "../assets/Images/youtube_logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");

  const handleEmail = () => {
    const trimmedEmail = email.trim();

    // Check if empty
    if (trimmedEmail === "") {
      toast.error("Please enter your email address.");
      return;
    }

    // Check if valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Success
    console.log("Successfully Subscribed");
    toast.success("Thank you for your subscription");
  };

  return (
    <>
      <footer>
        <div className="container">
          <div className="main-footer">
            <div className="footer--main--top">
              <div className="Footer-main-1">
                <div className="footer--logo">
                  <Link to="/">
                    <img src={Footer_logo} alt="Footer_logo" />
                  </Link>
                </div>

                <div className="footer--social--logo">
                  <div className="socail--logos">
                    <a
                      href="https://www.facebook.com/profile.php?id=61571147600625"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={fb_logo} alt="Facebook" />
                    </a>
                  </div>
                  <div className="socail--logos">
                    <a
                      href="https://x.com/flyArzan"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={X_logo} alt="X" />
                    </a>
                  </div>
                  <div className="socail--logos">
                    <a
                      href="https://www.instagram.com/flyarzan/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={Instagram_Logo} alt="Instagram" />
                    </a>
                  </div>
                  <div className="socail--logos">
                    <a
                      href="https://www.linkedin.com/in/fly-arzan-75228135b"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={youtube_logo}
                        alt="LinkedIn (on YouTube icon)"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="Footer-main-2">
                <div className="footer-ul-list-box">
                  <h3>{t("footer.quickLinks.title")}</h3>
                  <ul>
                    <Link to="/About">
                      <li>{t("footer.quickLinks.about")}</li>
                    </Link>
                    <Link to="/Faq">
                      <li>{t("footer.quickLinks.faqs")}</li>
                    </Link>
                    <Link to="/PrivacyPolicy">
                      <li>{t("footer.quickLinks.privacyPolicy")}</li>
                    </Link>
                    <Link to="/TermsAndConditions">
                      <li>
                        {t(
                          "footer.quickLinks.termsAndConditions",
                          "Terms & Conditions"
                        )}
                      </li>
                    </Link>
                    <Link to="/Contact">
                      <li>{t("footer.quickLinks.contact")}</li>
                    </Link>
                  </ul>
                </div>
                <div className="footer-ul-list-box">
                  <h3>{t("footer.travelSupport.title")}</h3>
                  <ul>
                    <Link to="/COVID">
                      <li>{t("footer.travelSupport.covid")}</li>
                    </Link>
                    <Link to="/VisaRequirements">
                      <li>{t("footer.travelSupport.visa")}</li>
                    </Link>
                    <Link to="/Airport">
                      <li>{t("footer.travelSupport.airport")}</li>
                    </Link>
                  </ul>
                </div>
                <div className="footer-ul-list-box more-with-input">
                  <h3>{t("footer.newsletter.title")}</h3>
                  <div className="more-with-input-group">
                    <input
                      onClick={(e) => setEmail(e.target.value)}
                      type="text"
                      placeholder={t("footer.newsletter.placeholder")}
                    />
                    <button onClick={handleEmail}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.37324 2.68332C1.26386 2.24645 1.41949 1.78645 1.77074 1.50457C2.12199 1.2227 2.60511 1.17145 3.00761 1.3727L14.1389 6.93832C14.5295 7.13332 14.7764 7.5327 14.7764 7.96957C14.7764 8.40645 14.5295 8.80582 14.1389 9.00082L3.00761 14.5665C2.60511 14.7677 2.12199 14.7164 1.77074 14.4346C1.41949 14.1527 1.26386 13.6927 1.37324 13.2558L2.53886 8.59457L9.30761 7.96957L2.53886 7.34457L1.37324 2.68332Z"
                          fill="#50ADD8"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* <div className="wheather-box">
                    <img src={wheather} alt="Weather" />
                  </div> */}
                </div>
              </div>
            </div>

            <div className="footer--main--bottom">
              <p>{t("footer.copyright")}</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
