import React, { useEffect, useMemo, useRef, useState } from "react";
import { Flame, RotateCw, RotateCcw, Trash2, Bell, BellOff, Mic, MicOff } from "lucide-react";
import { useApp } from "@/context/AppContext";

const KEY_TODAY = "dj_prad_today"; // { date: 'YYYY-MM-DD', count: n }
const KEY_LIFE  = "dj_prad_life";
const KEY_BELL  = "dj_prad_bell";
const KEY_MANTRA = "dj_prad_mantra";
const KEY_DAYS  = "dj_prad_days";  // { "YYYY-MM-DD": true } — read by PradakshinaStreak

// Synthesize a warm temple-bell chime with the Web Audio API.
// No network fetch, no CORS issues, works everywhere.
function playBellChime(ctx, when = 0, opts = {}) {
  const master = ctx.createGain();
  master.gain.value = opts.volume ?? 0.35;
  master.connect(ctx.destination);
  const now = ctx.currentTime + when;
  // Harmonic partials for a metallic bell timbre (base + fifth + octave + double-octave)
  const partials = [
    { f: 523.25, g: 0.9, decay: 1.6 },  // C5 fundamental
    { f: 659.25, g: 0.55, decay: 1.3 }, // E5
    { f: 987.77, g: 0.35, decay: 1.0 }, // B5 (perfect fifth-ish)
    { f: 1318.5, g: 0.22, decay: 0.7 }, // E6
    { f: 2093.0, g: 0.12, decay: 0.5 }, // C7 sparkle
  ];
  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = p.f;
    // Slight inharmonic detune for realism
    osc.detune.value = (Math.random() - 0.5) * 4;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(p.g, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + p.decay + 0.05);
  });
  // Also add a very quick low-freq strike thump
  const thump = ctx.createOscillator();
  const tg = ctx.createGain();
  thump.type = "sine";
  thump.frequency.setValueAtTime(180, now);
  thump.frequency.exponentialRampToValueAtTime(80, now + 0.12);
  tg.gain.setValueAtTime(0.35, now);
  tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  thump.connect(tg).connect(master);
  thump.start(now);
  thump.stop(now + 0.2);
}

function speakMantra(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    // Cancel any queued utterance so rapid taps don't back up
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 0.9;
    u.volume = 0.55;
    // Prefer an Indian English or Hindi voice when available
    const voices = synth.getVoices?.() || [];
    const preferred = voices.find((v) => /hi|IN|Indian|Sanskrit/i.test(v.lang + " " + v.name));
    if (preferred) u.voice = preferred;
    synth.speak(u);
  } catch {}
}

