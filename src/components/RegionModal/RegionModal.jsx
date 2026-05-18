import { useEffect, useState, useMemo } from "react";
import { HiLanguage } from "react-icons/hi2";
import { BiWorld } from "react-icons/bi";
import { HiCurrencyDollar } from "react-icons/hi2";
import { useGet } from "../../utils/ApiMethod";
import { useTranslation } from "react-i18next";
import getSymbolFromCurrency from "currency-symbol-map";
import { useRegionalSettings } from "../../context/RegionalSettingsContext";
import { useCurrencies } from "../../hooks/useCurrencies";
import PropTypes from "prop-types";

function RegionModal({ setModal }) {
  const { regionalSettings, updateRegionalSettings, isLoaded } =
    useRegionalSettings();
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const { i18n } = useTranslation();
  const [countriesData, setCountriesData] = useState([]);
  const [selectCurr, setSelectCurr] = useState({
    curr: "",
    symbol: "",
  });
  const [selectCountry, setSelectCountry] = useState({
    country: "",
    countryCode: "",
    flag: "",
  });
  const [selectLang, setSelectLang] = useState({
    label: "",
    code: "",
  });

  // Local dropdown open states so we don't rely on external bootstrap JS
  const [openLang, setOpenLang] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [openCurr, setOpenCurr] = useState(false);

  // Initialize state from context when loaded
  useEffect(() => {
    if (isLoaded && regionalSettings) {
      setSelectCurr({
        curr: regionalSettings?.currency?.curr || "USD",
        symbol: regionalSettings?.currency?.symbol || "$",
      });
      setSelectCountry({
        country: regionalSettings?.country?.name || "United States",
        countryCode: regionalSettings?.country?.countryCode || "US",
        flag:
          regionalSettings?.country?.flag || "https://flagcdn.com/w320/us.png",
      });
      setSelectLang({
        label: regionalSettings?.language?.label || "English (USA)",
        code: regionalSettings?.language?.code || "en-US",
      });
    }
  }, [isLoaded, regionalSettings]);

  const allLanguages = [
    { label: "English (UK)", code: "en-GB" },
    { label: "English (USA)", code: "en-US" },
    { label: "Español (Spanish)", code: "es" },
    { label: "中文 (Simplified Chinese)", code: "zh-CN" },
    { label: "中文 (Traditional Chinese)", code: "zh-TW" },
    { label: "Français (French)", code: "fr" },
    { label: "Deutsch (German)", code: "de" },
    { label: "Русский (Russian)", code: "ru" },
    { label: "Português (Portuguese)", code: "pt-PT" },
    { label: "Italiano (Italian)", code: "it" },
    { label: "العربية (Arabic)", code: "ar" },
    { label: "Türkçe (Turkish)", code: "tr" },
    { label: "Nederlands (Dutch)", code: "nl" },
    { label: "한국어 (Korean)", code: "ko-KR" },
    { label: "日本語 (Japanese)", code: "ja-JP" },
    // { label: "हिन्दी (Hindi)", code: "hi" },
    // { label: "اردو (Urdu)", code: "ur" },
    // { label: "فارسی (Persian / Farsi)", code: "fa" },
    { label: "Bahasa Indonesia (Indonesian)", code: "id" },
    // { label: "ไทย (Thai)", code: "th" },
    // { label: "Tiếng Việt (Vietnamese)", code: "vi" },
    { label: "Polski (Polish)", code: "pl" },
    { label: "Ελληνικά (Greek)", code: "el" },
    { label: "Svenska (Swedish)", code: "sv" },
    // { label: "Bahasa Melayu (Malay)", code: "ms" },
  ];

  const { data: countries } = useGet(
    "https://restcountries.com/v3.1/all?fields=name,flags,cca2",
    true,
    "",
    false,
  );
  const memoizedCountries = useMemo(() => {
    if (Array.isArray(countries) && countries.length > 0) {
      return [...countries].sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
      );
    }
    return [];
  }, [countries]);

  useEffect(() => {
    setCountriesData(memoizedCountries);
  }, [memoizedCountries]);

  const handleCountrySelect = (name, countryCode, flag) => {
    setSelectCountry({
      country: name,
      countryCode,
      flag,
    });
    setOpenCountry(false);
  };

  const handleLanguageChange = (lng) => {
    setSelectLang({ label: lng?.label, code: lng?.code });
    setOpenLang(false);
  };

  const handleCurr = (curr, symbol) => {
    setSelectCurr({ curr, symbol });
    setOpenCurr(false);
  };

  const handleSubmit = () => {
    const newRegionalSettings = {
      language: {
        label: selectLang?.label || regionalSettings?.language?.label,
        code: selectLang?.code || regionalSettings?.language?.code,
      },
      country: {
        name: selectCountry?.country || regionalSettings?.country?.name,
        countryCode:
          selectCountry?.countryCode || regionalSettings?.country?.countryCode,
        flag: selectCountry?.flag || regionalSettings?.country?.flag,
      },
      currency: {
        curr: selectCurr?.curr || regionalSettings?.currency?.curr,
        symbol: selectCurr?.symbol || regionalSettings?.currency?.symbol,
      },
      location: regionalSettings?.location || {
        latitude: null,
        longitude: null,
        timezone: "America/New_York",
      },
      exchangeRate: regionalSettings?.exchangeRate || {
        base: "USD",
        rates: { USD: 1 },
      },
      setBy: "user",
    };

    // Update regional settings (this will trigger refetch if currency changed)
    updateRegionalSettings(newRegionalSettings);

    // Change language
    if (selectLang?.code) {
      i18n.changeLanguage(selectLang?.code);
    }

    setModal(false);
  };

  return (
    <div>
      <div className="region-heading">
        <p>Regional settings</p>
        <button className="" onClick={() => setModal(false)}>
          ✖
        </button>
      </div>
      <div className="language-dropdow">
        <div className="language-icon">
          <HiLanguage size={25} /> <p>Language</p>
        </div>
        <div className="dropdown" style={{ position: "relative" }}>
          <button
            className="btn btn-secondary dropdown-toggle language-button"
            type="button"
            aria-haspopup="true"
            aria-expanded={openLang}
            onClick={() => setOpenLang((v) => !v)}
          >
            {selectLang?.label ||
              regionalSettings?.language?.label ||
              "Select Language"}
          </button>

          {openLang && (
            <div
              className="dropdown-menu show drop-down-height"
              role="menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 9999,
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              {allLanguages?.length > 0 ? (
                allLanguages.map((lang) => (
                  <button
                    key={lang?.code}
                    className="dropdown-item"
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang?.label}
                  </button>
                ))
              ) : (
                <p className="dropdown-item">Loading...</p>
              )}
            </div>
          )}
        </div>
        {/* <Translate /> */}
      </div>
      <div className="country-region">
        <div className="language-icon">
          <BiWorld size={25} />
          <p>Country / Region</p>
        </div>

        <p>
          Selecting the country you’re in will give you local deals and
          information.
        </p>

        <div
          className="dropdown"
          style={{ position: "relative", marginTop: "8px" }}
        >
          <button
            className="btn btn-secondary dropdown-toggle language-button"
            type="button"
            aria-haspopup="true"
            aria-expanded={openCountry}
            onClick={() => setOpenCountry((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {(selectCountry?.flag || regionalSettings?.country?.flag) && (
                <img
                  src={selectCountry?.flag || regionalSettings?.country?.flag}
                  alt={
                    selectCountry?.country || regionalSettings?.country?.name
                  }
                  style={{ width: "20px", height: "15px", objectFit: "cover" }}
                />
              )}
              <span>{selectCountry?.country || "Select Country"}</span>
            </div>
          </button>

          {openCountry && (
            <div
              className="dropdown-menu show drop-down-height"
              role="menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 9999,
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              {countriesData?.length > 0 ? (
                countriesData.map((country, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      justifyContent: "flex-start",
                      textAlign: "left",
                    }}
                    onClick={() => {
                      handleCountrySelect(
                        country.name.common,
                        country.cca2,
                        country.flags.png,
                      );
                    }}
                  >
                    <img
                      src={country.flags.png}
                      alt={country.name.common}
                      style={{
                        width: "20px",
                        height: "15px",
                        objectFit: "cover",
                      }}
                    />
                    {country.name.common}
                  </button>
                ))
              ) : (
                <p className="dropdown-item">Loading...</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="currency-region" style={{ overflow: "visible" }}>
        <div className="language-icon">
          <HiCurrencyDollar size={25} />
          <p>Currency</p>
        </div>
        <div className="dropdown" style={{ position: "relative" }}>
          <button
            className="btn btn-secondary dropdown-toggle language-button"
            type="button"
            aria-haspopup="true"
            aria-expanded={openCurr}
            onClick={() => setOpenCurr((v) => !v)}
          >
            {(() => {
              const code =
                selectCurr?.curr || regionalSettings?.currency?.curr || "";
              const name =
                code && currencies && currencies[code] ? currencies[code] : "";
              const sym =
                selectCurr?.symbol ||
                regionalSettings?.currency?.symbol ||
                getSymbolFromCurrency(code) ||
                "";
              if (!code && !sym) return "Select currency";
              return `${code}${name ? ` - ${name}` : sym ? " -" : ""}${
                sym ? ` (${sym})` : ""
              }`;
            })()}
          </button>

          {openCurr && (
            <div
              className="dropdown-menu show drop-down-height"
              role="menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 9999,
                maxHeight: "280px",
                overflowY: "auto",
              }}
            >
              {isCurrenciesLoading ? (
                <p className="dropdown-item">Loading currencies...</p>
              ) : Object.keys(currencies)?.length > 0 ? (
                Object.keys(currencies)
                  .sort((a, b) => a.localeCompare(b))
                  .map((currCode, index) => {
                    const name = currencies[currCode] || currCode;
                    const sym = getSymbolFromCurrency(currCode) || "";
                    return (
                      <button
                        onClick={() => handleCurr(currCode, sym)}
                        key={index}
                        className="dropdown-item"
                      >
                        {`${currCode} - ${name}${sym ? ` (${sym})` : ""}`}
                      </button>
                    );
                  })
              ) : (
                <p className="dropdown-item">No currencies available</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="region-btns">
        <button onClick={handleSubmit} className="save-btn">
          Save
        </button>
        <button onClick={() => setModal(false)} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default RegionModal;

RegionModal.propTypes = {
  setModal: PropTypes.func.isRequired,
};
