import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Sunrise, Loader2, Link2, Star, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const RASHIS = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
const NAKSHATRAS = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];

const PREF_KEY = "dj_horoscope_pref";
const KUNDALI_KEY = "dj_kundali_result";

const loadKundali = () => {
  try { return JSON.parse(localStorage.getItem(KUNDALI_KEY) || "null"); } catch { return null; }
};

export default function DailyHoroscope({ onJumpToKundali }) {
  const [kundali, setKundali] = useState(() => loadKundali());
  const savedPref = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch { return {}; }
  }, []);
  // Prefer Kundali data; fall back to user's last manual pick.
  const [rashi, setRashi] = useState(kundali?.janma_rasi || savedPref.rashi || "");
  const [nakshatra, setNakshatra] = useState(kundali?.janma_nakshatra || savedPref.nakshatra || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [override, setOverride] = useState(false); // user manually changed after linking

  // Listen for Kundali generation from within same tab
  useEffect(() => {
    const handler = () => {
      const k = loadKundali();
      setKundali(k);
      if (k && !override) {
        setRashi(k.janma_rasi || "");
        setNakshatra(k.janma_nakshatra || "");
      }
    };
    window.addEventListener("dj-kundali-updated", handler);
    // Also across tabs
    const storage = (e) => { if (e.key === KUNDALI_KEY) handler(); };
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener("dj-kundali-updated", handler);
      window.removeEventListener("storage", storage);
    };
  }, [override]);

  const linked = !!(kundali && !override && (rashi === kundali.janma_rasi) && (nakshatra === kundali.janma_nakshatra));

  const fetchNow = async () => {
    if (!rashi && !nakshatra) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/horoscope`, { params: { rashi, nakshatra } });
      setData(data);
      localStorage.setItem(PREF_KEY, JSON.stringify({ rashi, nakshatra }));
    } catch (e) { setData(null); }
    finally { setLoading(false); }
  };

  const resetToKundali = () => {
    if (!kundali) return;
    setRashi(kundali.janma_rasi || "");
    setNakshatra(kundali.janma_nakshatra || "");
    setOverride(false);
  };

  useEffect(() => { if (rashi || nakshatra) fetchNow(); /* eslint-disable-next-line */ }, []);

  return (
    <section className="sacred-card grain" data-testid="daily-horoscope">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Sunrise className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Today's Horoscope</h3>
        {linked ? (
          <span
            data-testid="horoscope-linked"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] gold-border bg-emerald-500/10 text-emerald-700"
          >
            <Link2 className="w-3 h-3" /> Linked to your Kundali
            {kundali?.name && <span className="opacity-70">• {kundali.name}</span>}
          </span>
        ) : kundali ? (
          <button
            onClick={resetToKundali}
            data-testid="horoscope-use-kundali"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] gold-border hover:bg-[hsl(var(--gold)/0.12)]"
          >
            <Link2 className="w-3 h-3" /> Use my Kundali data
          </button>
        ) : (
          <button
            onClick={() => onJumpToKundali && onJumpToKundali()}
            data-testid="horoscope-open-kundali"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] gold-border hover:bg-[hsl(var(--gold)/0.12)]"
          >
            <Star className="w-3 h-3" /> Generate your Kundali for personalised reading
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {linked && (
        <p className="text-[11px] text-muted-foreground italic mb-3" data-testid="horoscope-linked-note">
          Reading for your Janma Rāśi <b>{kundali.janma_rasi}</b> and Nakshatra <b>{kundali.janma_nakshatra}</b>.
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-2 mb-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Rāśi (Moon Sign)</label>
          <select
            value={rashi}
            onChange={(e) => { setRashi(e.target.value); if (kundali) setOverride(true); }}
            data-testid="horoscope-rashi"
            className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm"
          >
            <option value="">— Select —</option>
            {RASHIS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Janma Nakshatra</label>
          <select
            value={nakshatra}
            onChange={(e) => { setNakshatra(e.target.value); if (kundali) setOverride(true); }}
            data-testid="horoscope-nakshatra"
            className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm"
          >
            <option value="">— Select —</option>
            {NAKSHATRAS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchNow} disabled={loading || (!rashi && !nakshatra)}
            data-testid="horoscope-fetch"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Read Today"}
          </button>
        </div>
      </div>

      {data && (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {["general","career","health","relationships","wealth"].filter((k) => data[k]).map((k) => (
              <div key={k} className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.05)]" data-testid={`horoscope-${k}`}>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                <div className="text-sm text-foreground/90 mt-1">{data[k]}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {data.lucky_color && <span className="rounded-full px-3 py-1 gold-border">Lucky colour: <b>{data.lucky_color}</b></span>}
            {data.lucky_number !== undefined && <span className="rounded-full px-3 py-1 gold-border">Lucky number: <b>{data.lucky_number}</b></span>}
          </div>
          {data.mantra && (
            <div className="rounded-lg p-3 bg-gradient-to-r from-[hsl(var(--gold)/0.15)] to-[hsl(var(--saffron)/0.1)]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Today's Mantra</div>
              <div className="font-devanagari text-lg mt-1 text-kumkum dark:text-[hsl(var(--gold))]">{data.mantra}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
