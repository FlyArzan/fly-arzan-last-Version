import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import ClosedFaq from "../../assets/Images/ClosedFaq.png";
import Openedfaq from "../../assets/Images/Openedfaq.png";

const HotelsFaq = forwardRef((props, ref) => {
  const [openFaq, setOpenFaq] = useState(null); // Track which FAQ is open
  const [showAll, setShowAll] = useState(false); // Track if all FAQs should be shown
  const { t } = useTranslation();
  const faqSectionRef = useRef(null);
  useImperativeHandle(ref, () => faqSectionRef.current);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index); // Toggle the selected FAQ
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);

    if (showAll && faqSectionRef.current) {
      faqSectionRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  };

  const faqs = [
    {
      question: t("Faqpage1.faq1.question"),
      answer: t("Faqpage1.faq1.answer"),
    },
    {
      question: t("Faqpage1.faq2.question"),
      answer: t("Faqpage1.faq2.answer"),
    },
    {
      question: t("Faqpage1.faq3.question"),
      answer: t("Faqpage1.faq3.answer"),
    },
    {
      question: t("Faqpage1.faq4.question"),
      answer: t("Faqpage1.faq4.answer"),
    },
    {
      question: t("Faqpage1.faq5.question"),
      answer: t("Faqpage1.faq5.answer"),
    },
    {
      question: t("Faqpage1.faq6.question"),
      answer: t("Faqpage1.faq6.answer"),
    },
    {
      question: t("Faqpage1.faq7.question"),
      answer: t("Faqpage1.faq7.answer"),
    },
    {
      question: t("Faqpage1.faq8.question"),
      answer: t("Faqpage1.faq8.answer"),
    },
    {
      question: t("Faqpage1.faq9.question"),
      answer: t("Faqpage1.faq9.answer"),
    },

    {
      question: t("Faqpage1.faq10.question"),
      answer: t("Faqpage1.faq10.answer"),
    },

    {
      question: t("Faqpage1.faq11.question"),
      answer: t("Faqpage1.faq11.answer"),
    },

    {
      question: t("Faqpage1.faq12.question"),
      answer: t("Faqpage1.faq12.answer"),
    },

    {
      question: t("Faqpage1.faq13.question"),
      answer: t("Faqpage1.faq13.answer"),
    },

    {
      question: t("Faqpage1.faq14.question"),
      answer: t("Faqpage1.faq14.answer"),
    },

    {
      question: t("Faqpage1.faq15.question"),
      answer: t("Faqpage1.faq15.answer"),
    },
    // Add more FAQs here
  ];

  return (
    <section className="faq--flight--sec" ref={faqSectionRef} id="hotel-faq">
      <div className="container">
        <div className="main-hero">
          <div className="faq--heading">
            <h2>{t("hotelFaqs.heading")}</h2>
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

export default HotelsFaq;
