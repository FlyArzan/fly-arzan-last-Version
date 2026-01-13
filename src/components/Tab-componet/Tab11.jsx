import { useRef, useState } from "react";
import ClosedFaq from "../../assets/Images/ClosedFaq.png";
import Openedfaq from "../../assets/Images/Openedfaq.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useTranslation } from "react-i18next";

const Tab11 = ({ categories = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showAll1, setShowAll1] = useState(false);
  const [showAll2, setShowAll2] = useState(false);
  const [showAll3, setShowAll3] = useState(false);
  const faqRef1 = useRef(null);
  const faqRef2 = useRef(null);
  const faqRef3 = useRef(null);
  const faqRef4 = useRef(null);

  const toggleFaq = (index) => {
    setOpenFaq((prevIndex) => (prevIndex === index ? null : index));
  };

  const { t } = useTranslation();

  // Check if CMS categories are available and use them
  const hasCmsCategories = categories && categories.length > 0;

  const faqs1 = [
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

  const faqs = [
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

  const faqs2 = [
    {
      question: t("Faqpage2.faq1.question"),
      answer: t("Faqpage2.faq1.answer"),
    },
    {
      question: t("Faqpage2.faq2.question"),
      answer: t("Faqpage2.faq2.answer"),
    },
    {
      question: t("Faqpage2.faq3.question"),
      answer: t("Faqpage2.faq3.answer"),
    },
    {
      question: t("Faqpage2.faq4.question"),
      answer: t("Faqpage2.faq4.answer"),
    },
    {
      question: t("Faqpage2.faq5.question"),
      answer: t("Faqpage2.faq5.answer"),
    },
    {
      question: t("Faqpage2.faq6.question"),
      answer: t("Faqpage2.faq6.answer"),
    },
    {
      question: t("Faqpage2.faq7.question"),
      answer: t("Faqpage2.faq7.answer"),
    },
    {
      question: t("Faqpage2.faq8.question"),
      answer: t("Faqpage2.faq8.answer"),
    },
    {
      question: t("Faqpage2.faq9.question"),
      answer: t("Faqpage2.faq9.answer"),
    },

    {
      question: t("Faqpage2.faq10.question"),
      answer: t("Faqpage2.faq10.answer"),
    },

    {
      question: t("Faqpage2.faq11.question"),
      answer: t("Faqpage2.faq11.answer"),
    },

    {
      question: t("Faqpage2.faq12.question"),
      answer: t("Faqpage2.faq12.answer"),
    },

    {
      question: t("Faqpage2.faq13.question"),
      answer: t("Faqpage2.faq13.answer"),
    },

    {
      question: t("Faqpage2.faq14.question"),
      answer: t("Faqpage2.faq14.answer"),
    },

    {
      question: t("Faqpage2.faq15.question"),
      answer: t("Faqpage2.faq15.answer"),
    },
    // Add more FAQs here
  ];

  const faqs3 = [
    {
      question: t("Faqpage3.faq1.question"),
      answer: t("Faqpage3.faq1.answer"),
    },
    {
      question: t("Faqpage3.faq2.question"),
      answer: t("Faqpage3.faq2.answer"),
    },
    {
      question: t("Faqpage3.faq3.question"),
      answer: t("Faqpage3.faq3.answer"),
    },
    {
      question: t("Faqpage3.faq4.question"),
      answer: t("Faqpage3.faq4.answer"),
    },
    {
      question: t("Faqpage3.faq5.question"),
      answer: t("Faqpage3.faq5.answer"),
    },
    {
      question: t("Faqpage3.faq6.question"),
      answer: t("Faqpage3.faq6.answer"),
    },
    {
      question: t("Faqpage3.faq7.question"),
      answer: t("Faqpage3.faq7.answer"),
    },
    {
      question: t("Faqpage3.faq8.question"),
      answer: t("Faqpage3.faq8.answer"),
    },
    {
      question: t("Faqpage3.faq9.question"),
      answer: t("Faqpage3.faq9.answer"),
    },

    {
      question: t("Faqpage3.faq10.question"),
      answer: t("Faqpage3.faq10.answer"),
    },

    // Add more FAQs here
  ];

  // Use CMS categories if available, otherwise fall back to translation-based tabs
  const tabNames = hasCmsCategories
    ? categories.map((cat) => cat.name)
    : [
        t("Faqpage.tab1"),
        t("Faqpage.tab2"),
        t("Faqpage.tab3"),
        t("Faqpage.tab4"),
      ];

  // Get FAQ items for a category index
  const getFaqsForCategory = (index) => {
    if (hasCmsCategories && categories[index]) {
      return categories[index].items || [];
    }
    // Fallback to translation-based FAQs
    const faqArrays = [faqs, faqs1, faqs2, faqs3];
    return faqArrays[index] || [];
  };

  return (
    <div className="FaqInner-Tab-box">
      <Tabs>
        <div className="FaqInner-Tab-head">
          <TabList>
            {tabNames.map((name, idx) => (
              <Tab key={idx}>{name}</Tab>
            ))}
          </TabList>
        </div>

        <div className="FaqInner-Tab-body">
          {tabNames.map((_, tabIndex) => {
            const currentFaqs = getFaqsForCategory(tabIndex);
            const showAllState = [showAll, showAll1, showAll2, showAll3][tabIndex];
            const setShowAllState = [setShowAll, setShowAll1, setShowAll2, setShowAll3][tabIndex];
            const faqRef = [faqRef1, faqRef2, faqRef3, faqRef4][tabIndex];

            return (
              <TabPanel key={tabIndex}>
                <div className="faqs--description" ref={faqRef}>
                  {currentFaqs.slice(0, showAllState ? currentFaqs.length : 7).map((faq, index) => (
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
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Show More / Show Less Button */}
                  {currentFaqs.length > 7 && (
                    <div className="Sec2-btn-box">
                      <button
                        onClick={() => {
                          setShowAllState(!showAllState);
                          if (showAllState && faqRef.current) {
                            faqRef.current.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        {showAllState ? t("buttons.showLess") : t("buttons.more")}
                      </button>
                    </div>
                  )}
                </div>
              </TabPanel>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
};

export default Tab11;
