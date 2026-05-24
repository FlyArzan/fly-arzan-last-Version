import React, { useState, forwardRef } from "react";
import { useTranslation } from "react-i18next";

const FlightSec4 = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("Top Destinations");

  // Your tab names
  const tabNames = [
    "Top Destinations",
    "Popular Cities",
    "Popular Countries",
    "Cultural Destinations",
    "Top Islands",
  ];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <section ref={ref} className="Sec4-sec" id="flight-begin-Journey">
      <div className="container">
        <div className="Sec4-sec--main">
          <div className="Sec4-sec--title">
            <h2>{t("BeginJourney")}</h2>
          </div>

          {/* Tab Buttons */}
          <div className="Sec4-tabs">
            {tabNames.map((tabName) => (
              <button
                key={tabName}
                className={`tab-button ${
                  activeTab === tabName ? "active" : ""
                }`}
                onClick={() => handleTabClick(tabName)}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Empty tab content area */}
          <div className="tab-content" />
        </div>
      </div>
    </section>
  );
});

export default FlightSec4;
