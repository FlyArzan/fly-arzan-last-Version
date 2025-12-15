/**
 * Clean IP-based location detection using ipapi.co
 */

/**
 * Currency code to symbol mapping
 */
const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  NZD: "NZ$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  TRY: "₺",
  RUB: "₽",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  KRW: "₩",
  SGD: "S$",
  MYR: "RM",
  THB: "฿",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
  AED: "د.إ",
  SAR: "﷼",
  ZAR: "R",
  EGP: "£",
  ILS: "₪",
  BDT: "৳",
  PKR: "₨",
  LKR: "₨",
  NPR: "₨",
  MMK: "Ks",
  KHR: "៛",
  LAK: "₭",
};

/**
 * Country code to language mapping
 */
const COUNTRY_TO_LANGUAGE = {
  US: { label: "English (USA)", code: "en-US" },
  CA: { label: "English (USA)", code: "en-US" },
  GB: { label: "English (UK)", code: "en-GB" },
  AU: { label: "English (USA)", code: "en-US" },
  NZ: { label: "English (USA)", code: "en-US" },
  IE: { label: "English (UK)", code: "en-GB" },
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
  IN: { label: "English (USA)", code: "en-US" },
  BD: { label: "English (USA)", code: "en-US" },
  PH: { label: "English (USA)", code: "en-US" },
  SG: { label: "English (USA)", code: "en-US" },
  MY: { label: "English (USA)", code: "en-US" },
  ID: { label: "Bahasa Indonesia (Indonesian)", code: "id" },
  TH: { label: "English (USA)", code: "en-US" },
  VN: { label: "English (USA)", code: "en-US" },
  TR: { label: "Türkçe (Turkish)", code: "tr" },
  PL: { label: "Polski (Polish)", code: "pl" },
  SE: { label: "Svenska (Swedish)", code: "sv" },
  NO: { label: "English (USA)", code: "en-US" },
  DK: { label: "English (USA)", code: "en-US" },
  AR: { label: "Español (Spanish)", code: "es" },
  BR: { label: "Português (Portuguese)", code: "pt-PT" },
  MX: { label: "Español (Spanish)", code: "es" },
  AE: { label: "العربية (Arabic)", code: "ar" },
  SA: { label: "العربية (Arabic)", code: "ar" },
  EG: { label: "العربية (Arabic)", code: "ar" },
  GR: { label: "Ελληνικά (Greek)", code: "el" },
  PK: { label: "English (USA)", code: "en-US" },
  LK: { label: "English (USA)", code: "en-US" },
  NP: { label: "English (USA)", code: "en-US" },
  MM: { label: "English (USA)", code: "en-US" },
  KH: { label: "English (USA)", code: "en-US" },
  LA: { label: "English (USA)", code: "en-US" },
};

/**
 * Get user's location data from IP using ip-api.com (free, no CORS issues)
 */
export async function getUserLocationFromIP() {
  try {
    const response = await fetch(
      "http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,currency"
    );

    if (!response.ok) {
      // console.error(`HTTP error! status: ${response.status}`);
      return null; // Return null instead of throwing
    }

    const locationData = await response.json();

    // Validate response
    if (locationData.status === "fail") {
      // console.error(locationData.message || "IP API error");
      return null; // Return null instead of throwing
    }

    return locationData;
  } catch (error) {
    // console.error("Failed to get user location from IP:", error);
    return null; // Return null instead of throwing
  }
}

/**
 * Map ip-api.com response to regionalSettings format
 */
