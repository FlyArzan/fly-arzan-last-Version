/**
 * Server-side SEO injection for the client-rendered SPA.
 *
 * Without this, every route is served the same static index.html, so crawlers
 * (and Ahrefs, which doesn't run JS) see the homepage title/description on all
 * pages, no canonical, no H1, no body text, and no internal links — every page
 * looks byte-identical. react-helmet does set correct tags and the app renders
 * real content, but only AFTER JavaScript runs — invisible to non-JS crawlers.
 *
 * Two layers:
 *   1. injectSeo()  — rewrites <title>, description, canonical and OG/Twitter
 *      tags per route. Applied for EVERYONE (head-only, no visible effect).
 *   2. renderSeoBody()/injectBody() — builds real crawlable body content (H1,
 *      intro, article body, and a site-wide navigation link list) and injects
 *      it into #root. Applied ONLY for crawlers (see isCrawler): React's
 *      createRoot replaces #root on mount, so real users never see it and get
 *      no flash of unstyled content. Same content reaches users via client
 *      render, so this is legitimate (not cloaking).
 *
 * Static routes come from ROUTE_META; article/category pages are fetched from
 * the backend and cached in memory.
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

// Primary site navigation, injected into every crawled page so no page is an
// orphan (every page links to these, and these link back) and no page is
// flagged "no outgoing links". Mirrors the real header/footer navigation.
const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/Hotels", label: "Hotels" },
  { href: "/Car", label: "Car Rental" },
  { href: "/travel-guides", label: "Travel Guides" },
  { href: "/visa-information", label: "Visa Information" },
  { href: "/About", label: "About Us" },
  { href: "/Contact", label: "Contact" },
  { href: "/Faq", label: "FAQ" },
  { href: "/Airport", label: "Airport Information" },
  { href: "/COVID", label: "COVID-19 Travel Information" },
  { href: "/PrivacyPolicy", label: "Privacy Policy" },
  { href: "/TermsAndConditions", label: "Terms & Conditions" },
  // Travel-guide categories.
  { href: "/travel-guides/destination-guides", label: "Destination Guides" },
  { href: "/travel-guides/airport-guides", label: "Airport Guides" },
  { href: "/travel-guides/baggage-information", label: "Baggage Information" },
  { href: "/travel-guides/travel-guidelines", label: "Travel Guidelines" },
  { href: "/travel-guides/flight-booking-tips", label: "Flight Booking Tips" },
  { href: "/travel-guides/visa-travel-documents", label: "Visa & Travel Documents" },
  { href: "/travel-guides/travel-tips", label: "Travel Tips" },
  { href: "/travel-guides/travel-news", label: "Travel News" },
  { href: "/travel-guides/general-travel-advice", label: "General Travel Advice" },
];

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
        h1: article?.title || title,
        intro: article?.shortSummary || article?.metaDescription || undefined,
        content: article?.body || undefined,
      };
      setCached(pathname, meta);
      return meta;
    }
    // Backend unreachable / not found — fall back to the hub meta.
    return ROUTE_META["/travel-guides"];
  }

  // /travel-guides/:category  -> clean title from the slug + list of its
  // articles (so the category page has real content and links each article,
  // de-orphaning them).
  if (segments[0] === "travel-guides" && segments.length === 2) {
    const cached = getCached(pathname);
    if (cached) return cached;
    const categorySlug = segments[1];
    const name = prettifySlug(categorySlug);
    const list = await fetchJson(
      `${resolveApiUrl()}/api/articles?category=${encodeURIComponent(categorySlug)}&limit=24`,
    );
    const links = (list?.articles || []).map((a) => ({
      href: `/travel-guides/${a?.articleCategory?.[0]?.slug || categorySlug}/${a.slug}`,
      label: a.title,
    }));
    const meta = {
      title: `${name} | Travel Guides | ${SITE_NAME}`,
      description: `${name} — travel tips, guides and useful information from ${SITE_NAME}.`,
      h1: name,
      intro: `Browse ${name.toLowerCase()} articles, tips and guides from ${SITE_NAME}.`,
      links,
    };
    setCached(pathname, meta);
    return meta;
  }

  // /visa-information/:slug  -> derive from the slug (usually a country).
  if (segments[0] === "visa-information" && segments.length === 2) {
    const name = prettifySlug(segments[1]);
    return {
      title: `${name} Visa Requirements & Information | ${SITE_NAME}`,
      description: `Visa requirements, entry rules and travel documentation for ${name}, from ${SITE_NAME}.`,
      h1: `${name} Visa Requirements`,
      intro: `Visa requirements, entry rules and travel documentation for ${name}, from ${SITE_NAME}.`,
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

// ---------------------------------------------------------------------------
// Body content injection (crawlers only — see isCrawler / server.mjs).
// ---------------------------------------------------------------------------

// Defensive: article body is admin-authored rich text (safe), but strip any
// scripts/styles/inline handlers before placing it in the document.
const stripUnsafeHtml = (html) =>
  String(html || "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");

// Fall back to a clean H1 derived from the title: everything before the first
// "|" separator (e.g. "Car Rental Deals Worldwide | FlyArzan" -> "Car Rental
// Deals Worldwide").
const h1FromTitle = (title) =>
  String(title || SITE_NAME).split("|")[0].trim() || SITE_NAME;

export const renderNav = () =>
  `<nav aria-label="Site navigation"><ul>` +
  SITE_NAV.map(
    (l) => `<li><a href="${escapeAttr(l.href)}">${escapeText(l.label)}</a></li>`,
  ).join("") +
  `</ul></nav>`;

/**
 * Build crawlable body content for a route: H1 + intro + (article body or a
 * list of links) + the site navigation. Returned as a single #seo-content
 * block that React's createRoot wipes on mount (so real users never see it).
 */
export const renderSeoBody = (pathname, meta = {}) => {
  const parts = [`<h1>${escapeText(meta.h1 || h1FromTitle(meta.title))}</h1>`];

  const intro = meta.intro || meta.description;
  if (intro) parts.push(`<p>${escapeText(intro)}</p>`);

  if (meta.content) parts.push(`<article>${stripUnsafeHtml(meta.content)}</article>`);

  if (Array.isArray(meta.links) && meta.links.length) {
    parts.push(
      `<ul>` +
        meta.links
          .map(
            (l) =>
              `<li><a href="${escapeAttr(l.href)}">${escapeText(l.label)}</a></li>`,
          )
          .join("") +
        `</ul>`,
    );
  }

  parts.push(renderNav());
  return `<div id="seo-content">${parts.join("")}</div>`;
};

// Inject rendered body content into the empty #root. Exact-match replace; if the
// marker isn't found (unexpected build output), returns the HTML unchanged.
export const injectBody = (html, bodyHtml) => {
  if (!bodyHtml) return html;
  return html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`,
  );
};

// Detect search-engine / SEO crawlers by User-Agent. Body content is injected
// only for these; real browsers get the untouched shell (no flash of unstyled
// content). The same content is available to users via client render, so this
// is legitimate dynamic rendering, not cloaking.
const CRAWLER_UA =
  /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|embedly|slackbot|whatsapp|applebot|petalbot|ahrefsbot|ahrefssiteaudit|semrushbot|dotbot|mj12bot|rogerbot|screaming\sfrog|bot\b|crawler|spider)/i;

export const isCrawler = (userAgent = "") => CRAWLER_UA.test(userAgent || "");
