import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Bell, BellOff, Music2, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { BACKGROUND_CHANTS } from "@/data/deities";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PREF_KEY = "dj_alarm_prefs_v1";
const FIRED_KEY = "dj_alarm_fired_v1";

const DEFAULT_PREFS = {
  enabled: { brahma_muhurta: true, abhijit_muhurta: true, amrita_kala: true, rahu_kala: true, yama_ganda: true, gulika_kala: false, durmuhurta: false },
  ringtoneId: "om",              // one of BACKGROUND_CHANTS ids
  leadMinutes: 0,                // 0 = fire at start; user can pick 5, 10, 30
  ringSeconds: 25,               // how long the alarm plays
  vibrate: true,
};

const loadPrefs = () => {
  try { return { ...DEFAULT_PREFS, ...(JSON.parse(localStorage.getItem(PREF_KEY) || "{}")) }; }
  catch { return { ...DEFAULT_PREFS }; }
};
const savePrefs = (p) => localStorage.setItem(PREF_KEY, JSON.stringify(p));

const loadFired = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(FIRED_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    return raw.date === today ? raw : { date: today, keys: {} };
  } catch { return { date: new Date().toISOString().slice(0, 10), keys: {} }; }
};
const saveFired = (v) => localStorage.setItem(FIRED_KEY, JSON.stringify(v));

const parseHM = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
const nowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

