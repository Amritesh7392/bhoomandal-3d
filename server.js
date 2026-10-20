import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Bhoomandal/1.0 educational astronomy app" },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Upstream service returned ${response.status}${detail ? `: ${detail.slice(0, 180)}` : ""}`);
  }
  return response.json();
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Bhoomandal", timestamp: new Date().toISOString() });
});

// NASA Astronomy Picture of the Day. NASA migrated APOD to this endpoint in September 2026.
app.get("/api/apod", async (_req, res) => {
  try {
    const url = new URL("https://science.nasa.gov/wp-json/wp/v2/apod-basic/");
    url.searchParams.set("api_key", NASA_API_KEY);
    const payload = await fetchJson(url);
    const raw = Array.isArray(payload) ? payload[0] : payload;
    const item = raw?.data ?? raw;
    const title = item?.title?.rendered ?? item?.title ?? "Astronomy Picture of the Day";
    const image = item?.hdurl ?? item?.image_url ?? item?.url ?? item?.featured_image_url;
    const explanation = item?.explanation ?? item?.description ?? item?.excerpt?.rendered ?? "Explore today's astronomy feature from NASA.";
    const date = item?.date ?? item?.date_gmt ?? new Date().toISOString().slice(0, 10);
    const page = item?.permalink ?? item?.link ?? "https://science.nasa.gov/solar-system/";
    if (!image && !item?.basic_html) {
      return res.status(502).json({ error: "NASA APOD response format was unexpected.", fallback: true });
    }
    res.json({
      title: String(title).replace(/<[^>]*>/g, ""),
      image: image || null,
      explanation: String(explanation).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
      date: String(date).slice(0, 10),
      page,
      source: "NASA Astronomy Picture of the Day"
    });
  } catch (error) {
    res.status(502).json({ error: "Could not load NASA's astronomy picture right now.", detail: error.message });
  }
});

// Near-Earth objects for the current UTC date. This is a feed, not a prediction of impact.
app.get("/api/neo", async (_req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = new URL("https://api.nasa.gov/neo/rest/v1/feed");
    url.searchParams.set("start_date", today);
    url.searchParams.set("end_date", today);
    url.searchParams.set("api_key", NASA_API_KEY);
    const data = await fetchJson(url);
    const objects = (data.near_earth_objects?.[today] || []).map((neo) => ({
      id: neo.id,
      name: neo.name,
      closeApproachDate: neo.close_approach_data?.[0]?.close_approach_date_full || neo.close_approach_data?.[0]?.close_approach_date || "Not provided",
      missDistanceKm: Number(neo.close_approach_data?.[0]?.miss_distance?.kilometers || 0),
      velocityKph: Number(neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0),
      diameterMeters: Number(neo.estimated_diameter?.meters?.estimated_diameter_max || 0),
      potentiallyHazardous: Boolean(neo.is_potentially_hazardous_asteroid),
      nasaUrl: neo.nasa_jpl_url
    })).sort((a, b) => a.missDistanceKm - b.missDistanceKm);
    res.json({ date: today, count: objects.length, objects, source: "NASA Near Earth Object Web Service" });
  } catch (error) {
    res.status(502).json({ error: "Could not load today's near-Earth object feed.", detail: error.message });
  }
});

// Search NASA's public image/video library without requiring an API key.
app.get("/api/nasa-search", async (req, res) => {
  const q = String(req.query.q || "solar system").slice(0, 100);
  try {
    const url = new URL("https://images-api.nasa.gov/search");
    url.searchParams.set("q", q);
    url.searchParams.set("media_type", "image");
    url.searchParams.set("page_size", "12");
    const data = await fetchJson(url);
    const items = (data.collection?.items || []).map((item) => {
      const d = item.data?.[0] || {};
      const links = item.links || [];
      return {
        id: d.nasa_id,
        title: d.title || "NASA image",
        description: d.description || "",
        date: d.date_created || "",
        image: links.find((l) => l.rel === "preview")?.href || "",
        nasaUrl: d.nasa_id ? `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}` : ""
      };
    }).filter((item) => item.image);
    res.json({ query: q, items, source: "NASA Image and Video Library" });
  } catch (error) {
    res.status(502).json({ error: "NASA image search is temporarily unavailable.", detail: error.message });
  }
});

app.get("*path", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Bhoomandal is running at http://localhost:${PORT}`);
});
