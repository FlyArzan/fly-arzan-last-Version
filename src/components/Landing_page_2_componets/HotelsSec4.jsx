import React, { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGet } from "../../utils/ApiMethod";
import { BackendUrl } from "../../baseUrl";
import { useRegionalSettings } from "../../context/RegionalSettingsContext";

const HotelsSec4 = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Top Cities");
  const { regionalSettings } = useRegionalSettings();
  const selectLocalLang = JSON.parse(localStorage.getItem("selectLang"));

  // Fetch data when activeTab changes
  const endpoint = regionalSettings?.country?.name
    ? `/category-hotel/${activeTab}/${regionalSettings.country.name}`
    : null;

  const { data, loading, refetch } = useGet(
    endpoint,
    true, // fetchOnMount
    BackendUrl,
    false, // isFormData
  );
  // Tab data
  const tabs = {
    "Top Cities": [
      "Book hotel deals in New Delhi",
      "Book hotels deals in Edinburgh",
      "Hotels deals in Athens",
      "Cheap hotels in Tenerife",
      "Hotels in Manchester",
      "Cheap hotels in Amsterdam",
      "Cheap hotels deals in Istanbul",
      "Book hotels deals in Paris",
      "Cheap hotels in Bangkok",
    ],
    "Top Rated Hotels": [
      "Book hotel deals in New Delhi",
      "Book hotels deals in Edinburgh",
      "Hotels deals in Athens",
      "Cheap hotels in Tenerife",
      "Hotels in Manchester",
      "Cheap hotels in Amsterdam",
    ],
    "Popular Hotels": [
      "Book hotel deals in New Delhi",
      "Book hotels deals in Edinburgh",
      "Hotels deals in Athens",
    ],
    "Best Deals": [
      "Book hotel deals in New Delhi",
      "Book hotels deals in Edinburgh",
      "Hotels deals in Athens",
      "Book hotel deals in New Delhi",
      "Book hotels deals in Edinburgh",
      "Hotels deals in Athens",
    ],
  };

  const tabNames = [
    "Top Cities",
    "Top Rated Hotels",
    "Popular Hotels",
    "Cultural Destinations",
    "Best Deals",
  ];

  // Update active tab
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    refetch();
  }, [activeTab, regionalSettings]);

  const handleNavigate = (title) => {};
  return (
    <section ref={ref} className="Sec4-sec" id="extended-hotel">
      <div className="container">
        <div className="Sec4-sec--main">
          <div className="Sec4-sec--title">
            <h2>{t("hotel_section.Extended_hotel_options")}</h2>
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
              <li>No Data found.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default HotelsSec4;
