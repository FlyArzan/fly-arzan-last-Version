import compression from "compression";
import express from "express";
import path from "path";
import { fileURLToPath } from "node:url";
import {
  hasNonHtmlFileExtension,
  isKnownSpaPath,
  normalizePathname,
} from "./spa-route-allowlist.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const indexHtmlPath = path.join(dist, "index.html");
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

app.use(express.static(dist));

app.use((req, res) => {
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
  res.status(status).sendFile(indexHtmlPath);
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => {
  console.log(`FlyArzan static server listening on ${port}`);
});
