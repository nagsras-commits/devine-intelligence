import React, { useEffect, useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { useApp } from "@/context/AppContext";

// LocalStorage key shared with PradakshinaCounter (which writes the day when it hits 108).
const KEY_DAYS = "dj_prad_days"; // { "YYYY-MM-DD": true, ... }

function loadDays() {
  try {
    const raw = localStorage.getItem(KEY_DAYS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Build rolling window of the last N days ending today (inclusive)
function buildWindow(n) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d);
  }
  return out;
}

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * A row of 30 tiny diyas showing which days of the past 30 the user completed 108 pradakṣiṇā.
 * Lit diyas animate a soft flicker. Today has a gold ring so the user can find it at a glance.
 * Also shows current streak (consecutive completed days ending today) and total completed / 30.
 */
export default function PradakshinaStreak({ days = 30, target = 108 }) {
  const { lang } = useApp();
  const [completions, setCompletions] = useState({});

  // Load + refresh whenever the tab regains focus or another component writes to LS
  useEffect(() => {
    setCompletions(loadDays());
    const onStorage = (e) => {
      if (e.key === KEY_DAYS) setCompletions(loadDays());
    };
    const onFocus = () => setCompletions(loadDays());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    const t = setInterval(() => setCompletions(loadDays()), 2500); // catches same-tab writes
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      clearInterval(t);
    };
  }, []);

  const window30 = useMemo(() => buildWindow(days), [days]);
  const totalDone = window30.filter((d) => completions[iso(d)]).length;

  // Current streak = consecutive completed days ending today
  const currentStreak = useMemo(() => {
    let s = 0;
    for (let i = window30.length - 1; i >= 0; i--) {
      if (completions[iso(window30[i])]) s++;
      else break;
    }
    return s;
  }, [window30, completions]);

  const labels = {
    en: { title: "108 Pradakṣiṇā — 30 Day Streak", streak: "Current streak", days_done: "days lit", today: "Today", note: `Complete ${target} pradakṣiṇā on the counter below to light today's diya.` },
    te: { title: "108 ప్రదక్షిణ — 30 రోజుల స్ట్రీక్", streak: "ప్రస్తుత స్ట్రీక్", days_done: "దీపాలు వెలిగాయి", today: "నేడు", note: `క్రింది కౌంటర్‌లో ${target} ప్రదక్షిణలు పూర్తి చేస్తే నేటి దీపం వెలుగుతుంది.` },
    hi: { title: "१०८ प्रदक्षिणा — ३० दिन स्ट्रीक", streak: "वर्तमान स्ट्रीक", days_done: "दीप प्रज्वलित", today: "आज", note: `नीचे काउंटर पर ${target} प्रदक्षिणा पूरी करें — आज का दीप जल उठेगा।` },
    ta: { title: "108 ப்ரதக்ஷிணம் — 30 நாள் ஸ்ட்ரீக்", streak: "தற்போதைய ஸ்ட்ரீக்", days_done: "விளக்குகள் எரிகின்றன", today: "இன்று", note: `கீழுள்ள எண்ணிக்கையில் ${target} ப்ரதக்ஷிணங்கள் முடித்தால் இன்றைய தீபம் ஏற்றப்படும்.` },
  };
  const L = labels[lang] || labels.en;

  const todayIso = iso(new Date());

  return (
    <section data-testid="pradakshina-streak" className="sacred-card grain">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-saffron animate-flicker" />
          <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{L.title}</h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.streak}</div>
            <div className="font-display text-2xl text-kumkum dark:text-[hsl(var(--gold))] tabular-nums leading-none">
              {currentStreak} <span className="text-xs text-muted-foreground">/ {days}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.days_done}</div>
            <div className="font-display text-2xl text-kumkum dark:text-[hsl(var(--gold))] tabular-nums leading-none">
              {totalDone}
            </div>
          </div>
        </div>
      </div>

      {/* Diya row */}
      <div
        data-testid="diya-row"
        className="mt-5 grid grid-cols-15 sm:grid-cols-30 gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: `repeat(${days > 15 ? 15 : days}, minmax(0, 1fr))` }}
      >
        {window30.map((d) => {
          const key = iso(d);
          const isLit = !!completions[key];
          const isToday = key === todayIso;
          return (
            <div
              key={key}
              data-testid={`diya-${key}`}
              className="flex flex-col items-center gap-1"
              title={`${d.toDateString()}${isLit ? " — 108 complete" : ""}`}
            >
              <div
                className={`relative w-6 h-6 rounded-full transition-all ${
                  isToday ? "ring-2 ring-[hsl(var(--gold))] ring-offset-1 ring-offset-background" : ""
                }`}
                style={{
                  background: isLit
                    ? "radial-gradient(circle at 50% 40%, hsl(45 100% 70%) 0%, hsl(30 95% 55%) 45%, hsl(0 65% 35%) 100%)"
                    : "radial-gradient(circle at 50% 40%, hsl(40 40% 88%) 0%, hsl(40 30% 78%) 100%)",
                  boxShadow: isLit ? "0 0 12px 2px hsl(30 95% 55% / 0.55)" : "inset 0 1px 3px rgba(0,0,0,0.15)",
                }}
              >
                {isLit && (
                  <>
                    {/* Flame */}
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -top-2 w-1.5 h-3 rounded-full animate-flicker"
                      style={{
                        background: "radial-gradient(ellipse at 50% 100%, hsl(50 100% 65%) 0%, hsl(20 100% 55%) 60%, transparent 100%)",
                        filter: "blur(0.3px)",
                      }}
                      aria-hidden
                    />
                    {/* Wick base */}
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -top-0.5 w-0.5 h-1 bg-black/70 rounded"
                      aria-hidden
                    />
                  </>
                )}
              </div>
              <div className={`text-[9px] tabular-nums ${isToday ? "text-kumkum font-semibold" : "text-muted-foreground"}`}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-foreground/70 italic">
        {L.note}
      </div>
    </section>
  );
}