export default function MuhurtaAlarm() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [timings, setTimings] = useState(null);
  const [ringing, setRinging] = useState(null); // { key, timing }
  const [openConfig, setOpenConfig] = useState(false);
  const audioRef = useRef(null);
  const ringStopRef = useRef(null);

  // Fetch today's timings once
  useEffect(() => {
    axios.get(`${API}/panchangam/timings`).then((r) => setTimings(r.data.timings)).catch(() => {});
  }, []);

  useEffect(() => savePrefs(prefs), [prefs]);

  // Ringtone URL
  const ringtoneUrl = useMemo(() => {
    const c = BACKGROUND_CHANTS.find((c) => c.id === prefs.ringtoneId);
    return c?.url || BACKGROUND_CHANTS[0]?.url;
  }, [prefs.ringtoneId]);

  // Poll for scheduled fires — every 15s
  useEffect(() => {
    if (!timings) return;
    const tick = () => {
      const cur = nowMinutes();
      const fired = loadFired();
      Object.entries(timings).forEach(([key, t]) => {
        if (!prefs.enabled[key]) return;
        const target = parseHM(t.start) - (prefs.leadMinutes || 0);
        // window is [target, target+2) to avoid missing during slow poll
        if (cur >= target && cur < target + 2 && !fired.keys[key]) {
          fired.keys[key] = Date.now();
          saveFired(fired);
          triggerAlarm(key, t);
        }
      });
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [timings, prefs]);

  const triggerAlarm = (key, t) => {
    setRinging({ key, timing: t });
    // Play ringtone
    try {
      const a = new Audio(ringtoneUrl);
      a.loop = true; a.volume = 0.85;
      audioRef.current = a;
      a.play().catch(() => {});
    } catch (e) {}
    // Vibrate
    if (prefs.vibrate && "vibrate" in navigator) navigator.vibrate([500, 250, 500, 250, 800]);
    // Auto-stop
    ringStopRef.current = setTimeout(() => stopAlarm(), (prefs.ringSeconds || 25) * 1000);
  };

  const stopAlarm = () => {
    if (audioRef.current) { try { audioRef.current.pause(); audioRef.current.currentTime = 0; } catch (e) {} audioRef.current = null; }
    if (ringStopRef.current) { clearTimeout(ringStopRef.current); ringStopRef.current = null; }
    setRinging(null);
    if ("vibrate" in navigator) navigator.vibrate(0);
  };

  const toggle = (key) => setPrefs((p) => ({ ...p, enabled: { ...p.enabled, [key]: !p.enabled[key] } }));

  const testFire = () => {
    const anyKey = Object.keys(prefs.enabled).find((k) => prefs.enabled[k]) || "brahma_muhurta";
    triggerAlarm(anyKey, timings?.[anyKey] || { label: "Test Muhurta", type: "auspicious", start: "00:00", end: "00:05" });
  };

  return (
    <section className="sacred-card grain" data-testid="muhurta-alarm">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Muhūrta Alarms</h3>
        <span className="ml-auto flex items-center gap-2">
          <button
            data-testid="alarm-test-btn"
            onClick={testFire}
            className="text-[11px] rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]"
          >Test now</button>
          <button
            data-testid="alarm-config-toggle"
            onClick={() => setOpenConfig((v) => !v)}
            className="text-[11px] rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]"
          >{openConfig ? "Hide" : "Configure"}</button>
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Ring an in-app devotional alarm at every muhūrta boundary. Keep this page open in a tab.
      </p>

      <div className="flex flex-wrap gap-2">
        {timings && Object.entries(timings).map(([key, t]) => {
          const on = !!prefs.enabled[key];
          const aus = t.type === "auspicious";
          return (
            <button
              key={key}
              data-testid={`alarm-toggle-${key}`}
              onClick={() => toggle(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border transition ${on ? "bg-[hsl(var(--gold)/0.18)] text-kumkum dark:text-[hsl(var(--gold))]" : "opacity-60 hover:opacity-100"}`}
            >
              {on ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              <span>{t.label}</span>
              <span className="text-[10px] text-muted-foreground">{t.start}</span>
              {aus ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-red-500" />}
            </button>
          );
        })}
      </div>

      {openConfig && (
        <div className="mt-4 grid sm:grid-cols-3 gap-3 rounded-xl p-3 gold-border bg-[hsl(var(--gold)/0.04)]">
          <label className="text-xs">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Ringtone</div>
            <select
              value={prefs.ringtoneId}
              onChange={(e) => setPrefs({ ...prefs, ringtoneId: e.target.value })}
              data-testid="alarm-ringtone"
              className="w-full rounded-lg px-2 py-1.5 gold-border bg-card text-sm"
            >
              {BACKGROUND_CHANTS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="text-xs">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Lead time</div>
            <select
              value={prefs.leadMinutes}
              onChange={(e) => setPrefs({ ...prefs, leadMinutes: parseInt(e.target.value, 10) })}
              data-testid="alarm-lead"
              className="w-full rounded-lg px-2 py-1.5 gold-border bg-card text-sm"
            >
              <option value={0}>At start</option>
              <option value={5}>5 min before</option>
              <option value={10}>10 min before</option>
              <option value={30}>30 min before</option>
            </select>
          </label>
          <label className="text-xs">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Ring duration</div>
            <select
              value={prefs.ringSeconds}
              onChange={(e) => setPrefs({ ...prefs, ringSeconds: parseInt(e.target.value, 10) })}
              data-testid="alarm-duration"
              className="w-full rounded-lg px-2 py-1.5 gold-border bg-card text-sm"
            >
              <option value={10}>10 s</option>
              <option value={25}>25 s</option>
              <option value={60}>1 min</option>
              <option value={180}>3 min</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2 text-xs sm:col-span-3">
            <input
              type="checkbox" checked={prefs.vibrate}
              onChange={(e) => setPrefs({ ...prefs, vibrate: e.target.checked })}
              data-testid="alarm-vibrate"
            />
            Vibrate (mobile)
          </label>
        </div>
      )}

      {/* Overlay */}
      {ringing && (
        <div
          data-testid="alarm-overlay"
          className="fixed inset-0 grid place-items-center bg-black/70 backdrop-blur-sm animate-fade-in"
          style={{ zIndex: 100, paddingBottom: "120px" }}
        >
          <div className="relative max-w-md mx-4 rounded-3xl p-6 sm:p-8 gold-border diya-glow-strong text-center"
               style={{ background: "linear-gradient(135deg, hsl(30 40% 12%), hsl(35 45% 8%))" }}>
            <button
              onClick={stopAlarm}
              data-testid="alarm-dismiss"
              className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full gold-border text-white hover:bg-white/10"
              aria-label="Stop alarm"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mx-auto w-20 h-20 rounded-full grid place-items-center mb-4 bg-gradient-to-br from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] diya-glow animate-flicker">
              <Bell className="w-9 h-9 text-white" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Muhūrta Alarm</div>
            <h4 className="mt-1 font-display text-3xl text-gold-shimmer" style={{ letterSpacing: "0.04em" }}>
              {ringing.timing.label}
            </h4>
            <div className="mt-2 text-sm text-[hsl(45_100%_92%)]/90">
              {ringing.timing.start} — {ringing.timing.end}
              <span className="mx-2 text-[hsl(var(--gold))]">•</span>
              {ringing.timing.type === "auspicious" ? "Auspicious — great for new work" : "Inauspicious — avoid new work"}
            </div>
            <div className="font-devanagari text-2xl mt-4 text-[hsl(var(--gold))]">॥ ॐ ॥</div>
            <button
              onClick={stopAlarm}
              data-testid="alarm-ok-btn"
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white font-medium hover:opacity-90"
            >
              <Music2 className="w-4 h-4" /> Silence
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