export function mapLocationToRegionalSettings(locationData) {
  const countryCode = locationData.countryCode || "US";

  // Get currency symbol from mapping, fallback to currency code
  const currencySymbol =
    CURRENCY_SYMBOLS[locationData.currency] || locationData.currency || "$";

  // Get language from mapping, fallback to English (USA)
  const language = COUNTRY_TO_LANGUAGE[countryCode] || {
    label: "English (USA)",
    code: "en-US",
  };

  // Build regional settings
  const regionalSettings = {
    language,
    country: {
      name: locationData.country || "United States",
      countryCode: countryCode,
      flag: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`,
    },
    currency: {
      curr: locationData.currency || "USD",
      symbol: currencySymbol,
    },
    location: {
      latitude: locationData.lat || null,
      longitude: locationData.lon || null,
      timezone: locationData.timezone || "America/New_York",
    },
    setBy: "ip",
    detectedAt: new Date().toISOString(),
  };
  return regionalSettings;
}

/**
 * Get fallback regional settings (US defaults)
 */
export function getFallbackRegionalSettings() {
  return {
    language: { label: "English (USA)", code: "en-US" },
    country: {
      name: "United States",
      countryCode: "US",
      flag: "https://flagcdn.com/w320/us.png",
    },
    currency: {
      curr: "USD",
      symbol: "$",
    },
    location: {
      latitude: null,
      longitude: null,
      timezone: "America/New_York",
    },
    setBy: "fallback",
    detectedAt: new Date().toISOString(),
  };
}

/**
 * Detect and build regional settings from IP
 */
export async function detectAndBuildRegionalSettings() {
  try {
    // Get location data from IP
    const locationData = await getUserLocationFromIP();

    // Map to regional settings format
    const regionalSettings = mapLocationToRegionalSettings(locationData);

    // Save to localStorage
    localStorage.setItem("regionalSettings", JSON.stringify(regionalSettings));

    return regionalSettings;
  } catch {
    // Return and save fallback settings
    const fallbackSettings = getFallbackRegionalSettings();
    localStorage.setItem("regionalSettings", JSON.stringify(fallbackSettings));

    return fallbackSettings;
  }
}

/**
 * Initialize regional settings with smart setBy logic and timestamp-based caching
 * Cache duration: 1 hour for IP-detected settings
 */
const REGIONAL_SETTINGS_CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function initializeRegionalSettings() {
  try {
    // Check if we already have regional settings
    const existingSettings = localStorage.getItem("regionalSettings");

    if (existingSettings) {
      const parsed = JSON.parse(existingSettings);

      // If user manually set preferences, always respect that
      if (parsed.setBy === "user") {
        return parsed;
      }

      // For IP-detected settings, check if cache is still valid
      if (parsed.setBy === "ip" && parsed.detectedAt) {
        const cacheAge = Date.now() - new Date(parsed.detectedAt).getTime();
        if (cacheAge < REGIONAL_SETTINGS_CACHE_DURATION) {
          // Cache is still valid, return immediately without API call
          return parsed;
        }
      }

      // Cache expired or no timestamp, re-fetch
      return await detectAndBuildRegionalSettings();
    } else {
      return await detectAndBuildRegionalSettings();
    }
  } catch {
    return getFallbackRegionalSettings();
  }
}

/**
 * Get the nearest airport based on user's IP location
 * Uses the backend API which calculates distance using Haversine formula
 */
export async function getNearestAirport() {
  try {
    // First get user's location from IP
    const locationData = await getUserLocationFromIP();

    if (!locationData || !locationData.lat || !locationData.lon) {
      console.warn("Could not get user location for nearest airport");
      return null;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(
      `${API_BASE_URL}/api/airports/nearest?lat=${locationData.lat}&lon=${locationData.lon}`
    );

    if (!response.ok) {
      console.warn("Failed to fetch nearest airport");
      return null;
    }

    const data = await response.json();
    return data.airport;
  } catch (error) {
    console.error("Error getting nearest airport:", error);
    return null;
  }
}

/**
 * Get prefetched nearest airport from localStorage (set by rootLoader)
 * This provides instant access without any API call
 */
export function getPrefetchedNearestAirport() {
  try {
    const cached = localStorage.getItem("prefetchedGeoData");
    if (cached) {
      const { data } = JSON.parse(cached);
      if (data?.nearestAirport) {
        return data.nearestAirport;
      }
    }
  } catch (e) {
    console.warn("Failed to get prefetched airport:", e);
  }
  return null;
}

/**
 * Get nearest airport with caching (stores in sessionStorage)
 * First checks for prefetched data from rootLoader for instant access
 */
export async function getNearestAirportCached() {
  try {
    // First check for prefetched data (instant, no API call)
    const prefetched = getPrefetchedNearestAirport();
    if (prefetched) {
      return prefetched;
    }

    // Check session cache
    const cached = sessionStorage.getItem("nearestAirport");
    if (cached) {
      const parsed = JSON.parse(cached);
      // Cache for 1 hour
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.airport;
      }
    }

    // Fetch fresh data as fallback
    const airport = await getNearestAirport();

    if (airport) {
      sessionStorage.setItem(
        "nearestAirport",
        JSON.stringify({
          airport,
          timestamp: Date.now(),
        })
      );
    }

    return airport;
  } catch {
    return null;
  }
}