// A small, satisfying tap-to-count pradakṣiṇā counter (target 108).
// - Persists today's count by date, resets when date changes
// - Tracks lifetime total across all days
// - Diya-glow flash + subtle haptic-like pulse on tap
// - Temple-bell chime + optional "Om Tulasyai Namaḥ" whisper
export default function PradakshinaCounter({ target = 108 }) {
  const { lang } = useApp();
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [count, setCount] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const [flash, setFlash] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bellOn, setBellOn] = useState(() => localStorage.getItem(KEY_BELL) !== "false");
  const [mantraOn, setMantraOn] = useState(() => localStorage.getItem(KEY_MANTRA) === "true");
  const flashTimer = useRef(null);
  const audioCtxRef = useRef(null);

  const ensureAudioCtx = () => {
    if (!audioCtxRef.current) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) audioCtxRef.current = new C();
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  // Load from LS on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_TODAY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.date === todayStr) setCount(p.count || 0);
      }
      setLifetime(parseInt(localStorage.getItem(KEY_LIFE) || "0", 10) || 0);
    } catch {}
  }, [todayStr]);

  // Persist
  useEffect(() => {
    localStorage.setItem(KEY_TODAY, JSON.stringify({ date: todayStr, count }));
  }, [todayStr, count]);
  useEffect(() => {
    localStorage.setItem(KEY_LIFE, String(lifetime));
  }, [lifetime]);
  useEffect(() => { localStorage.setItem(KEY_BELL, String(bellOn)); }, [bellOn]);
  useEffect(() => { localStorage.setItem(KEY_MANTRA, String(mantraOn)); }, [mantraOn]);

  const doIncrement = (delta = 1) => {
    setCount((c) => {
      const nx = Math.max(0, c + delta);
      if (delta > 0) setLifetime((l) => l + delta);
      if (nx === target) setCelebrate(true);
      // Auto-mark today as "108 complete" once the target is reached (so the streak lights up)
      if (nx >= target) {
        try {
          const raw = localStorage.getItem(KEY_DAYS);
          const map = raw ? JSON.parse(raw) : {};
          if (!map[todayStr]) {
            map[todayStr] = true;
            localStorage.setItem(KEY_DAYS, JSON.stringify(map));
          }
        } catch {}
      }
      // Play sounds on positive increment
      if (delta > 0) {
        if (bellOn) {
          const ctx = ensureAudioCtx();
          if (ctx) {
            // If crossing a milestone (27/54/81) or the final 108, play a double-strike
            if (nx === target || nx === 27 || nx === 54 || nx === 81) {
              playBellChime(ctx, 0, { volume: 0.5 });
              playBellChime(ctx, 0.28, { volume: 0.4 });
            } else {
              playBellChime(ctx, 0);
            }
          }
        }
        if (mantraOn) speakMantra("Om Tulasyai Namaha");
      }
      return nx;
    });
    if (delta > 0) {
      setFlash(true);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 550);
      try { navigator.vibrate?.(15); } catch {}
    }
  };

  const reset = () => {
    if (window.confirm(lang === "te" ? "నేటి లెక్క రీసెట్ చేయాలా?" : "Reset today's count?")) {
      setCount(0);
      setCelebrate(false);
    }
  };

  const progress = Math.min(1, count / target);
  const strokeDash = 2 * Math.PI * 92;

  const labels = {
    en: { title: "Kārtika Pradakṣiṇā Counter", tap: "Tap to count", today: "Today", life: "Lifetime", complete: "108 Complete! 🌿", of: "of", back: "-1" },
    te: { title: "కార్తీక ప్రదక్షిణ లెక్క", tap: "ప్రదక్షిణ చేయడానికి తాకండి", today: "నేడు", life: "మొత్తం", complete: "108 పూర్తి! 🌿", of: "లో", back: "-1" },
    hi: { title: "कार्तिक प्रदक्षिणा गिनती", tap: "प्रदक्षिणा हेतु स्पर्श करें", today: "आज", life: "कुल", complete: "108 पूर्ण! 🌿", of: "में से", back: "-1" },
    ta: { title: "கார்த்திகை ப்ரதக்ஷிண எண்ணிக்கை", tap: "ப்ரதக்ஷிணத்திற்கு தட்டவும்", today: "இன்று", life: "மொத்தம்", complete: "108 முடிந்தது! 🌿", of: "இல்", back: "-1" },
  };
  const L = labels[lang] || labels.en;

  return (
    <section
      data-testid="pradakshina-counter"
      className="sacred-card grain relative overflow-hidden"
    >
      {/* Ambient flash overlay */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${flash ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "radial-gradient(circle at 50% 45%, hsl(30 95% 60% / 0.55), hsl(43 90% 55% / 0.3) 40%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex items-center gap-2 mb-3">
        <Flame className={`w-5 h-5 text-saffron ${flash ? "animate-flicker" : ""}`} />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{L.title}</h3>
      </div>

      <div className="relative grid sm:grid-cols-[220px,1fr] gap-6 items-center">
        {/* Circular progress + big count */}
        <button
          onClick={() => doIncrement(1)}
          data-testid="pradakshina-tap"
          className={`relative mx-auto w-56 h-56 rounded-full grid place-items-center select-none active:scale-95 transition-transform duration-150 ${
            celebrate ? "diya-glow-strong" : "diya-glow"
          }`}
          style={{
            background:
              "radial-gradient(circle at 50% 45%, hsl(38 60% 96%) 0%, hsl(40 55% 92%) 55%, hsl(40 60% 82%) 100%)",
          }}
          aria-label="Tap to count one pradakshina"
        >
          {/* Progress ring */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="92" fill="none" stroke="hsl(var(--gold) / 0.2)" strokeWidth="6" />
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="url(#pradGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDash}
              strokeDashoffset={strokeDash * (1 - progress)}
              style={{ transition: "stroke-dashoffset 0.4s ease-out" }}
            />
            <defs>
              <linearGradient id="pradGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(0 65% 42%)" />
                <stop offset="100%" stopColor="hsl(30 95% 55%)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative flex flex-col items-center">
            <div className="text-6xl font-display text-kumkum leading-none tabular-nums">{count}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {L.of} {target}
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-widest text-saffron/80">{L.tap}</div>
          </div>
        </button>

        {/* Side info + actions */}
        <div className="space-y-4">
          {celebrate ? (
            <div className="rounded-xl p-4 bg-gradient-to-r from-[hsl(120,45%,35%)]/15 to-[hsl(43,74%,60%)]/15 border border-[hsl(120,45%,35%)]/40">
              <div className="text-lg font-display text-[hsl(120,55%,25%)]">{L.complete}</div>
              <div className="text-xs text-foreground/70 mt-1">
                Śrī Tulasī Kṛṣṇa preyasī namoʼstu
              </div>
            </div>
          ) : (
            <div className="text-sm text-foreground/70 leading-relaxed">
              {lang === "te"
                ? "కార్తీక మాసంలో తులసి కోట చుట్టూ 108 ప్రదక్షిణలు చేస్తే విశేష ఫలం. ప్రతి ప్రదక్షిణకు మధ్యలో ఉన్న వృత్తాన్ని తాకండి."
                : lang === "hi"
                ? "कार्तिक मास में तुलसी क्यारी के १०८ प्रदक्षिणा से विशेष फल। हर प्रदक्षिणा पर मध्य वृत्त को स्पर्श करें।"
                : lang === "ta"
                ? "கார்த்திகை மாதத்தில் துளசி மாடம் சுற்றி 108 ப்ரதக்ஷிணம் மிக்க பலன். ஒவ்வொரு சுற்றுக்கும் நடு வட்டத்தை தட்டவும்."
                : "In Kārtika māsa, 108 pradakṣiṇā around the Tulasi are especially meritorious. Tap the centre for each round you complete."}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 bg-[hsl(var(--gold)/0.08)] gold-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.today}</div>
              <div className="text-2xl font-display text-kumkum dark:text-[hsl(var(--gold))] tabular-nums">
                {count}
              </div>
            </div>
            <div className="rounded-xl p-3 bg-[hsl(var(--gold)/0.08)] gold-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.life}</div>
              <div className="text-2xl font-display text-kumkum dark:text-[hsl(var(--gold))] tabular-nums">
                {lifetime}
              </div>
            </div>
          </div>

          {/* Milestone dots */}
          <div className="flex items-center gap-2" aria-label="Milestones 27 · 54 · 81 · 108">
            {[27, 54, 81, 108].map((m) => (
              <div key={m} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    count >= m ? "bg-gradient-to-r from-kumkum to-saffron" : "bg-[hsl(var(--gold)/0.2)]"
                  }`}
                  style={{ background: count >= m ? "linear-gradient(90deg, hsl(0 65% 40%), hsl(30 95% 55%))" : undefined }}
                />
                <div className="mt-1 text-[10px] text-center text-muted-foreground tabular-nums">{m}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBellOn((v) => !v)}
              data-testid="pradakshina-bell-toggle"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition border ${
                bellOn
                  ? "bg-[hsl(var(--gold)/0.2)] border-[hsl(var(--gold))] text-kumkum dark:text-[hsl(var(--gold))]"
                  : "gold-border hover:bg-[hsl(var(--gold)/0.1)]"
              }`}
              aria-pressed={bellOn}
              title={bellOn ? "Bell chime on" : "Bell chime off"}
            >
              {bellOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              Bell
            </button>
            <button
              onClick={() => setMantraOn((v) => !v)}
              data-testid="pradakshina-mantra-toggle"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition border ${
                mantraOn
                  ? "bg-[hsl(var(--gold)/0.2)] border-[hsl(var(--gold))] text-kumkum dark:text-[hsl(var(--gold))]"
                  : "gold-border hover:bg-[hsl(var(--gold)/0.1)]"
              }`}
              aria-pressed={mantraOn}
              title={mantraOn ? "Mantra whisper on" : "Mantra whisper off"}
            >
              {mantraOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              Mantra
            </button>
            <button
              onClick={() => doIncrement(-1)}
              data-testid="pradakshina-back"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)]"
              aria-label="Decrement"
              disabled={count === 0}
            >
              <RotateCcw className="w-3.5 h-3.5" /> {L.back}
            </button>
            <button
              onClick={reset}
              data-testid="pradakshina-reset"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--kumkum)/0.15)]"
              aria-label="Reset today's count"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
