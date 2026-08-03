import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Star, Loader2, ChevronDown, User, MapPin, Sparkles } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const KEY = "dj_kundali_input";

// Popular Indian cities for quick pick — good enough for most users
const CITIES = [
  { label: "Hyderabad, India",  lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { label: "Chennai, India",    lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { label: "Bengaluru, India",  lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { label: "Mumbai, India",     lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { label: "Delhi, India",      lat: 28.7041, lng: 77.1025, tz: 5.5 },
  { label: "Kolkata, India",    lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { label: "Pune, India",       lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { label: "Ahmedabad, India",  lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { label: "Jaipur, India",     lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { label: "Kochi, India",      lat: 9.9312,  lng: 76.2673, tz: 5.5 },
  { label: "Visakhapatnam, India", lat: 17.6868, lng: 83.2185, tz: 5.5 },
  { label: "Tirupati, India",   lat: 13.6288, lng: 79.4192, tz: 5.5 },
  { label: "Varanasi, India",   lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { label: "New York, USA",     lat: 40.7128, lng: -74.0060, tz: -5 },
  { label: "London, UK",        lat: 51.5074, lng: -0.1278, tz: 0 },
  { label: "Sydney, Australia", lat: -33.8688, lng: 151.2093, tz: 10 },
  { label: "Dubai, UAE",        lat: 25.2048, lng: 55.2708, tz: 4 },
  { label: "Singapore",         lat: 1.3521,  lng: 103.8198, tz: 8 },
];

const loadForm = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };

export default function KundaliMaker() {
  const [form, setForm] = useState(() => ({
    name: "", dob: "", time: "12:00", cityIdx: 0,
    ...loadForm(),
  }));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const city = CITIES[form.cityIdx] || CITIES[0];

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.dob || !form.time) { setErr("Please enter date and time of birth."); return; }
    setErr(""); setLoading(true); setResult(null);
    localStorage.setItem(KEY, JSON.stringify(form));
    try {
      const { data } = await axios.post(`${API}/kundali/generate`, {
        name: form.name || null, dob: form.dob, time: form.time,
        place: city.label, lat: city.lat, lng: city.lng, tz_offset: city.tz,
      }, { withCredentials: true });
      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sacred-card grain" data-testid="kundali-maker">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Vedic Kundali — Birth Chart</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Enter your birth details to see your Lagna, Janma Rāśi, Nakshatra, planetary positions, dashas and receive a personalized reading.
      </p>

      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Name (optional)</label>
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="kundali-name" placeholder="Śrī / Śrīmatī ..."
              className="w-full pl-8 rounded-lg py-2 gold-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Date of Birth</label>
          <input
            type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
            data-testid="kundali-dob" required
            className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Time of Birth (24h)</label>
          <input
            type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
            data-testid="kundali-time" required
            className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Place of Birth</label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={form.cityIdx} onChange={(e) => setForm({ ...form, cityIdx: parseInt(e.target.value, 10) })}
              data-testid="kundali-place"
              className="w-full pl-8 pr-8 rounded-lg py-2 gold-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))] appearance-none"
            >
              {CITIES.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <button
            type="submit" disabled={loading}
            data-testid="kundali-submit"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white font-medium hover:opacity-90 diya-glow disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating chart & reading…" : "Generate Kundali"}
          </button>
          {err && <div data-testid="kundali-err" className="text-xs text-red-600">{err}</div>}
        </div>
      </form>

      {result && (
        <div data-testid="kundali-result" className="mt-4 space-y-4">
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.06)]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Lagna (Ascendant)</div>
              <div className="text-sm font-medium mt-0.5">{result.chart.lagna.rasi}</div>
              <div className="text-[11px] text-muted-foreground">{result.chart.lagna.degree.toFixed(2)}°</div>
            </div>
            <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.06)]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Janma Rāśi (Moon)</div>
              <div className="text-sm font-medium mt-0.5">{result.chart.janma_rasi}</div>
            </div>
            <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.06)]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Janma Nakshatra</div>
              <div className="text-sm font-medium mt-0.5">{result.chart.janma_nakshatra}</div>
              <div className="text-[11px] text-muted-foreground">Lord: {result.chart.moon_nakshatra_lord}</div>
            </div>
          </div>

          {/* Doshas */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs gold-border ${result.chart.doshas.mangal_dosha ? "bg-red-500/10 text-red-700" : "bg-emerald-500/10 text-emerald-700"}`}>
              {result.chart.doshas.mangal_dosha ? "⚠️" : "✓"} Mangala Dosha: {result.chart.doshas.mangal_dosha ? "Present" : "Absent"}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs gold-border ${result.chart.doshas.kaal_sarpa_dosha ? "bg-red-500/10 text-red-700" : "bg-emerald-500/10 text-emerald-700"}`}>
              {result.chart.doshas.kaal_sarpa_dosha ? "⚠️" : "✓"} Kāla-Sarpa Dosha: {result.chart.doshas.kaal_sarpa_dosha ? "Present" : "Absent"}
            </span>
          </div>

          {/* Planets */}
          <details className="rounded-lg gold-border p-3 bg-card">
            <summary className="cursor-pointer text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Planetary Positions</summary>
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              {result.chart.planets.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs p-2 rounded bg-[hsl(var(--gold)/0.04)]">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">{p.rasi.split(" ")[0]} • H{p.house} • {p.nakshatra} pāda {p.pada}</span>
                </div>
              ))}
            </div>
          </details>

          {/* Vimshottari Dasha */}
          <details className="rounded-lg gold-border p-3 bg-card">
            <summary className="cursor-pointer text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Vimshottari Mahādaśā Timeline</summary>
            <div className="mt-3 space-y-1">
              {result.chart.vimshottari_dasha.map((d, i) => (
                <div key={i} className={`flex items-center justify-between text-xs p-2 rounded ${i === 0 ? "bg-[hsl(var(--gold)/0.15)] font-semibold" : "bg-[hsl(var(--gold)/0.04)]"}`}>
                  <span>{d.lord}</span>
                  <span className="text-muted-foreground">{d.start} → {d.end}  ({d.years} yr)</span>
                </div>
              ))}
            </div>
          </details>

          {/* AI Reading */}
          {result.reading && (
            <div className="rounded-lg p-4 gold-border bg-[hsl(var(--gold)/0.04)]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Personalized Reading</div>
              <div className="prose prose-sm max-w-none text-foreground/90"
                   style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <ReactMarkdown>{result.reading}</ReactMarkdown>
              </div>
            </div>
          )}

          {!result.saved && (
            <p className="text-[11px] text-muted-foreground italic">
              💡 Sign in with Google to save your Kundali across devices.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
