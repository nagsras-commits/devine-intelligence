import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarHeart, Loader2, BellRing, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VRATA_COLORS = {
  "Ekādaśī": { bg: "hsl(210 90% 96%)", accent: "hsl(220 80% 45%)" },
  "Pradoṣam": { bg: "hsl(30 80% 96%)", accent: "hsl(20 75% 45%)" },
  "Sankaṣṭī Chaturthī": { bg: "hsl(45 85% 94%)", accent: "hsl(30 80% 40%)" },
  "Pūrṇimā": { bg: "hsl(45 90% 96%)", accent: "hsl(45 85% 40%)" },
  "Amāvāsyā": { bg: "hsl(220 15% 94%)", accent: "hsl(220 25% 25%)" },
};

export default function VrataCalendar() {
  const [days, setDays] = useState(45);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/vrata/upcoming?days=${days}`)
      .then((r) => setData(r.data))
      .catch(() => setData({ vratas: [] }))
      .finally(() => setLoading(false));
  }, [days]);

  const byMonth = useMemo(() => {
    if (!data) return {};
    const g = {};
    data.vratas.forEach((v) => {
      const key = new Date(v.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!g[key]) g[key] = [];
      g[key].push(v);
    });
    return g;
  }, [data]);

  return (
    <section className="sacred-card grain" data-testid="vrata-calendar">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <CalendarHeart className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Vrata Calendar</h3>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Show next</label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            data-testid="vrata-range"
            className="text-xs rounded-lg px-2 py-1 gold-border bg-card"
          >
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
            <option value={45}>45 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
          </select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Ekādaśī • Pradoṣam • Sankaṣṭī Chaturthī • Pūrṇimā • Amāvāsyā — with vidhi and prasad ideas.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading vratas…</div>
      ) : (
        Object.entries(byMonth).map(([mo, vs]) => (
          <div key={mo} className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{mo}</div>
            <div className="space-y-2">
              {vs.map((v) => {
                const c = VRATA_COLORS[v.vrata] || { bg: "hsl(var(--gold)/0.08)", accent: "hsl(var(--kumkum))" };
                const key = `${v.date}-${v.vrata}`;
                const open = expanded === key;
                const isToday = v.day_offset === 0;
                return (
                  <button
                    key={key}
                    onClick={() => setExpanded(open ? null : key)}
                    data-testid={`vrata-${key}`}
                    className={`w-full text-left rounded-xl p-3 gold-border transition hover:shadow-sm ${isToday ? "ring-2 ring-[hsl(var(--gold))]" : ""}`}
                    style={{ background: c.bg }}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-center min-w-[3.5rem]">
                        <div className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: c.accent }}>
                          {new Date(v.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="text-2xl font-bold" style={{ color: c.accent }}>
                          {new Date(v.date).getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-semibold" style={{ color: c.accent }}>{v.vrata}</span>
                          <span className="font-devanagari opacity-75" style={{ color: c.accent }}>{v.sanskrit}</span>
                          {isToday && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--gold))] text-black font-semibold">TODAY</span>}
                        </div>
                        <div className="text-[11px] opacity-70">{v.deity} • {v.tithi} • {v.paksha}</div>
                      </div>
                      <ArrowRight className={`w-4 h-4 opacity-40 transition-transform ${open ? "rotate-90" : ""}`} style={{ color: c.accent }} />
                    </div>
                    {open && (
                      <div className="mt-3 pt-3 border-t space-y-2 text-sm text-foreground/85" style={{ borderColor: `${c.accent}30` }}>
                        <div><b>Significance:</b> {v.significance}</div>
                        <div><b>Vidhi:</b> {v.vidhi}</div>
                        <div><b>Prasad:</b> {v.prasad}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
      {data && data.count === 0 && !loading && (
        <div className="text-sm text-muted-foreground italic">No major vratas in this range.</div>
      )}
    </section>
  );
}
