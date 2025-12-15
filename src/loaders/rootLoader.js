/**
 * Root loader for prefetching geolocation data before the app renders
 * This eliminates the "loading..." state for language selector and departure input
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

// Cache key for localStorage
const GEO_CACHE_KEY = "prefetchedGeoData";
const GEO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get cached geo data if still valid
 */
function getCachedGeoData() {
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < GEO_CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    console.warn("Failed to read geo cache:", e);
  }
  return null;
}

/**
 * Cache geo data including background image info
 */
function cacheGeoData(data, backgroundImage, timePeriod, hour) {
  try {
    const cacheData = {
      ...data,
      backgroundImage,
      timePeriod,
      hour,
    };
    localStorage.setItem(
      GEO_CACHE_KEY,
      JSON.stringify({ data: cacheData, timestamp: Date.now() })
    );
  } catch (e) {
    console.warn("Failed to cache geo data:", e);
  }
}

/**
 * Fetch geo data from backend (silently fails if backend not running)
 */
async function fetchGeoData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/geo-currency`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    // Silently fail if backend is not running - will use fallback data
    return null;
  }
}

/**
 * Get nearest airport based on country code
 */
async function fetchNearestAirport(countryCode) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/airports/nearest?countryCode=${countryCode}`
    );
    if (response.ok) {
      return response.json();
    }
  } catch (e) {
    console.warn("Failed to fetch nearest airport:", e);
  }
  return null;
}

/**
 * Map country code to language
 */
function getLanguageForCountry(countryCode) {
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
}

/**
 * Get time period based on hour (for background image selection)
 */
function getTimePeriod(hour) {
  if (hour >= 6 && hour <= 17) {
    return "day";
  } else if (hour >= 18 && hour <= 20) {
    return "evening";
  } else {
    return "night";
  }
}

/**
 * Get background image for time period
 */
function getBackgroundImage(timePeriod) {
  const TIME_PERIODS = {
    day: [
      "/Pics/Airline wing/Air line wings 1.jpg",
      "/Pics/Airline wing/Air line wings 2.jpg",
      "/Pics/Airline wing/Air line wings 3.jpg",
      "/Pics/Airline wing/Air line wings 4.jpg",
    ],
    evening: [
      "/Pics/Airline wing/Air line wings 5.jpg",
      "/Pics/Airline wing/Air line wings 6.jpg",
      "/Pics/Airline wing/Air line wings 7.jpg",
    ],
    night: [
      "/Pics/Airline wing/Air line wings 8.jpg",
      "/Pics/Airline wing/Air line wings 9.jpg",
      "/Pics/Airline wing/Air line wings 10.jpg",
      "/Pics/Airline wing/Air line wings 11.jpg",
    ],
  };

  const images = TIME_PERIODS[timePeriod];
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % images.length;
  return images[index];
}

/**
 * Default fallback data
 */
const DEFAULT_GEO_DATA = {
  countryCode: "US",
  countryName: "United States",
  currency: { code: "USD", symbol: "$", symbol_native: "$" },
  timeZone: { id: "America/New_York" },
  exchangeRate: { base: "USD", rates: { USD: 1 } },
};

/**
 * Root loader - prefetches all geo data before app renders
 * This is called by React Router before the route component mounts
 */
export async function rootLoader() {
  // Check for user-set preferences first
  const storedSettings = localStorage.getItem("regionalSettings");
  if (storedSettings) {
    const parsed = JSON.parse(storedSettings);
    if (parsed.setBy === "user") {
      // User has manually set preferences, respect them
      const hour = new Date().getHours();
      const timePeriod = getTimePeriod(hour);
      return {
        geoData: null,
        regionalSettings: parsed,
        nearestAirport: null, // Will use cached airport
        timePeriod,
        backgroundImage: getBackgroundImage(timePeriod),
        hour,
        isUserSet: true,
      };
    }
  }

  // Check cache first for faster loading
  const cachedGeo = getCachedGeoData();

  // Get current time info
  const hour = new Date().getHours();
  const timePeriod = getTimePeriod(hour);
  const backgroundImage = getBackgroundImage(timePeriod);

  try {
    // If we have valid cache, use it immediately
    if (cachedGeo) {
      const language = getLanguageForCountry(cachedGeo.countryCode || "US");

      return {
        geoData: cachedGeo,
        regionalSettings: {
          language,
          country: {
            name: cachedGeo.countryName || "United States",
            countryCode: cachedGeo.countryCode || "US",
            flag: cachedGeo.countryFlag || "https://flagcdn.com/w320/us.png",
          },
          currency: {
            curr: cachedGeo.currency?.code || "USD",
            symbol:
              cachedGeo.currency?.symbol_native ||
              cachedGeo.currency?.symbol ||
              "$",
          },
          location: {
            latitude: null,
            longitude: null,
            timezone: cachedGeo.timeZone?.id || "America/New_York",
          },
          exchangeRate: cachedGeo.exchangeRate || {
            base: "USD",
            rates: { USD: 1 },
          },
          setBy: "ip",
          detectedAt: new Date().toISOString(),
        },
        nearestAirport: cachedGeo.nearestAirport || null,
        timePeriod,
        backgroundImage,
        hour,
        isUserSet: false,
      };
    }

    // Fetch fresh geo data (returns null if backend not running)
    const geoData = await fetchGeoData();

    // If no geo data, return fallback immediately (no error logging)
    if (!geoData) {
      const language = getLanguageForCountry("US");
      return {
        geoData: DEFAULT_GEO_DATA,
        regionalSettings: {
          language,
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
          exchangeRate: { base: "USD", rates: { USD: 1 } },
          setBy: "fallback",
          detectedAt: new Date().toISOString(),
        },
        nearestAirport: null,
        timePeriod,
        backgroundImage,
        hour,
        isUserSet: false,
      };
    }

    // Fetch nearest airport in parallel
    const nearestAirport = await fetchNearestAirport(geoData.countryCode);

    // Cache the combined data with background info
    const combinedData = { ...geoData, nearestAirport };
    cacheGeoData(combinedData, backgroundImage, timePeriod, hour);

    const language = getLanguageForCountry(geoData.countryCode || "US");

    return {
      geoData: combinedData,
      regionalSettings: {
        language,
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
      },
      nearestAirport,
      timePeriod,
      backgroundImage,
      hour,
      isUserSet: false,
    };
  } catch {
    // Silent fallback - no error logging needed

    // Return fallback data so app still works
    const language = getLanguageForCountry("US");

    return {
      geoData: DEFAULT_GEO_DATA,
      regionalSettings: {
        language,
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
        exchangeRate: { base: "USD", rates: { USD: 1 } },
        setBy: "fallback",
        detectedAt: new Date().toISOString(),
      },
      nearestAirport: null,
      timePeriod,
      backgroundImage,
      hour,
      isUserSet: false,
    };
  }
}

export default rootLoader;
