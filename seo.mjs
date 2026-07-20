/**
 * Server-side SEO head injection.
 *
 * The app is a client-rendered SPA: without this, every route is served the
 * same static index.html, so crawlers (and Ahrefs, which doesn't run JS) see
 * the homepage <title>/description/canonical on all 23 pages. react-helmet does
 * set correct per-page tags, but only AFTER JavaScript executes in a browser —
 * invisible to non-JS crawlers.
 *
 * This module rewrites the delivered HTML's <title>, meta description,
 * canonical, and Open Graph / Twitter tags per route BEFORE sending it, so the
 * correct meta is in the raw HTML. react-helmet still runs client-side and
 * takes over for real users (with matching values), so there's no conflict.
 *
 * Static routes come from ROUTE_META. Dynamic article pages have their real
 * title/description fetched from the backend and cached in memory.
 */

const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://flyarzan.com").replace(
  /\/$/,
  "",
);

const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/Pics/Airline%20wing/Air%20line%20wings%2011.jpg`;

const resolveApiUrl = () =>
  (
    process.env.API_URL ||
    process.env.VITE_API_URL ||
    "http://localhost:8787"
  ).replace(/\/$/, "");

// ---------------------------------------------------------------------------
// Per-route metadata (static pages). Keys are exact pathnames.
// Keep titles/descriptions in step with each page's own <Helmet> block.
// ---------------------------------------------------------------------------
const ROUTE_META = {
  "/": {
    title: "Search For Best Flight Deals Worldwide with FlyArzan",
    description:
      "Find the best flight deals to top destinations with FlyArzan. Compare prices, book with confidence, and maximize your savings with just one simple search.",
  },
  "/Hotels": {
    title: "Find & Compare Hotel Deals Worldwide | FlyArzan",
    description:
      "Compare hotel deals across top destinations with FlyArzan. Find the right stay at the right price, from city breaks to beach resorts.",
  },
  "/Car": {
    title: "Car Rental Deals Worldwide | FlyArzan",
    description:
      "Compare car rental deals worldwide with FlyArzan. Find reliable vehicles at competitive prices for your next trip.",
  },
  "/search/flight": {
    title: "Flight Search Results | FlyArzan",
    description:
      "Compare live flight options and fares for your route with FlyArzan and choose the best deal for your trip.",
  },
  "/About": {
    title: "About FlyArzan | Your Flight & Travel Search Companion",
    description:
      "Learn about FlyArzan — how we help travellers find the best flight, hotel and car rental deals and plan smarter trips.",
  },
  "/Contact": {
    title: "Contact FlyArzan | Get in Touch",
    description:
      "Get in touch with the FlyArzan team. We're here to help with your flight, hotel and travel questions.",
  },
  "/Faq": {
    title: "Frequently Asked Questions | FlyArzan",
    description:
      "Answers to common questions about searching flights, comparing deals and using FlyArzan to plan your travel.",
  },
  "/PrivacyPolicy": {
    title: "Privacy Policy | FlyArzan",
    description:
      "Read the FlyArzan privacy policy to understand how we collect, use and protect your personal information.",
  },
  "/TermsAndConditions": {
    title: "Terms & Conditions | FlyArzan",
    description:
      "Read the terms and conditions governing your use of FlyArzan's flight, hotel and car search services.",
  },
  "/COVID": {
    title: "COVID-19 Travel Information | FlyArzan",
    description:
      "Stay informed with the latest COVID-19 travel guidance, entry rules and safety information for your trips.",
  },
  "/Airport": {
    title: "Airport Information & Guides | FlyArzan",
    description:
      "Airport guides, terminal information and travel tips to help you navigate your journey with FlyArzan.",
  },
  "/travel-guides": {
    title: "Travel Guides & Useful Travel Information | FlyArzan",
    description:
      "Travel tips, destination guides, visa advice, baggage information and more from the FlyArzan editorial team.",
  },
  "/visa-information": {
    title: "Visa Requirements & Information by Country | FlyArzan",
    description:
      "Check visa requirements, entry rules and travel documentation by country with FlyArzan's visa information guides.",
  },
};

// Pages that should not be indexed (auth / booking flow / dashboards).
const NOINDEX_PREFIXES = [
  "/admin",
  "/dashboard",
  "/Login",
  "/signup",
  "/Singup",
  "/reset-password",
  "/admin-login",
  "/auth/callback",
  "/flight/details",
  "/HotelsInner",
  "/CarInner",
];

const SITE_NAME = "FlyArzan";

// ---------------------------------------------------------------------------
// Tiny in-memory TTL cache for dynamic (backend-fetched) route meta.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 10 * 60 * 1000;
const metaCache = new Map(); // pathname -> { at, meta }

const getCached = (key) => {
  const hit = metaCache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    metaCache.delete(key);
    return undefined;
  }
  return hit.meta;
};

const setCached = (key, meta) => {
  metaCache.set(key, { at: Date.now(), meta });
};

// Fetch with a short timeout so a slow/absent backend never hangs a page load.
const fetchJson = async (url, timeoutMs = 2500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const prettifySlug = (slug) =>
  decodeURIComponent(slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

// ---------------------------------------------------------------------------
// Resolve meta for a pathname. Returns { title, description, image?, noindex? }.
// ---------------------------------------------------------------------------
export const resolveMeta = async (pathname) => {
  // Exact static match first.
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];

  const noindex = NOINDEX_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (noindex) return { ...ROUTE_META["/"], noindex: true };

  const segments = pathname.split("/").filter(Boolean);

  // /travel-guides/:category/:slug  -> real article, fetched from the backend.
  if (segments[0] === "travel-guides" && segments.length === 3) {
    const cached = getCached(pathname);
    if (cached) return cached;
    const slug = segments[2];
    const article = await fetchJson(`${resolveApiUrl()}/api/articles/${slug}`);
    const title = article?.metaTitle || article?.title;
    if (title) {
      const meta = {
        title: `${title} | ${SITE_NAME}`,
        description:
          article?.metaDescription ||
          article?.shortSummary ||
          ROUTE_META["/travel-guides"].description,
        image: article?.featuredImage || undefined,
      };
      setCached(pathname, meta);
      return meta;
    }
    // Backend unreachable / not found — fall back to the hub meta.
    return ROUTE_META["/travel-guides"];
  }

  // /travel-guides/:category  -> derive a clean title from the slug.
  if (segments[0] === "travel-guides" && segments.length === 2) {
    const name = prettifySlug(segments[1]);
    return {
      title: `${name} | Travel Guides | ${SITE_NAME}`,
      description: `${name} — travel tips, guides and useful information from ${SITE_NAME}.`,
    };
  }

  // /visa-information/:slug  -> derive from the slug (usually a country).
  if (segments[0] === "visa-information" && segments.length === 2) {
    const name = prettifySlug(segments[1]);
    return {
      title: `${name} Visa Requirements & Information | ${SITE_NAME}`,
      description: `Visa requirements, entry rules and travel documentation for ${name}, from ${SITE_NAME}.`,
    };
  }

  // Unknown route — homepage meta as a safe default.
  return ROUTE_META["/"];
};

// ---------------------------------------------------------------------------
// HTML rewriting helpers.
// ---------------------------------------------------------------------------
const escapeAttr = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeText = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Replace the content="" of the first <meta> tag carrying the given attribute
// (e.g. `name="description"` or `property="og:title"`). Meta tags may span
// multiple lines in the source HTML — [^>] matches newlines, so this is safe.
const setMetaContent = (html, attr, value) =>
  html.replace(new RegExp(`<meta\\b[^>]*${attr}[^>]*>`, "i"), (tag) =>
    tag.replace(/content="[^"]*"/i, `content="${escapeAttr(value)}"`),
  );

/**
 * Inject per-route SEO into the HTML string.
 * @param {string} html   the built index.html
 * @param {object} meta   { title, description, image?, noindex? }
 * @param {string} canonical  absolute canonical URL for this route
 */
export const injectSeo = (html, meta, canonical) => {
  const title = meta.title || ROUTE_META["/"].title;
  const description = meta.description || ROUTE_META["/"].description;
  const image = meta.image || DEFAULT_OG_IMAGE;

  let out = html;

  // <title>
  out = out.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeText(title)}</title>`,
  );

  // Canonical: index.html has none — drop any stray one, then insert after <title>.
  out = out.replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "");
  out = out.replace(
    /<\/title>/i,
    `</title>\n        <link rel="canonical" href="${escapeAttr(canonical)}" />`,
  );

  // Standard + social meta.
  out = setMetaContent(out, 'name="description"', description);
  out = setMetaContent(out, 'property="og:url"', canonical);
  out = setMetaContent(out, 'property="og:title"', title);
  out = setMetaContent(out, 'property="og:description"', description);
  out = setMetaContent(out, 'property="og:image"', image);
  out = setMetaContent(out, 'property="twitter:url"', canonical);
  out = setMetaContent(out, 'name="twitter:title"', title);
  out = setMetaContent(out, 'name="twitter:description"', description);
  out = setMetaContent(out, 'name="twitter:image"', image);

  // Robots for non-indexable routes.
  if (meta.noindex) {
    out = out.replace(
      /<\/title>/i,
      `</title>\n        <meta name="robots" content="noindex, follow" />`,
    );
  }

  return out;
};

export const canonicalFor = (pathname) => `${SITE_ORIGIN}${pathname}`;
