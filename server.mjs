import express from "express";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const CANONICAL_HOST = "flyarzan.com";

const app = express();
app.set("trust proxy", true);

app.use((req, res, next) => {
  const host = (req.hostname || "").toLowerCase();
  if (host === "www.flyarzan.com") {
    const dest = `https://${CANONICAL_HOST}${req.originalUrl || "/"}`;
    return res.redirect(301, dest);
  }
  next();
});

app.use(express.static(dist));

app.use((req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => {
  console.log(`FlyArzan static server listening on ${port}`);
});
