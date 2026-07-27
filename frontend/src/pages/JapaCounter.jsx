import React, { useEffect, useMemo, useRef, useState } from "react";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang } from "@/lib/i18n";
import NamaCertificate from "@/components/NamaCertificate";
import PageHero from "@/components/PageHero";
import { RotateCcw, Volume2, VolumeX, Sparkles, ChevronDown } from "lucide-react";

const TARGET = 10000116; // 1 crore + 116 (1,00,00,116)
const MILESTONES = [108, 1008, 10008, 100000, 1000000, 10000000, TARGET];
const KEY_JAPA = "dj_japa_counts";       // { [deityId]: totalCount }
const KEY_DEITY = "dj_japa_deity";
const KEY_BELL = "dj_japa_bell";

const loadCounts = () => { try { return JSON.parse(localStorage.getItem(KEY_JAPA) || "{}"); } catch { return {}; } };
const saveCounts = (o) => localStorage.setItem(KEY_JAPA, JSON.stringify(o));

// Tiny bell chime using WebAudio (no external file needed)
function playBell(volume = 0.35) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.7);
    setTimeout(() => ctx.close(), 900);
  } catch { /* ignore */ }
}

const fmt = (n) => n.toLocaleString("en-IN");

export default function JapaCounter() {
  const { lang } = useApp();
  const [counts, setCounts] = useState(loadCounts);
  const [selectedId, setSelectedId] = useState(() => localStorage.getItem(KEY_DEITY) || DEITIES[0].id);
  const [bell, setBell] = useState(() => localStorage.getItem(KEY_BELL) !== "false");
  const [flash, setFlash] = useState(false);
  const [milestone, setMilestone] = useState(null);
  const lastTapRef = useRef(0);

  const deity = useMemo(() => DEITIES.find((d) => d.id === selectedId) || DEITIES[0], [selectedId]);
  const count = counts[selectedId] || 0;
  const nextMilestone = MILESTONES.find((m) => m > count) || TARGET;
  const prevMilestone = [...MILESTONES].reverse().find((m) => m <= count) || 0;
  const tierPct = ((count - prevMilestone) / Math.max(1, nextMilestone - prevMilestone)) * 100;
  const overallPct = Math.min(100, (count / TARGET) * 100);
  const unlocked = count >= TARGET;
  const round108 = Math.floor(count / 108);
  const inRound = count % 108;

  useEffect(() => saveCounts(counts), [counts]);
  useEffect(() => { localStorage.setItem(KEY_DEITY, selectedId); }, [selectedId]);
  useEffect(() => { localStorage.setItem(KEY_BELL, String(bell)); }, [bell]);

  const tap = () => {
    // Debounce ultra-fast taps to prevent accidental double count from touch devices
    const now = Date.now();
    if (now - lastTapRef.current < 60) return;
    lastTapRef.current = now;

    const newCount = count + 1;
    setCounts((prev) => ({ ...prev, [selectedId]: newCount }));
    setFlash(true);
    setTimeout(() => setFlash(false), 180);

    if (bell) {
      // Louder bell every 108, subtle click otherwise
      if (newCount % 108 === 0) playBell(0.5);
      else if (newCount % 27 === 0) playBell(0.28);
    }

    if (MILESTONES.includes(newCount)) {
      setMilestone(newCount);
      setTimeout(() => setMilestone(null), 3500);
      if (bell) playBell(0.6);
    }
  };

  const reset = () => {
    if (!window.confirm("Reset your japa count for this deity? This cannot be undone.")) return;
    setCounts((prev) => ({ ...prev, [selectedId]: 0 }));
  };

  const undo = () => {
    if (count <= 0) return;
    setCounts((prev) => ({ ...prev, [selectedId]: Math.max(0, (prev[selectedId] || 0) - 1) }));
  };

  const totalAll = Object.values(counts).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="space-y-8" data-testid="japa-counter-page">
      <PageHero
        bannerId="japa"
        eyebrow="Nāma Japa Sādhanā"
        title="Japa Counter"
        sanskritTitle="जप"
        subtitle="Chant your beloved deity's bīja mantra. Every tap counts one japa — complete the sacred sādhanā of 1,00,00,116 recitations and receive a divine certificate."
      />

      {/* Deity Selector */}
      <section className="sacred-card grain">
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Choose your Iṣṭa Devatā</label>
        <div className="relative">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            data-testid="japa-deity-select"
            className="w-full appearance-none rounded-lg pl-3 pr-9 py-2.5 gold-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
          >
            {DEITIES.map((d) => (
              <option key={d.id} value={d.id}>
                {pickLang(d.name, "en")} — {pickLang(d.name, "sa")}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.05)]">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bīja / Mūla Mantra</div>
            <div className="mt-1 font-devanagari text-2xl text-kumkum dark:text-[hsl(var(--gold))] leading-snug">
              {deity.mula_mantra.sa}
            </div>
            <div className="text-xs italic mt-1 text-foreground/80">{deity.mula_mantra.en}</div>
          </div>
          <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.05)]">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Meaning</div>
            <div className="mt-1 text-sm text-foreground/85">{pickLang(deity.mula_mantra.meaning, lang)}</div>
          </div>
        </div>
      </section>

      {/* Milestone flash */}
      {milestone && (
        <div
          data-testid="japa-milestone-toast"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow-strong animate-rise"
        >
          <Sparkles className="inline w-4 h-4 mr-2" />
          {milestone.toLocaleString("en-IN")} japa completed! 🎉
        </div>
      )}

      {/* Big Counter */}
      <section
        className="sacred-card grain relative overflow-hidden text-center"
        style={{ background: `radial-gradient(ellipse at top, ${deity.color}22 0%, transparent 60%)` }}
      >
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Count</div>
        <div className="mt-1 flex items-baseline justify-center gap-3 flex-wrap">
          <div
            data-testid="japa-count-display"
            className={`font-display text-6xl sm:text-7xl font-semibold text-kumkum dark:text-[hsl(var(--gold))] transition-transform ${flash ? "scale-110" : ""}`}
            style={{ textShadow: `0 0 24px ${deity.color}44` }}
          >
            {fmt(count)}
          </div>
          <div className="text-sm text-muted-foreground">/ {fmt(TARGET)}</div>
        </div>

        {/* Round of 108 */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span>Rounds of 108: <b className="text-foreground">{fmt(round108)}</b></span>
          <span>•</span>
          <span>In current round: <b className="text-foreground">{inRound}/108</b></span>
        </div>

        {/* Overall progress */}
        <div className="mt-4 max-w-xl mx-auto">
          <div className="h-2 w-full rounded-full bg-[hsl(var(--gold)/0.15)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--saffron))] transition-all"
                 style={{ width: `${Math.max(0.5, overallPct)}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {overallPct.toFixed(overallPct < 0.01 ? 6 : 4)}% overall • Next milestone: <b>{fmt(nextMilestone)}</b>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-[hsl(var(--saffron)/0.15)] overflow-hidden">
            <div className="h-full bg-[hsl(var(--saffron))] transition-all" style={{ width: `${Math.min(100, tierPct)}%` }} />
          </div>
        </div>

        {/* Tap Button */}
        <button
          onClick={tap}
          data-testid="japa-tap-btn"
          aria-label="Tap to count one japa"
          className="mt-8 w-40 h-40 sm:w-48 sm:h-48 rounded-full grid place-items-center bg-gradient-to-br from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow-strong hover:scale-105 active:scale-95 transition-transform mx-auto select-none"
          style={{ boxShadow: `0 0 40px ${deity.color}66, 0 0 80px ${deity.color}33` }}
        >
          <div className="font-devanagari text-6xl leading-none animate-flicker">ॐ</div>
        </button>
        <div className="mt-3 text-xs text-muted-foreground">Tap the Om to count one recitation</div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={undo}
            data-testid="japa-undo-btn"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo last
          </button>
          <button
            onClick={() => setBell((b) => !b)}
            data-testid="japa-bell-toggle"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] transition"
          >
            {bell ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />} Bell chime {bell ? "on" : "off"}
          </button>
          <button
            onClick={reset}
            data-testid="japa-reset-btn"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs text-red-700 border border-red-500/40 hover:bg-red-500/10 transition"
          >
            Reset this deity
          </button>
        </div>
      </section>

      {/* Milestone Ladder */}
      <section className="sacred-card grain">
        <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Milestones</h3>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {MILESTONES.map((m) => {
            const done = count >= m;
            return (
              <div
                key={m}
                data-testid={`japa-milestone-${m}`}
                className={`rounded-lg p-2 text-center gold-border transition ${done ? "bg-[hsl(var(--gold)/0.15)] text-kumkum dark:text-[hsl(var(--gold))]" : "opacity-60"}`}
              >
                <div className="font-devanagari text-base">{done ? "✓" : "○"}</div>
                <div className="mt-0.5">{fmt(m)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate */}
      <NamaCertificate
        unlocked={unlocked}
        count={count}
        target={TARGET}
        sadhanaTitle={`${pickLang(deity.name, "en")} Nāma Japa`}
        sadhanaSub={`${fmt(TARGET)} × ${pickLang(deity.name, "sa")} bīja mantra`}
        achievement={`${fmt(TARGET)} recitations of ${deity.mula_mantra.en}`}
        accent={deity.color}
        signature={`By the grace of ${pickLang(deity.name, "en")}`}
        testIdPrefix="japa-cert"
        extraDetail={`Bīja: ${deity.mula_mantra.sa}`}
      />

      {/* Cross-deity totals */}
      {totalAll > 0 && (
        <section className="sacred-card grain">
          <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">All Deities Progress</h3>
          <div className="mt-3 space-y-2">
            {Object.entries(counts)
              .filter(([, v]) => v > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([id, v]) => {
                const d = DEITIES.find((x) => x.id === id);
                if (!d) return null;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <div className="flex-1 min-w-0 truncate">{pickLang(d.name, lang)}</div>
                    <div className="text-sm font-medium">{fmt(v)}</div>
                  </div>
                );
              })}
            <div className="pt-2 mt-2 border-t border-[hsl(var(--gold)/0.25)] flex items-center gap-3">
              <div className="font-medium">Grand Total</div>
              <div className="flex-1" />
              <div className="text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{fmt(totalAll)}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
