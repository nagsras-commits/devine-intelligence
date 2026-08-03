import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang } from "@/lib/i18n";
import { Sparkles, Hash, Play, Calendar, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Map panchangam `deity_of_day` (usually a vāra deity name) → our deity_id
const DEITY_ALIAS_MAP = {
  "surya": "surya",
  "ravi": "surya",
  "aditya": "surya",
  "chandra": "shiva",       // Monday — Shiva (also Chandra-shekhara)
  "soma": "shiva",
  "mangala": "subrahmanya", // Tuesday
  "kuja": "subrahmanya",
  "hanuman": "hanuman",
  "budha": "vishnu",        // Wednesday
  "brihaspati": "dattatreya", // Thursday
  "guru": "dattatreya",
  "shukra": "lakshmi",      // Friday
  "shani": "navagraha",     // Saturday
  "vishnu": "vishnu",
  "shiva": "shiva",
  "durga": "durga",
  "lakshmi": "lakshmi",
  "saraswati": "saraswati",
};

const KEY_JAPA = "dj_japa_counts";

const loadJapa = () => { try { return JSON.parse(localStorage.getItem(KEY_JAPA) || "{}"); } catch { return {}; } };
const saveJapa = (o) => localStorage.setItem(KEY_JAPA, JSON.stringify(o));

export default function DeityOfDayRibbon() {
  const { lang, playTrack } = useApp();
  const nav = useNavigate();
  const [pan, setPan] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    axios.get(`${API}/panchangam`).then((r) => setPan(r.data)).catch(() => {});
  }, []);

  if (!pan) return null;

  const key = (pan.deity_of_day || "").toLowerCase().trim();
  const deityId = DEITY_ALIAS_MAP[key] || "shiva"; // fallback
  const deity = DEITIES.find((d) => d.id === deityId);
  if (!deity) return null;

  const enName = pickLang(deity.name, lang);
  const saName = pickLang(deity.name, "sa");

  const addToJapa = () => {
    const counts = loadJapa();
    counts[deityId] = (counts[deityId] || 0) + 108;
    saveJapa(counts);
    setToast(`✨ 108 japa added for ${enName}!`);
    setTimeout(() => setToast(""), 2500);
    // Trigger cross-tab sync
    window.dispatchEvent(new Event("dj-sadhana-synced"));
  };

  const playMantra = () => {
    // Play the mula mantra as a sloka using the audio system (SpeechSynthesis fallback)
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(deity.mula_mantra.en);
      u.rate = 0.75; u.pitch = 0.9; u.volume = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  };

  return (
    <section
      data-testid="deity-of-day-ribbon"
      className="relative overflow-hidden rounded-2xl gold-border diya-glow-strong"
      style={{ background: `linear-gradient(115deg, ${deity.color}18, hsl(var(--gold)/0.08) 60%, ${deity.color}10)` }}
    >
      {toast && (
        <div data-testid="deity-of-day-toast" className="absolute top-2 left-1/2 -translate-x-1/2 z-10 rounded-full px-4 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow animate-rise">
          {toast}
        </div>
      )}

      <div className="grid sm:grid-cols-[9rem_1fr_auto] items-center gap-3 sm:gap-5 p-3 sm:p-5">
        {/* Deity portrait */}
        <Link to={`/deities/${deity.id}`} className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0 rounded-full overflow-hidden ring-2 ring-[hsl(var(--gold))] diya-glow shrink-0">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/api/static/deities/${deity.id}.png`}
            alt={enName}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Content */}
        <div className="text-center sm:text-left min-w-0">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Calendar className="w-3.5 h-3.5 text-saffron" />
            <div className="text-[10px] uppercase tracking-[0.3em] text-saffron font-medium">
              Deity of the Day — {pan.vara}
            </div>
          </div>
          <h3 className="mt-1 font-display font-bold text-2xl sm:text-3xl text-gold-shimmer inline-block flex-wrap gap-x-3" style={{ letterSpacing: "0.04em" }}>
            {enName}
            <span className="ml-2 font-devanagari text-xl sm:text-2xl align-baseline" style={{
              background: "linear-gradient(120deg, hsl(45 100% 88%), hsl(30 100% 62%), hsl(45 100% 88%))",
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{saName}</span>
          </h3>
          <div className="mt-2 font-devanagari text-lg sm:text-xl text-kumkum dark:text-[hsl(var(--gold))] break-words">
            {deity.mula_mantra.sa}
          </div>
          <div className="text-[11px] italic text-foreground/70 mt-0.5">{deity.mula_mantra.en}</div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 justify-center">
          <button
            onClick={addToJapa}
            data-testid="deity-of-day-japa"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow whitespace-nowrap"
          >
            <Hash className="w-3.5 h-3.5" /> +108 Japa
          </button>
          <button
            onClick={playMantra}
            data-testid="deity-of-day-play"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm gold-border hover:bg-[hsl(var(--gold)/0.1)] whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" /> Chant
          </button>
          <button
            onClick={() => nav(`/deities/${deity.id}`)}
            data-testid="deity-of-day-view"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm gold-border hover:bg-[hsl(var(--gold)/0.1)] whitespace-nowrap"
          >
            View <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
