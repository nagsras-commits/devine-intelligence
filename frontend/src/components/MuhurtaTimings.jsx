import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sun, Moon, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Countdown helper — returns "in 1h 23m" or "12m ago" etc.
const relativeTo = (target) => {
  const now = new Date();
  const [h, m] = target.split(":").map(Number);
  const t = new Date(now);
  t.setHours(h, m, 0, 0);
  const diff = (t - now) / 60000; // minutes
  const abs = Math.abs(diff);
  const h_ = Math.floor(abs / 60), m_ = Math.round(abs % 60);
  const label = h_ > 0 ? `${h_}h ${m_}m` : `${m_}m`;
  return diff >= 0 ? `in ${label}` : `${label} ago`;
};

const inRange = (start, end) => {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return cur >= sh * 60 + sm && cur <= eh * 60 + em;
};

export default function MuhurtaTimings() {
  const [data, setData] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    axios.get(`${API}/panchangam/timings`).then((r) => setData(r.data)).catch(() => {});
    const int = setInterval(() => setTick((t) => t + 1), 30000); // re-render every 30s
    return () => clearInterval(int);
  }, []);

  if (!data) return null;
  const items = Object.entries(data.timings);

  return (
    <section className="sacred-card grain" data-testid="muhurta-timings">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Muhūrta Timings — Today</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Sunrise {data.sunrise} • Sunset {data.sunset}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(([key, t]) => {
          const active = inRange(t.start, t.end);
          const aus = t.type === "auspicious";
          const Icon = aus ? CheckCircle2 : AlertTriangle;
          const c = aus ? "hsl(120 45% 35%)" : "hsl(0 65% 40%)";
          return (
            <div
              key={key}
              data-testid={`timing-${key}`}
              className={`rounded-xl p-3 gold-border transition ${active ? "ring-2 ring-[hsl(var(--gold))] diya-glow-strong" : ""}`}
              style={{ background: `linear-gradient(135deg, ${c}12, transparent)` }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: c }} />
                  <div className="font-medium text-sm truncate">{t.label}</div>
                </div>
                {active && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--gold))] text-black font-semibold animate-pulse">NOW</span>
                )}
              </div>
              <div className="mt-1 text-lg font-semibold" style={{ color: c }}>
                {t.start} – {t.end}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {aus ? "Auspicious" : "Inauspicious"} • {t.type === "auspicious" ? "Start good work" : "Avoid new work"} • starts {relativeTo(t.start)}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground italic mt-3">
        Timings are calculated from local sunrise/sunset. Regional variations apply.
      </p>
    </section>
  );
}
