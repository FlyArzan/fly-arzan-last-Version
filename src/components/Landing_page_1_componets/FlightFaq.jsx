import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import { useLandingFaq } from "@/hooks/useLandingFaq";
import ClosedFaq from "../../assets/Images/ClosedFaq.png";
import Openedfaq from "../../assets/Images/Openedfaq.png";

const FlightFaq = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const faqSectionRef = useRef(null);
  useImperativeHandle(ref, () => faqSectionRef.current);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  // i18n copy — used for non-English visitors and when no CMS
  // category is bound to this surface.
  const translatedFaqs = [
    {
      question: t("Faqpage.faq1.question"),
      answer: t("Faqpage.faq1.answer"),
    },
    {
      question: t("Faqpage.faq2.question"),
      answer: t("Faqpage.faq2.answer"),
    },
    {
      question: t("Faqpage.faq3.question"),
      answer: t("Faqpage.faq3.answer"),
    },
    {
      question: t("Faqpage.faq4.question"),
      answer: t("Faqpage.faq4.answer"),
    },
    {
      question: t("Faqpage.faq5.question"),
      answer: t("Faqpage.faq5.answer"),
    },
    {
      question: t("Faqpage.faq6.question"),
      answer: t("Faqpage.faq6.answer"),
    },
    {
      question: t("Faqpage.faq7.question"),
      answer: t("Faqpage.faq7.answer"),
    },
    {
      question: t("Faqpage.faq8.question"),
      answer: t("Faqpage.faq8.answer"),
    },
    {
      question: t("Faqpage.faq9.question"),
      answer: t("Faqpage.faq9.answer"),
    },
    // Add more FAQs here
  ];
  const toggleShowAll = () => {
    setShowAll(!showAll);

    if (showAll && faqSectionRef.current) {
      faqSectionRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  };

  // CMS-first: admin edits to the "flights" FAQ category show up here.
  const { faqs } = useLandingFaq("flights", translatedFaqs);

  return (
    <section className="faq--flight--sec" id="flight-faq" ref={faqSectionRef}>
      <div className="container">
        <div className="main-hero">
          <div className="faq--heading">
            <h2>{t("flightFaqSection.heading")}</h2>
          </div>

          <div className="faqs--description">
            {faqs.slice(0, showAll ? faqs.length : 7).map((faq, index) => (
              <div key={index} className="faq--1">
                <div
                  className="faq--item--heading"
                  onClick={() => toggleFaq(index)}
                >
                  <h3>{faq.question}</h3>
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
                    <p>{faq.answer}</p>
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
    </section>
  );
});

export default FlightFaq;
