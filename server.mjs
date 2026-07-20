import compression from "compression";
import express from "express";
import path from "path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  hasNonHtmlFileExtension,
  isKnownSpaPath,
  normalizePathname,
} from "./spa-route-allowlist.mjs";
import { resolveMeta, injectSeo, canonicalFor } from "./seo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const indexHtmlPath = path.join(dist, "index.html");

// Read the built shell once at startup (it only changes per build/deploy) so we
// can rewrite its <head> per request without touching disk on every navigation.
let INDEX_HTML = "";
try {
  INDEX_HTML = readFileSync(indexHtmlPath, "utf8");
} catch {
  INDEX_HTML = "";
}
const CANONICAL_HOST = "flyarzan.com";

const STRICT_TRANSPORT_SECURITY =
  "max-age=31536000; includeSubDomains; preload";

const app = express();
app.set("trust proxy", true);

app.use((req, res, next) => {
  if (req.secure) {
    res.setHeader("Strict-Transport-Security", STRICT_TRANSPORT_SECURITY);
  }
  next();
});

app.use((req, res, next) => {
  const host = (req.hostname || "").toLowerCase();
  if (host === "www.flyarzan.com") {
    const dest = `https://${CANONICAL_HOST}${req.originalUrl || "/"}`;
    return res.redirect(301, dest);
  }
  next();
});

app.use(compression());

// index: false so "/" is NOT auto-served the raw index.html here — it must fall
// through to the SEO-injecting handler below (which rewrites the <head>). Other
// static assets (JS/CSS/images) are still served normally.
app.use(express.static(dist, { index: false }));

// Dynamic sitemaps proxied from the backend so new content appears automatically.
const resolveApiUrl = () =>
  process.env.API_URL || process.env.VITE_API_URL || "http://localhost:8787";

const proxySitemap = (backendPath) => async (req, res) => {
  try {
    const response = await fetch(`${resolveApiUrl()}${backendPath}`);
    if (!response.ok) throw new Error(`Backend returned ${response.status}`);
    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch {
    res.sendStatus(503);
  }
};

// Article + visa-country sitemaps (dynamic, slug-based)
app.get("/sitemap-articles.xml", proxySitemap("/api/articles/sitemap.xml"));
app.get("/sitemap-visa.xml", proxySitemap("/api/visa-info/sitemap.xml"));

app.use(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.sendStatus(404);
    return;
  }

  const pathname = req.path || "/";
  if (hasNonHtmlFileExtension(pathname)) {
    res.sendStatus(404);
    return;
  }

  const normalized = normalizePathname(pathname);
  const status = isKnownSpaPath(normalized) ? 200 : 404;

  // Serve the SPA shell with per-route SEO tags injected into the <head> so
  // crawlers see the correct title/description/canonical for this page (not the
  // homepage defaults). Fully fail-safe: any error falls back to the raw shell,
  // so the site can never break because of SEO injection.
  try {
    if (!INDEX_HTML) {
      res.status(status).sendFile(indexHtmlPath);
      return;
    }
    const meta = await resolveMeta(normalized);
    // Unknown paths render as a client-side 404 — keep them out of the index.
    const finalMeta = status === 404 ? { ...meta, noindex: true } : meta;
    const html = injectSeo(INDEX_HTML, finalMeta, canonicalFor(normalized));
    res
      .status(status)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(html);
  } catch {
    res.status(status).sendFile(indexHtmlPath);
  }
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => {
  console.log(`FlyArzan static server listening on ${port}`);
});
