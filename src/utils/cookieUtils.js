// Cookie consent storage key
const CONSENT_STORAGE_KEY = "cookie_consent";
const CONSENT_VERSION = "1.0";

// Cookie categories with descriptions
export const COOKIE_CATEGORIES = {
  necessary: {
    id: "necessary",
    name: "Necessary",
    description:
      "Essential cookies required for the website to function properly. These cannot be disabled.",
    required: true,
    defaultEnabled: true,
  },
  analytics: {
    id: "analytics",
    name: "Analytics",
    description:
      "Help us understand how visitors interact with our website by collecting anonymous information.",
    required: false,
    defaultEnabled: false,
  },
  marketing: {
    id: "marketing",
    name: "Marketing",
    description:
      "Used to track visitors across websites to display relevant advertisements.",
    required: false,
    defaultEnabled: false,
  },
  preferences: {
    id: "preferences",
    name: "Preferences",
    description:
      "Allow the website to remember your preferences like language and region.",
    required: false,
    defaultEnabled: true,
  },
};

/**
 * Get stored cookie consent preferences
 */
export const getCookieConsent = () => {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === CONSENT_VERSION) {
        return parsed;
      }
    }
  } catch {
    // Invalid stored data
  }
  return null;
};

/**
 * Check if a specific cookie category is allowed
 */
export const isCookieAllowed = (category) => {
  const consent = getCookieConsent();
  if (!consent) return false;
  if (category === "necessary") return true;
  return consent.categories?.[category] === true;
};

/**
 * Save cookie consent preferences
 */
export const saveCookieConsent = (categories) => {
  const consent = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories,
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));

  // Dispatch custom event for other components to react
  window.dispatchEvent(
    new CustomEvent("cookieConsentChanged", { detail: consent })
  );
};

/**
 * Check if user has made a consent decision
 */
export const hasConsentDecision = () => {
  return getCookieConsent() !== null;
};

/**
 * Reset cookie consent (for testing or user request)
 */
export const resetCookieConsent = () => {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent("cookieConsentChanged", { detail: null })
  );
};
