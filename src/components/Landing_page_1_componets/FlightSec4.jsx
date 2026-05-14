import React, { useState, useEffect, forwardRef } from "react";
import { useGet } from "../../utils/ApiMethod";
import { BackendUrl } from "../../baseUrl";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegionalSettings } from "../../context/RegionalSettingsContext";

const FlightSec4 = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { regionalSettings } = useRegionalSettings();

  const [activeTab, setActiveTab] = useState("Top Destinations");
  const navigate = useNavigate("");
  const selectLocalLang = JSON.parse(localStorage.getItem("selectLang"));

  // Fetch data when activeTab changes
  const endpoint = regionalSettings?.country?.name
    ? `/api/airports/category-flight/${activeTab}/${regionalSettings.country.name}`
    : null;

  const { data, loading, refetch } = useGet(
    endpoint,
    true, // fetchOnMount
    BackendUrl,
    false, // isFormData
  );

  //  refetch when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, regionalSettings]);

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
  const handleNavigate = (title) => {
    navigate("/flight-search", {
      state: title,
    });
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

          {/* Tab Content */}
          <ul className="tab-content">
            {loading ? (
              <li>Loading...</li>
            ) : data?.data?.length > 0 ? (
              data.data.map((item) => (
                <li onClick={() => handleNavigate(item.title)} key={item._id}>
                  {item?.title_Translation
                    ? item?.title_Translation[selectLocalLang?.code || "en-US"]
                    : item.title}
                </li>
              ))
            ) : (
              <li>No flights found.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default FlightSec4;
