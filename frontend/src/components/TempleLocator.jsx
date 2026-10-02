import React, { useEffect, useState } from "react";
import { MapPin, Loader2, ExternalLink, Church, Route } from "lucide-react";
import useGeolocation from "@/hooks/useGeolocation";

// Curated fallback list — used when Overpass API is unreachable
const FALLBACK = [
  { name: "Tirumala Venkateswara", city: "Tirumala, AP",   lat: 13.6833, lng: 79.3474, deity: "Venkateswara", timings: "3:00 am – 12:00 midnight" },
  { name: "Kashi Vishwanath",      city: "Varanasi, UP",    lat: 25.3109, lng: 83.0106, deity: "Shiva",        timings: "3:00 am – 11:00 pm" },
  { name: "Meenakshi Amman",       city: "Madurai, TN",     lat: 9.9195,  lng: 78.1194, deity: "Meenakshi",    timings: "5:00 am – 12:30 pm • 4:00 – 10:00 pm" },
  { name: "Somnath Jyotirlinga",   city: "Somnath, Gujarat",lat: 20.888,  lng: 70.4013, deity: "Shiva",        timings: "6:00 am – 9:30 pm" },
  { name: "Kedarnath",             city: "Uttarakhand",     lat: 30.7346, lng: 79.0669, deity: "Shiva",        timings: "4:00 am – 9:00 pm (seasonal)" },
  { name: "Jagannath Puri",        city: "Puri, Odisha",    lat: 19.8047, lng: 85.8175, deity: "Jagannath",    timings: "5:00 am – 11:00 pm" },
  { name: "Sri Ranganathaswamy",   city: "Srirangam, TN",   lat: 10.8624, lng: 78.688,  deity: "Vishnu",       timings: "6:00 am – 1:00 pm • 3:15 – 8:45 pm" },
  { name: "Golden Temple (Vishnu)",city: "Sripuram, TN",    lat: 12.9165, lng: 79.132,  deity: "Mahalakshmi",  timings: "8:00 am – 8:00 pm" },
  { name: "Konark Sun Temple",     city: "Konark, Odisha",  lat: 19.887,  lng: 86.0947, deity: "Surya",        timings: "6:00 am – 8:00 pm" },
  { name: "Rameshwaram",           city: "Rameshwaram, TN", lat: 9.2882,  lng: 79.3129, deity: "Shiva",        timings: "5:00 am – 1:00 pm • 3:00 – 9:00 pm" },
  { name: "Vaishno Devi",          city: "Katra, J&K",      lat: 33.0304, lng: 74.9497, deity: "Vaishno Devi", timings: "5:00 am – 12:00 am" },
  { name: "Amarnath Cave",         city: "Kashmir",          lat: 34.2144, lng: 75.5011, deity: "Shiva",        timings: "Seasonal (Jul–Aug)" },
  { name: "Siddhivinayak",         city: "Mumbai, MH",      lat: 19.0179, lng: 72.8306, deity: "Ganesha",      timings: "5:30 am – 10:00 pm" },
  { name: "Shirdi Sai Baba",       city: "Shirdi, MH",      lat: 19.7671, lng: 74.4761, deity: "Sai Baba",     timings: "4:00 am – 11:00 pm" },
  { name: "ISKCON Temple",         city: "Vrindavan, UP",   lat: 27.5892, lng: 77.6725, deity: "Krishna",      timings: "4:30 am – 8:30 pm" },
  { name: "Dwarkadhish",           city: "Dwarka, Gujarat", lat: 22.2394, lng: 68.9678, deity: "Krishna",      timings: "6:30 am – 12:30 pm • 5:00 – 9:30 pm" },
  { name: "Sabarimala Ayyappa",    city: "Kerala",           lat: 9.4374,  lng: 77.0812, deity: "Ayyappa",      timings: "3:30 am – 11:00 pm (seasonal)" },
];

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const OVERPASS = "https://overpass-api.de/api/interpreter";

const overpassQuery = (lat, lng, radiusKm) => `
[out:json][timeout:15];
(
  node["amenity"="place_of_worship"]["religion"="hindu"](around:${radiusKm * 1000},${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="hindu"](around:${radiusKm * 1000},${lat},${lng});
);
out center 40;
`;

