import React, { useEffect, useRef, useState } from "react";
import { Flame, Play, Pause, RotateCcw, Bell, Sunrise, Sunset } from "lucide-react";

const PREF_KEY = "dj_aarti_prefs_v1";

const PRESETS = [
  { id: "morning",  label: "Morning Aarti", icon: Sunrise, minutes: 5, bellSec: 4,  desc: "Prātaḥ ārati — with soft bell every 4s" },
  { id: "evening",  label: "Evening Aarti", icon: Sunset,  minutes: 7, bellSec: 6,  desc: "Sāyaṁ ārati — with slow bell every 6s" },
  { id: "quick",    label: "Quick Diya",    icon: Flame,   minutes: 3, bellSec: 3,  desc: "3-minute focus with rapid bell" },
];

const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch { return {}; } };

// Web Audio bell — synthesised so no network needed & works offline
const playBell = (audioCtx, gainNode, volume = 0.4) => {
  const now = audioCtx.currentTime;
  const strike = audioCtx.createOscillator();
  const strikeGain = audioCtx.createGain();
  strike.type = "sine";
  strike.frequency.setValueAtTime(880, now);
  strike.frequency.exponentialRampToValueAtTime(440, now + 0.6);
  strikeGain.gain.setValueAtTime(volume, now);
  strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
  strike.connect(strikeGain).connect(gainNode);
  strike.start(now); strike.stop(now + 1.5);

  const overtone = audioCtx.createOscillator();
  const oGain = audioCtx.createGain();
  overtone.type = "sine";
  overtone.frequency.setValueAtTime(1760, now);
  overtone.frequency.exponentialRampToValueAtTime(880, now + 0.5);
  oGain.gain.setValueAtTime(volume * 0.3, now);
  oGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
  overtone.connect(oGain).connect(gainNode);
  overtone.start(now); overtone.stop(now + 1.2);
};

