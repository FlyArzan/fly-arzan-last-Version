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
import { getLanguageForCountry } from "../utils/locationUtils";
import PropTypes from "prop-types";

const RegionalSettingsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRegionalSettings = () => {
  const context = useContext(RegionalSettingsContext);
  if (!context) {
    throw new Error(
      "useRegionalSettings must be used within RegionalSettingsProvider",
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
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
};

export const RegionalSettingsProvider = ({ children }) => {
  // Initialize from prefetched data or localStorage immediately (no loading state)
  const [regionalSettings, setRegionalSettings] = useState(() => {
    const prefetched = getPrefetchedSettings();
    return prefetched || DEFAULT_SETTINGS;
  });

  // Only treat as "loaded" (skip geo auto-detection) if the user explicitly chose preferences.
  // Auto-detected ("ip") or fallback settings must be refreshed from fresh geo data on every load.
  const [isLoaded, setIsLoaded] = useState(() => {
    const prefetched = getPrefetchedSettings();
    return prefetched?.setBy === "user";
  });

  const { isLoading, data: geoData, refetch } = useGeoCurrency();

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
        nearestAirport: geoData.nearestAirport || null,
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
        JSON.stringify(fallbackSettings),
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
    [refetch],
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
        rates,
      );
      return parseFloat(convertedAmount).toFixed(2);
    },
    [regionalSettings, selectedCurrency],
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
    ],
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