export default function TempleLocator() {
  const geo = useGeolocation();
  const [temples, setTemples] = useState(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);

  const fetchTemples = async (lat, lng, r) => {
    setLoading(true); setSource("");
    try {
      const body = new URLSearchParams({ data: overpassQuery(lat, lng, r) });
      const res = await fetch(OVERPASS, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      if (!res.ok) throw new Error("overpass failed");
      const data = await res.json();
      const items = (data.elements || []).map((e) => {
        const la = e.lat ?? e.center?.lat, lo = e.lon ?? e.center?.lon;
        if (la == null || lo == null) return null;
        const name = e.tags?.name || e.tags?.["name:en"] || "Hindu Temple";
        return {
          name,
          city: e.tags?.["addr:city"] || e.tags?.["addr:suburb"] || "",
          lat: la, lng: lo,
          deity: e.tags?.deity || e.tags?.dedicated_to || "—",
          timings: e.tags?.opening_hours || "Check locally",
          osm_id: `${e.type}/${e.id}`,
        };
      }).filter(Boolean);
      if (items.length === 0) throw new Error("no results");
      items.forEach((it) => { it.distance_km = haversineKm(lat, lng, it.lat, it.lng); });
      items.sort((a, b) => a.distance_km - b.distance_km);
      setTemples(items.slice(0, 20));
      setSource("live");
    } catch (e) {
      // Fallback: curated list, filtered by radius
      const items = FALLBACK.map((it) => ({ ...it, distance_km: haversineKm(lat, lng, it.lat, it.lng) }))
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 12);
      setTemples(items);
      setSource("curated");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geo.status === "ready") fetchTemples(geo.lat, geo.lng, radiusKm);
    // eslint-disable-next-line
  }, [geo.status, radiusKm]);

  return (
    <section className="sacred-card grain" data-testid="temple-locator">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Church className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Nearby Temples</h3>
        {geo.status === "ready" && (
          <span className="ml-auto text-[10px] text-muted-foreground">Within
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value, 10))}
              data-testid="temple-radius"
              className="ml-1 text-xs rounded px-2 py-0.5 gold-border bg-card"
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={200}>200 km</option>
              <option value={2000}>anywhere</option>
            </select>
          </span>
        )}
      </div>

      {geo.status !== "ready" ? (
        <div className="rounded-xl p-4 gold-border bg-[hsl(var(--gold)/0.05)] flex flex-wrap items-center gap-3">
          <MapPin className="w-4 h-4 text-saffron" />
          <div className="flex-1 text-sm">
            Share your location to see temples near you — deity, timings and directions.
          </div>
          <button
            onClick={geo.request}
            data-testid="temple-locate-btn"
            className="rounded-full px-4 py-2 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90"
          >
            {geo.status === "loading" ? "Detecting…" : "Find temples near me"}
          </button>
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Searching OpenStreetMap…
        </div>
      ) : (
        <>
          {source === "curated" && (
            <div className="text-[11px] text-muted-foreground mb-2 italic">
              Live temple data unreachable — showing famous temples across India ranked by distance.
            </div>
          )}
          <div className="space-y-2">
            {(temples || []).map((tt, i) => (
              <div key={i} data-testid={`temple-${i}`} className="rounded-xl p-3 gold-border bg-card hover:bg-[hsl(var(--gold)/0.06)] transition">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))] truncate">{tt.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{tt.city}{tt.city && tt.deity ? " • " : ""}Deity: {tt.deity}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{tt.timings}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium text-sm text-saffron">{tt.distance_km.toFixed(1)} km</div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${tt.lat},${tt.lng}${tt.osm_id ? "" : ""}`}
                      target="_blank" rel="noreferrer"
                      data-testid={`temple-dir-${i}`}
                      className="inline-flex items-center gap-1 mt-1 rounded-full px-3 py-1 text-[11px] gold-border hover:bg-[hsl(var(--gold)/0.15)]"
                    >
                      <Route className="w-3 h-3" /> Directions <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {temples && temples.length === 0 && (
              <div className="text-sm text-muted-foreground italic">No temples found in this radius. Try increasing it.</div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
