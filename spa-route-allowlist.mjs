import path from "node:path";

/**
 * SPA paths that warrant HTTP 200 + index.html.
 * Missing paths should respond with 404 + index.html so the client shows NotFound
 * without confusing crawlers or audits with a soft 404.
 *
 * Sync with React Router definitions in src/Routes/Routes.jsx when routes change.
 */
const KNOWN_PATHS = new Set([
  "/",
  "/dashboard",
  "/dashboard/notifications",
  "/search/flight",
  "/flight/details",
  "/Hotels",
  "/Car",
  "/HotelsInner",
  "/CarInner",
  "/Faq",
  "/About",
  "/Contact",
  "/PrivacyPolicy",
  "/TermsAndConditions",
  "/Login",
  "/signup",
  "/Singup",
  "/reset-password",
  "/admin-login",
  "/auth/callback",
  "/COVID",
  "/Airport",
  "/VisaRequirements",
  "/admin",
  "/admin/dashboard",
  "/admin/logs",
  "/admin/analytics/engagement",
  "/admin/analytics/routes",
  "/admin/analytics/trends",
  "/admin/cms/about-us",
  "/admin/cms/faq",
  "/admin/cms/privacy-policy",
  "/admin/cms/terms-conditions",
  "/admin/cms/contact",
  "/admin/cms/covid-19",
  "/admin/cms/airport",
  "/admin/monitoring/health",
  "/admin/monitoring/alerts",
  "/admin/monitoring/logs",
  "/admin/auth/sessions",
  "/admin/users",
  "/admin/roles",
  "/admin/customers",
  "/admin/email-campaigns",
  "/admin/settings",
  "/admin/profile",
  "/admin/notifications",
  "/admin/feedback",
  "/admin/content/articles",
  "/admin/content/articles/new",
  "/admin/visa-db",
  "/admin/visa-db/new",
  "/travel-guides",
  "/visa-information",
]);

const ADMIN_USER_SEGMENT = /^\/admin\/users\/[^/]+$/;
const ADMIN_CUSTOMER_SEGMENT = /^\/admin\/customers\/[^/]+$/;
const ADMIN_ARTICLE_SEGMENT = /^\/admin\/content\/articles\/[^/]+$/;
const ADMIN_VISA_SEGMENT = /^\/admin\/visa-db\/[^/]+$/;
const TRAVEL_GUIDES_SEGMENT = /^\/travel-guides(\/[^/]+(\/[^/]+)?)?$/;
const VISA_INFO_SEGMENT = /^\/visa-information\/[^/]+$/;

/** @param {string} raw */
export function normalizePathname(raw) {
  let p = typeof raw === "string" ? raw : "/";
  if (!p.startsWith("/")) {
    p = `/${p}`;
  }
  const q = p.indexOf("?");
  if (q >= 0) {
    p = p.slice(0, q);
  }
  try {
    p = decodeURIComponent(p);
  } catch {
    // ignore malformed escapes
  }
  if (p.length > 1 && p.endsWith("/")) {
    p = p.slice(0, -1);
  }
  return p || "/";
}

/**
 * Requests with a known file-like extension missed `express.static` — return a real 404
 * instead of sending the HTML shell (avoids MIME errors for JS/CSS).
 *
 * `.html` is allowed so deliberate `/something.html` can fall through if you add files later.
 * @param {string} pathnameWithQuerySameAsReqPath
 */
export function hasNonHtmlFileExtension(pathnameWithQuerySameAsReqPath) {
  const clean = pathnameWithQuerySameAsReqPath.split("?")[0] ?? "";
  const ext = path.extname(clean).toLowerCase();
  return ext !== "" && ext !== ".html";
}

/** @param {string} normalizedPath */
export function isKnownSpaPath(normalizedPath) {
  if (KNOWN_PATHS.has(normalizedPath)) {
    return true;
  }
  if (ADMIN_USER_SEGMENT.test(normalizedPath)) return true;
  if (ADMIN_CUSTOMER_SEGMENT.test(normalizedPath)) return true;
  if (ADMIN_ARTICLE_SEGMENT.test(normalizedPath)) return true;
  if (ADMIN_VISA_SEGMENT.test(normalizedPath)) return true;
  if (TRAVEL_GUIDES_SEGMENT.test(normalizedPath)) return true;
  if (VISA_INFO_SEGMENT.test(normalizedPath)) return true;
  return false;
}
