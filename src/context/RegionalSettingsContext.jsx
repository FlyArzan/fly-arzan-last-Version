import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useGeoCurrency } from "../hooks/useGeoCurrency";
import { getExchangeRateFromDollar } from "../utils/exchangeRateUtils";
import PropTypes from "prop-types";

const RegionalSettingsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRegionalSettings = () => {
  const context = useContext(RegionalSettingsContext);
  if (!context) {
    throw new Error(
      "useRegionalSettings must be used within RegionalSettingsProvider"
    );
  }
  return context;
};

const DEFAULT_SETTINGS = {
  language: { label: "English (USA)", code: "en-US" },
  country: {
    name: "United States",
    countryCode: "US",
    flag: "https://flagcdn.com/w320/us.png",
  },
  currency: { curr: "USD", symbol: "$" },
  location: {
    latitude: null,
    longitude: null,
    timezone: "America/New_York",
  },
  exchangeRate: {
    base: "USD",
    rates: { USD: 1 },
  },
  setBy: "fallback",
};

/**
 * Get prefetched regional settings from localStorage (set by rootLoader)
 * This provides instant access without loading state
 */
const getPrefetchedSettings = () => {
  try {
    const stored = localStorage.getItem("regionalSettings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to get prefetched settings:", e);
  }
  return null;
};

export const RegionalSettingsProvider = ({ children }) => {
  // Initialize from prefetched data or localStorage immediately (no loading state)
  const [regionalSettings, setRegionalSettings] = useState(() => {
    const prefetched = getPrefetchedSettings();
    return prefetched || DEFAULT_SETTINGS;
  });

  // Mark as loaded immediately if we have prefetched data
  const [isLoaded, setIsLoaded] = useState(() => {
    const prefetched = getPrefetchedSettings();
    return !!prefetched;
  });

  const { isLoading, data: geoData, refetch } = useGeoCurrency();

  // Map country to language
  const getLanguageForCountry = (countryCode) => {
    const langMap = {
      US: { label: "English (USA)", code: "en-US" },
      CA: { label: "English (USA)", code: "en-US" },
      GB: { label: "English (UK)", code: "en-GB" },
      AU: { label: "English (USA)", code: "en-US" },
      DE: { label: "Deutsch (German)", code: "de" },
      FR: { label: "Français (French)", code: "fr" },
      ES: { label: "Español (Spanish)", code: "es" },
      IT: { label: "Italiano (Italian)", code: "it" },
      NL: { label: "Nederlands (Dutch)", code: "nl" },
      PT: { label: "Português (Portuguese)", code: "pt-PT" },
      RU: { label: "Русский (Russian)", code: "ru" },
      CN: { label: "中文 (Simplified Chinese)", code: "zh-CN" },
      TW: { label: "中文 (Traditional Chinese)", code: "zh-TW" },
      JP: { label: "日本語 (Japanese)", code: "ja-JP" },
      KR: { label: "한국어 (Korean)", code: "ko-KR" },
      ID: { label: "Bahasa Indonesia (Indonesian)", code: "id" },
      TR: { label: "Türkçe (Turkish)", code: "tr" },
      PL: { label: "Polski (Polish)", code: "pl" },
      SE: { label: "Svenska (Swedish)", code: "sv" },
      AR: { label: "Español (Spanish)", code: "es" },
      BR: { label: "Português (Portuguese)", code: "pt-PT" },
      MX: { label: "Español (Spanish)", code: "es" },
      AE: { label: "العربية (Arabic)", code: "ar" },
      SA: { label: "العربية (Arabic)", code: "ar" },
      EG: { label: "العربية (Arabic)", code: "ar" },
      GR: { label: "Ελληνικά (Greek)", code: "el" },
      BD: { label: "English (USA)", code: "en-US" }, // Bangladesh
      IN: { label: "English (USA)", code: "en-US" }, // India
      PK: { label: "English (USA)", code: "en-US" }, // Pakistan
    };
    return langMap[countryCode] || { label: "English (USA)", code: "en-US" };
  };

  // Only fetch if we don't have prefetched data and user hasn't set preferences
  useEffect(() => {
    // Skip if already loaded from prefetch or user settings
    if (isLoaded) return;

    if (geoData) {
      const settings = {
        language: getLanguageForCountry(geoData.countryCode || "US"),
        country: {
          name: geoData.countryName || "United States",
          countryCode: geoData.countryCode || "US",
          flag: geoData.countryFlag || "https://flagcdn.com/w320/us.png",
        },
        currency: {
          curr: geoData.currency?.code || "USD",
          symbol:
            geoData.currency?.symbol_native || geoData.currency?.symbol || "$",
        },
        location: {
          latitude: null,
          longitude: null,
          timezone: geoData.timeZone?.id || "America/New_York",
        },
        exchangeRate: geoData.exchangeRate || {
          base: "USD",
          rates: { USD: 1 },
        },
        setBy: "ip",
        detectedAt: new Date().toISOString(),
      };

      setRegionalSettings(settings);
      localStorage.setItem("regionalSettings", JSON.stringify(settings));
      setIsLoaded(true);
    } else if (!geoData && !isLoading) {
      // Fallback to default if geo fetch fails
      const fallbackSettings = { ...DEFAULT_SETTINGS };
      setRegionalSettings(fallbackSettings);
      localStorage.setItem(
        "regionalSettings",
        JSON.stringify(fallbackSettings)
      );
      setIsLoaded(true);
    }
  }, [geoData, isLoading, isLoaded]);

  const updateRegionalSettings = useCallback(
    (newSettings) => {
      setRegionalSettings(newSettings);
      localStorage.setItem("regionalSettings", JSON.stringify(newSettings));

      // If setBy is user, refetch to get latest exchange rates
      if (newSettings.setBy === "user") {
        refetch();
      }
    },
    [refetch]
  );

  // Get selected currency from regionalSettings
  const selectedCurrency = regionalSettings?.currency?.curr || "USD";
  const selectedCurrencySymbol = regionalSettings?.currency?.symbol || "$";

  // Convert price using exchange rate (from USD to selected currency)
  const convertPrice = useCallback(
    (usdAmount) => {
      const rates = regionalSettings.exchangeRate?.rates || { USD: 1 };
      const convertedAmount = getExchangeRateFromDollar(
        usdAmount,
        selectedCurrency,
        rates
      );
      return parseFloat(convertedAmount).toFixed(2);
    },
    [regionalSettings, selectedCurrency]
  );

  const value = useMemo(
    () => ({
      regionalSettings,
      updateRegionalSettings,
      isLoaded,
      isLocationDetecting: isLoading,
      selectedCurrency,
      selectedCurrencySymbol,
      convertPrice,
      refetch,
    }),
    [
      regionalSettings,
      updateRegionalSettings,
      isLoaded,
      isLoading,
      selectedCurrency,
      selectedCurrencySymbol,
      convertPrice,
      refetch,
    ]
  );

  return (
    <RegionalSettingsContext.Provider value={value}>
      {children}
    </RegionalSettingsContext.Provider>
  );
};

RegionalSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
