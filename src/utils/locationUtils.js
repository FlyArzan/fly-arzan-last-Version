/**
 * IP-based location detection via backend (BigDataCloud)
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

export function getLanguageForCountry(countryCode) {
  return (
    COUNTRY_TO_LANGUAGE[countryCode] || {
      label: "English (USA)",
      code: "en-US",
    }
  );
}

// ─── Geo-currency cache (deduplicates concurrent calls) ─────────────────────
// Both getUserLocationFromIP and getNearestAirport need the same endpoint.
// This ensures at most one in-flight request at a time and caches for 5 min.

const GEO_CACHE_TTL = 5 * 60 * 1000;
let _geoCache = null;
let _geoPromise = null;

async function fetchGeoCurrency() {
  if (_geoCache && Date.now() - _geoCache.timestamp < GEO_CACHE_TTL) {
    return _geoCache.data;
  }
  if (_geoPromise) return _geoPromise;

  _geoPromise = fetch(`${import.meta.env.VITE_API_URL}/api/geo-currency`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((data) => {
      _geoPromise = null;
      if (data) _geoCache = { data, timestamp: Date.now() };
      return data;
    });

  return _geoPromise;
}

/**
 * Get user's location data from backend API (uses BigDataCloud for geolocation)
 */
export async function getUserLocationFromIP() {
  try {
    const geoData = await fetchGeoCurrency();
    if (!geoData) return null;
    return {
      status: "success",
      country: geoData.countryName,
      countryCode: geoData.countryCode,
      city: geoData.city,
      lat: geoData.latitude,
      lon: geoData.longitude,
      timezone: geoData.timeZone?.id,
      currency: geoData.currency?.code,
    };
  } catch {
    return null;
  }
}

/**
 * Map location data to regionalSettings format
 */
export function mapLocationToRegionalSettings(locationData) {
  const countryCode = locationData.countryCode || "US";
  const currencySymbol =
    CURRENCY_SYMBOLS[locationData.currency] || locationData.currency || "$";

  return {
    language: getLanguageForCountry(countryCode),
    country: {
      name: locationData.country || "United States",
      countryCode,
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
    currency: { curr: "USD", symbol: "$" },
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
    const locationData = await getUserLocationFromIP();
    const regionalSettings = mapLocationToRegionalSettings(locationData);
    localStorage.setItem("regionalSettings", JSON.stringify(regionalSettings));
    return regionalSettings;
  } catch {
    const fallbackSettings = getFallbackRegionalSettings();
    localStorage.setItem("regionalSettings", JSON.stringify(fallbackSettings));
    return fallbackSettings;
  }
}

const REGIONAL_SETTINGS_CACHE_DURATION = 3600000;

/**
 * Initialize regional settings with smart setBy logic and timestamp-based caching
 */
export async function initializeRegionalSettings() {
  try {
    const existingSettings = localStorage.getItem("regionalSettings");
    if (existingSettings) {
      const parsed = JSON.parse(existingSettings);
      if (parsed.setBy === "user") return parsed;
      if (parsed.setBy === "ip" && parsed.detectedAt) {
        const cacheAge = Date.now() - new Date(parsed.detectedAt).getTime();
        if (cacheAge < REGIONAL_SETTINGS_CACHE_DURATION) return parsed;
      }
    }
    return await detectAndBuildRegionalSettings();
  } catch {
    return getFallbackRegionalSettings();
  }
}

/**
 * Get the nearest airport from the geo-currency response.
 * Reuses the shared geo-currency cache — no extra network request.
 */
export async function getNearestAirport() {
  try {
    const geoData = await fetchGeoCurrency();
    return geoData?.nearestAirport ?? null;
  } catch {
    return null;
  }
}

/**
 * Get nearest airport, checking localStorage cache first.
 */
export function getPrefetchedNearestAirport() {
  try {
    const regional = localStorage.getItem("regionalSettings");
    if (regional) {
      const settings = JSON.parse(regional);
      if (settings?.nearestAirport) return settings.nearestAirport;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Get nearest airport with sessionStorage caching.
 * Uses localStorage on subsequent page loads (populated by RegionalSettingsContext).
 */
export async function getNearestAirportCached() {
  const prefetched = getPrefetchedNearestAirport();
  if (prefetched) return prefetched;

  const cached = sessionStorage.getItem("nearestAirport");
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < 3600000) return parsed.airport;
  }

  const airport = await getNearestAirport();
  if (airport) {
    sessionStorage.setItem(
      "nearestAirport",
      JSON.stringify({ airport, timestamp: Date.now() }),
    );
  }
  return airport;
}

/**
 * Currency code to symbol mapping
 */
