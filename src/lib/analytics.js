const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- Session & UTM helpers ---
const SID_COOKIE = "fa_sid";

const getCookie = (name) => {
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const c of cookies) {
    const [k, v] = c.trim().split("=");
    if (k === name) return decodeURIComponent(v || "");
  }
  return undefined;
};

const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; expires=${expires}; samesite=lax`;
};

const ensureSessionId = () => {
  let sid = getCookie(SID_COOKIE);
  if (!sid) {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
      sid = crypto.randomUUID();
    else sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    setCookie(SID_COOKIE, sid);
  }
  return sid;
};

const pickUtmFromLocation = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    return {
      utmSource: q.get("utm_source") || undefined,
      utmMedium: q.get("utm_medium") || undefined,
      utmCampaign: q.get("utm_campaign") || undefined,
      utmContent: q.get("utm_content") || undefined,
      utmTerm: q.get("utm_term") || undefined,
    };
  } catch {
    return {};
  }
};

/**
 * Log a search event (fire-and-forget, non-blocking)
 */
export const logSearchEvent = async (data) => {
  const sid = ensureSessionId();
  const utm = pickUtmFromLocation();
  try {
    await fetch(`${API_BASE_URL}/api/events/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": sid,
      },
      body: JSON.stringify({
        origin: data.origin,
        destination: data.destination,
        tripType: data.tripType, // "one-way" | "round-trip" | "multi-city"
        travelClass: data.travelClass,
        adults: data.adults ?? 1,
        children: data.children ?? 0,
        // pass UTM as body fallbacks (backend will also parse referrer)
        ...utm,
        sessionId: sid,
      }),
      keepalive: true,
    }).catch(() => void 0);
  } catch {
    void 0;
  }
};

/**
 * Log a click-out event (fire-and-forget, non-blocking)
 */
export const logClickOutEvent = async (data) => {
  const sid = ensureSessionId();
  const utm = pickUtmFromLocation();
  try {
    await fetch(`${API_BASE_URL}/api/events/clickout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": sid,
      },
      body: JSON.stringify({
        origin: data.origin,
        destination: data.destination,
        tripType: data.tripType,
        partner: data.partner,
        price: data.price,
        currency: data.currency,
        deepLink: data.deepLink,
        ...utm,
        sessionId: sid,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
};
