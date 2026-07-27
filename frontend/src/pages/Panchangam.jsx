import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import { CalendarDays, Sun } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Panchangam() {
  const { lang } = useApp();
  const [week, setWeek] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(`${API}/panchangam/week`).then((r) => {
      setWeek(r.data);
      setSelected(r.data[0]);
    });
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Traditional Almanac</div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "panchangam")}</h1>
        </div>
        <CalendarDays className="w-10 h-10 text-saffron" />
      </header>

      {/* Week strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {week.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelected(d)}
            data-testid={`day-${d.date}`}
            className={`shrink-0 px-4 py-3 rounded-2xl min-w-[120px] text-left transition-all border ${
              selected?.date === d.date
                ? "bg-[hsl(var(--gold)/0.15)] border-[hsl(var(--gold))] diya-glow"
                : "gold-border bg-card hover:bg-[hsl(var(--gold)/0.08)]"
            }`}
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{d.vara.slice(0, 3)}</div>
            <div className="text-lg font-semibold">{new Date(d.date).getDate()}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{d.tithi}</div>
          </button>
        ))}
      </div>

      {/* Selected day */}
      {selected && (
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 sacred-card grain">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  {selected.paksha}
                </div>
                <h2 className="text-3xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
                  {new Date(selected.date).toDateString()}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t(lang, "vara")}</div>
                <div className="text-xl font-display">{selected.vara_sanskrit}</div>
                <div className="text-xs text-muted-foreground">{selected.vara}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ["tithi", `${selected.tithi} (#${selected.tithi_number})`],
                ["nakshatra", selected.nakshatra],
                ["yoga", selected.yoga],
                ["karana", selected.karana],
                ["sunrise", selected.sunrise],
                ["sunset", selected.sunset],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl p-3 bg-[hsl(var(--gold)/0.08)] gold-border">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t(lang, k)}</div>
                  <div className="mt-1 font-medium">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sacred-card grain">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-saffron" />
              <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "deity_of_day")}</h3>
            </div>
            <div className="mt-3 text-2xl font-display">{selected.deity_of_day}</div>
            <div className="mt-3 text-sm text-foreground/80 leading-relaxed">
              {selected.auspicious_note}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