export default function AartiTimer() {
  const [prefs, setPrefs] = useState(() => ({ presetId: "morning", volume: 0.4, ...loadPrefs() }));
  const preset = PRESETS.find((p) => p.id === prefs.presetId) || PRESETS[0];
  const [remaining, setRemaining] = useState(preset.minutes * 60);
  const [running, setRunning] = useState(false);
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const tickRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => { localStorage.setItem(PREF_KEY, JSON.stringify({ presetId: prefs.presetId, volume: prefs.volume })); }, [prefs]);

  // reset timer when preset changes
  useEffect(() => { setRemaining(preset.minutes * 60); setRunning(false); }, [preset.id, preset.minutes]);

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (bellRef.current) clearInterval(bellRef.current);
    if (audioCtxRef.current) try { audioCtxRef.current.close(); } catch {}
  }, []);

  const start = () => {
    if (running) return;
    // Init audio context on user gesture
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AC();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.gain.value = prefs.volume;
      gainRef.current.connect(audioCtxRef.current.destination);
    } else {
      audioCtxRef.current.resume?.();
    }
    setRunning(true);
    playBell(audioCtxRef.current, gainRef.current, prefs.volume);
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { stop(true); return 0; }
        return r - 1;
      });
    }, 1000);
    bellRef.current = setInterval(() => {
      playBell(audioCtxRef.current, gainRef.current, prefs.volume);
    }, preset.bellSec * 1000);
  };

  const stop = (completed = false) => {
    setRunning(false);
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    if (bellRef.current) { clearInterval(bellRef.current); bellRef.current = null; }
    if (completed && audioCtxRef.current && gainRef.current) {
      // final long bell
      playBell(audioCtxRef.current, gainRef.current, prefs.volume);
      setTimeout(() => playBell(audioCtxRef.current, gainRef.current, prefs.volume), 700);
      setTimeout(() => playBell(audioCtxRef.current, gainRef.current, prefs.volume), 1400);
    }
  };

  const reset = () => { stop(false); setRemaining(preset.minutes * 60); };

  const setVolume = (v) => {
    setPrefs((s) => ({ ...s, volume: v }));
    if (gainRef.current) gainRef.current.gain.value = v;
  };

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const total = preset.minutes * 60;
  const pct = ((total - remaining) / total) * 100;

  return (
    <section className="sacred-card grain relative overflow-hidden" data-testid="aarti-timer">
      <div className="flex items-center gap-2 mb-3">
        <Flame className={`w-5 h-5 text-saffron ${running ? "animate-flicker" : ""}`} />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Aarti Timer</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">{preset.desc}</span>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPrefs((s) => ({ ...s, presetId: p.id }))}
            data-testid={`aarti-preset-${p.id}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border transition ${
              prefs.presetId === p.id
                ? "bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow"
                : "hover:bg-[hsl(var(--gold)/0.1)]"
            }`}
          >
            <p.icon className="w-3.5 h-3.5" /> {p.label} • {p.minutes}m
          </button>
        ))}
      </div>

      {/* Diya + countdown */}
      <div className="grid sm:grid-cols-[10rem_1fr] gap-5 items-center">
        <div className="relative mx-auto sm:mx-0" style={{ width: 160, height: 200 }}>
          <svg viewBox="0 0 160 200" className="absolute inset-0">
            {/* Diya bowl */}
            <ellipse cx="80" cy="170" rx="55" ry="18" fill="hsl(30 60% 20%)" opacity="0.6" />
            <path d="M20 150 Q80 200 140 150 L130 130 Q80 145 30 130 Z" fill="url(#diya-grad)" stroke="hsl(30 90% 40%)" strokeWidth="1.5" />
            <defs>
              <linearGradient id="diya-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(25 90% 55%)" />
                <stop offset="100%" stopColor="hsl(20 80% 30%)" />
              </linearGradient>
              <radialGradient id="flame-grad" cx="50%" cy="60%" r="60%">
                <stop offset="0%" stopColor="hsl(50 100% 90%)" />
                <stop offset="45%" stopColor="hsl(35 100% 65%)" />
                <stop offset="100%" stopColor="hsl(15 90% 40% / 0)" />
              </radialGradient>
            </defs>
            {/* Wick */}
            <rect x="78" y="122" width="4" height="14" fill="hsl(20 20% 15%)" />
            {/* Flame */}
            {running && (
              <g className="animate-flicker" style={{ transformOrigin: "80px 130px" }}>
                <ellipse cx="80" cy="100" rx="18" ry="30" fill="url(#flame-grad)" />
                <ellipse cx="80" cy="105" rx="10" ry="18" fill="hsl(45 100% 88%)" opacity="0.9" />
                <ellipse cx="80" cy="115" rx="5" ry="9" fill="white" opacity="0.85" />
                {/* Halo glow */}
                <circle cx="80" cy="100" r="55" fill="url(#flame-grad)" opacity="0.35" />
              </g>
            )}
          </svg>
        </div>

        <div>
          <div className="font-display text-6xl sm:text-7xl tabular-nums text-kumkum dark:text-[hsl(var(--gold))] leading-none" data-testid="aarti-countdown">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full overflow-hidden bg-[hsl(var(--gold)/0.12)]">
            <div className="h-full bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {!running ? (
              <button onClick={start} data-testid="aarti-start"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow hover:opacity-90">
                <Play className="w-4 h-4" /> Start Aarti
              </button>
            ) : (
              <button onClick={() => stop(false)} data-testid="aarti-pause"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm gold-border hover:bg-[hsl(var(--gold)/0.12)]">
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}
            <button onClick={reset} data-testid="aarti-reset"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)]">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            {/* Volume */}
            <div className="flex items-center gap-2 text-xs ml-auto">
              <Bell className="w-3.5 h-3.5 text-saffron" />
              <input
                type="range" min="0" max="1" step="0.05" value={prefs.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                data-testid="aarti-volume"
                className="w-24 sm:w-32 accent-[hsl(var(--saffron))]"
                aria-label="Bell volume"
              />
              <span className="text-muted-foreground tabular-nums w-8">{Math.round(prefs.volume * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
