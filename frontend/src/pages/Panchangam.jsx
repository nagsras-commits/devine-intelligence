import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import { Sun, CalendarDays, Clock, Star, Sunrise } from "lucide-react";
import PageHero from "@/components/PageHero";
import MuhurtaTimings from "@/components/MuhurtaTimings";
import MuhurtaAlarm from "@/components/MuhurtaAlarm";
import KundaliMaker from "@/components/KundaliMaker";
import DailyHoroscope from "@/components/DailyHoroscope";
import DeityOfDayRibbon from "@/components/DeityOfDayRibbon";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SECTIONS = [
  { id: "panchangam", label: "Panchāngam", icon: CalendarDays },
  { id: "muhurta",    label: "Muhūrta & Alarms", icon: Clock },
  { id: "kundali",    label: "Kundali",    icon: Star },
  { id: "horoscope",  label: "Horoscope",  icon: Sunrise },
];

export default function Panchangam() {
  const { lang } = useApp();
  const [week, setWeek] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeSec, setActiveSec] = useState("panchangam");
  const refs = {
    panchangam: useRef(null),
    muhurta: useRef(null),
    kundali: useRef(null),
    horoscope: useRef(null),
  };

  useEffect(() => {
    axios.get(`${API}/panchangam/week`).then((r) => {
      setWeek(r.data);
      setSelected(r.data[0]);
    });
  }, []);

  // Track scroll to highlight the active section chip
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSec(e.target.dataset.section);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 }
    );
    Object.entries(refs).forEach(([id, r]) => { if (r.current) io.observe(r.current); });
    return () => io.disconnect();
    // eslint-disable-next-line
  }, []);

  const jump = (id) => {
    const el = refs[id]?.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <PageHero
        bannerId="panchangam"
        eyebrow="Traditional Almanac & Jyotiṣa"
        title={t(lang, "panchangam")}
        sanskritTitle="पञ्चाङ्गम्"
        subtitle="Tithi, Nakshatra, Yoga, Karana, Vara — the five limbs of Vedic time. Muhūrtas, Kundali & daily horoscope, all on one screen."
      />

      {/* Deity of the Day ribbon */}
      <DeityOfDayRibbon />

      {/* Sticky quick-jump nav (all four visible at once) */}
      <div
        data-testid="panch-quicknav"
        className="sticky top-[76px] z-30 flex flex-wrap gap-2 rounded-2xl p-2 gold-border bg-background/90 backdrop-blur-xl"
      >
        {SECTIONS.map((s) => {
          const active = activeSec === s.id;
          return (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              data-testid={`panch-jump-${s.id}`}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow"
                  : "text-foreground/70 hover:text-foreground hover:bg-[hsl(var(--gold)/0.1)]"
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* All sections rendered in one frame */}
      <div ref={refs.panchangam} data-section="panchangam" id="panchangam" className="space-y-4 scroll-mt-24" data-testid="section-panchangam">
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

      {/* Muhurta section */}
      <div ref={refs.muhurta} data-section="muhurta" id="muhurta" className="space-y-6 scroll-mt-24 pt-4" data-testid="section-muhurta">
        <MuhurtaTimings />
        <MuhurtaAlarm />
      </div>

      {/* Kundali section */}
      <div ref={refs.kundali} data-section="kundali" id="kundali" className="scroll-mt-24 pt-4" data-testid="section-kundali">
        <KundaliMaker />
      </div>

      {/* Horoscope section */}
      <div ref={refs.horoscope} data-section="horoscope" id="horoscope" className="scroll-mt-24 pt-4" data-testid="section-horoscope">
        <DailyHoroscope onJumpToKundali={() => jump("kundali")} />
      </div>
    </div>
  );
}
