import React, { useEffect, useMemo, useState } from "react";
import { Bell, BellRing, Loader2, Sparkles } from "lucide-react";
import { FESTIVALS } from "@/data/festivals";

const PREF_KEY = "dj_festival_notify_v1";
const SCHED_KEY = "dj_festival_scheduled_v1";

const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch { return {}; } };
const savePrefs = (p) => localStorage.setItem(PREF_KEY, JSON.stringify(p));

// Schedule OS notif via SW
const scheduleSw = (title, body, delayMs, tag, url = "/festivals") => {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({ type: "schedule-notification", title, body, delayMs, tag, url });
  }).catch(() => {});
};

/**
 * Upcoming festivals in next `days` days.
 * Returns [{festival, when, dayDiff}] sorted ascending.
 */
const upcomingFestivals = (days = 60) => {
  const today = new Date();
  const items = [];
  for (const f of FESTIVALS) {
    // Try this year and next year
    for (const yOffset of [0, 1]) {
      const y = today.getFullYear() + yOffset;
      const d = new Date(y, f.month - 1, f.day, 18, 0, 0); // 6 PM the day before is handled below
      const dayDiff = Math.floor((d - today) / (86400 * 1000));
      if (dayDiff >= 0 && dayDiff <= days) {
        items.push({ festival: f, when: d, dayDiff });
        break;
      }
    }
  }
  return items.sort((a, b) => a.when - b.when);
};

export default function FestivalPushOptIn() {
  const [prefs, setPrefs] = useState(() => ({ enabled: false, ...loadPrefs() }));
  const [notifStatus, setNotifStatus] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const upcoming = useMemo(() => upcomingFestivals(60), []);

  useEffect(() => savePrefs(prefs), [prefs]);

  // Schedule upcoming festival notifications the evening before each
  useEffect(() => {
    if (!prefs.enabled || notifStatus !== "granted" || !("serviceWorker" in navigator)) return;
    const today = new Date().toISOString().slice(0, 10);
    let sched = {};
    try { sched = JSON.parse(localStorage.getItem(SCHED_KEY) || "{}"); } catch {}
    if (sched.date !== today) sched = { date: today, tags: {} };

    const now = Date.now();
    upcoming.forEach(({ festival: f, when }) => {
      // Fire at 6 PM the evening BEFORE the festival
      const target = new Date(when); target.setDate(target.getDate() - 1); target.setHours(18, 0, 0, 0);
      const delay = target - now;
      const tag = `${today}::fest::${f.id}`;
      if (delay > 0 && delay <= 24 * 3600 * 1000 && !sched.tags[tag]) {
        const enName = f.name?.en || f.id;
        const body = `${enName} is tomorrow. Deity: ${f.deity}. Tap for story, vidhi and mantras.`;
        scheduleSw(`Festival Tomorrow — ${enName}`, body, delay, tag, `/festivals#${f.id}`);
        sched.tags[tag] = 1;
      }
    });
    try { localStorage.setItem(SCHED_KEY, JSON.stringify(sched)); } catch {}
  }, [prefs.enabled, notifStatus, upcoming]);

  const requestPerm = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const p = await Notification.requestPermission();
      setNotifStatus(p);
      if (p === "granted") setPrefs((s) => ({ ...s, enabled: true }));
    } catch (e) {}
  };

  const testNotify = () => {
    if (notifStatus !== "granted" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage({
        type: "show-notification",
        title: "Festival test — Devine Intelligence",
        body: "Great — festival reminders will fire the evening before each major festival.",
        tag: "fest-test",
        url: "/festivals",
      });
    });
  };

  return (
    <section className="sacred-card grain" data-testid="festival-push">
      <div className="flex items-center gap-2 mb-3">
        <BellRing className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Festival Reminders</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Get an OS notification at 6 PM the evening before every major festival, with the story, vidhi and mantras a tap away.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {notifStatus === "granted" ? (
          <label className="inline-flex items-center gap-2 text-xs rounded-full px-3 py-1.5 gold-border bg-emerald-500/10 text-emerald-700">
            <input
              type="checkbox" checked={!!prefs.enabled}
              onChange={(e) => setPrefs((s) => ({ ...s, enabled: e.target.checked }))}
              data-testid="festival-notify-toggle"
            />
            Festival reminders enabled
          </label>
        ) : notifStatus === "denied" ? (
          <span className="text-[11px] text-red-600" data-testid="festival-notify-blocked">Notifications blocked in browser settings</span>
        ) : (
          <button
            onClick={requestPerm}
            data-testid="festival-notify-enable"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90"
          >
            <Bell className="w-3.5 h-3.5" /> Enable festival reminders
          </button>
        )}
        {notifStatus === "granted" && (
          <button
            onClick={testNotify}
            data-testid="festival-notify-test"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Send test
          </button>
        )}
      </div>

      {/* Upcoming preview */}
      {upcoming.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {upcoming.slice(0, 6).map(({ festival: f, dayDiff }) => (
            <a
              key={f.id}
              href={`/festivals#${f.id}`}
              data-testid={`festival-upcoming-${f.id}`}
              className="block rounded-lg p-3 gold-border hover:bg-[hsl(var(--gold)/0.08)] transition"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">In {dayDiff} day{dayDiff === 1 ? "" : "s"}</div>
              <div className="text-sm font-medium mt-0.5">{f.name?.en || f.id}</div>
              <div className="text-[11px] text-muted-foreground">{f.deity}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
