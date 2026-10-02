import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import { Sun, CalendarDays, Clock, Star, Sunrise, Heart, ChevronLeft, ChevronRight, CalendarClock, RotateCcw, Cake } from "lucide-react";
import PageHero from "@/components/PageHero";
import MuhurtaTimings from "@/components/MuhurtaTimings";
import MuhurtaAlarm from "@/components/MuhurtaAlarm";
import KundaliMaker from "@/components/KundaliMaker";
import KundaliMatch from "@/components/KundaliMatch";
import DailyHoroscope from "@/components/DailyHoroscope";
import DeityOfDayRibbon from "@/components/DeityOfDayRibbon";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SECTIONS = [
  { id: "panchangam", label: "Panchāngam", icon: CalendarDays },
  { id: "muhurta",    label: "Muhūrta & Alarms", icon: Clock },
  { id: "kundali",    label: "Kundali",    icon: Star },
  { id: "match",      label: "Kundali Match", icon: Heart },
  { id: "horoscope",  label: "Horoscope",  icon: Sunrise },
];

export default function Panchangam() {
  const { lang } = useApp();
  const [week, setWeek] = useState([]);
  const [selected, setSelected] = useState(null);
  const [anchor, setAnchor] = useState(() => new Date().toISOString().slice(0, 10)); // date the week is centred around
  const [activeSec, setActiveSec] = useState("panchangam");
  const [loadingDate, setLoadingDate] = useState(false);
  const refs = {
    panchangam: useRef(null),
    muhurta: useRef(null),
    kundali: useRef(null),
    match: useRef(null),
    horoscope: useRef(null),
  };

  const fetchDate = async () => {}; // reserved

  // Load a week strip that starts from `anchor - 3 days` so anchor sits in the middle
  const loadWeek = async (dateStr) => {
    const start = new Date(dateStr);
    start.setDate(start.getDate() - 3);
    const promises = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const s = d.toISOString().slice(0, 10);
      promises.push(axios.get(`${API}/panchangam`, { params: { date_str: s } }).then((r) => r.data));
    }
    try {
      const days = await Promise.all(promises);
      setWeek(days);
      // Select the anchor day
      const target = days.find((d) => d.date === dateStr) || days[3];
      setSelected(target);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { loadWeek(anchor); /* eslint-disable-next-line */ }, [anchor]);

  const shiftAnchor = (days) => {
    const d = new Date(anchor); d.setDate(d.getDate() + days);
    setAnchor(d.toISOString().slice(0, 10));
  };

  const jumpToToday = () => {
    const t = new Date().toISOString().slice(0, 10);
    setAnchor(t);
  };

  const setDateFromInput = (v) => {
    if (!v) return;
    setAnchor(v);
  };

  const isToday = anchor === new Date().toISOString().slice(0, 10);
  void fetchDate; void loadingDate;

  // Read birthday from persisted Kundali
  const [birthday, setBirthday] = useState(null);
  useEffect(() => {
    const readBday = () => {
      try {
        const k = JSON.parse(localStorage.getItem("dj_kundali_result") || "null");
        setBirthday(k?.dob || null);
      } catch { setBirthday(null); }
    };
    readBday();
    window.addEventListener("dj-kundali-updated", readBday);
    const storage = (e) => { if (e.key === "dj_kundali_result") readBday(); };
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener("dj-kundali-updated", readBday);
      window.removeEventListener("storage", storage);
    };
  }, []);

  // Jump to the user's birthday (or a random one, sliced to same month-day if birthday in past)
  const jumpToBirthday = () => {
    if (!birthday) { jump("kundali"); return; }
    setAnchor(birthday);
    setTimeout(() => jump("panchangam"), 100);
  };

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
        {/* Date navigator — pick any date, any year */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl p-3 gold-border bg-[hsl(var(--gold)/0.05)]" data-testid="date-navigator">
          <div className="flex items-center gap-1">
            <button
              onClick={() => shiftAnchor(-7)}
              data-testid="date-prev-week"
              title="Previous week"
              className="w-8 h-8 grid place-items-center rounded-full gold-border hover:bg-[hsl(var(--gold)/0.15)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => shiftAnchor(-1)}
              data-testid="date-prev-day"
              className="rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.15)]"
            >
              -1 day
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <CalendarClock className="w-4 h-4 text-saffron shrink-0" />
            <input
              type="date"
              value={anchor}
              onChange={(e) => setDateFromInput(e.target.value)}
              data-testid="date-picker"
              min="1900-01-01"
              max="2100-12-31"
              className="rounded-lg px-3 py-2 gold-border bg-card text-sm flex-1 max-w-[220px]"
              aria-label="Pick any date"
            />
            <input
              type="number"
              value={new Date(anchor).getFullYear()}
              onChange={(e) => {
                const y = parseInt(e.target.value || "0", 10);
                if (!y || y < 1000 || y > 3000) return;
                const d = new Date(anchor); d.setFullYear(y);
                setAnchor(d.toISOString().slice(0, 10));
              }}
              data-testid="date-year"
              className="rounded-lg px-2 py-2 gold-border bg-card text-sm w-24"
              aria-label="Jump to year"
              min="1900"
              max="2100"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => shiftAnchor(1)}
              data-testid="date-next-day"
              className="rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.15)]"
            >
              +1 day
            </button>
            <button
              onClick={() => shiftAnchor(7)}
              data-testid="date-next-week"
              title="Next week"
              className="w-8 h-8 grid place-items-center rounded-full gold-border hover:bg-[hsl(var(--gold)/0.15)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isToday && (
              <button
                onClick={jumpToToday}
                data-testid="date-today"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow hover:opacity-90 ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Today
              </button>
            )}
            <button
              onClick={jumpToBirthday}
              data-testid="date-birthday"
              title={birthday ? `Jump to ${birthday}` : "Generate your Kundali to enable this"}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs ml-1 ${
                birthday
                  ? "gold-border hover:bg-[hsl(var(--gold)/0.15)]"
                  : "opacity-60 gold-border"
              }`}
            >
              <Cake className="w-3 h-3" /> {birthday ? "My Birthday" : "My Birthday…"}
            </button>
          </div>
        </div>

        {/* Week strip */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {week.map((d) => (
            <button
              key={d.date}
              onClick={() => { setSelected(d); setAnchor(d.date); }}
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

              {/* Samvatsara / Ritu / Ayana / Masa — traditional almanac fields */}
              {(selected.samvatsara || selected.ritu || selected.ayana) && (
                <div className="mt-4 rounded-xl p-3 gold-border bg-gradient-to-r from-[hsl(var(--gold)/0.08)] to-[hsl(var(--saffron)/0.05)]" data-testid="panch-almanac">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                    Traditional Almanac
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2 text-sm">
                    {selected.samvatsara && (
                      <div><span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Samvatsara</span><span className="font-medium">{selected.samvatsara}</span></div>
                    )}
                    {selected.masa && (
                      <div><span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Māsa</span><span className="font-medium">{selected.masa}</span></div>
                    )}
                    {selected.ritu && (
                      <div><span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Ṛtu</span><span className="font-medium">{selected.ritu}</span></div>
                    )}
                    {selected.ayana && (
                      <div><span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Ayana</span><span className="font-medium">{selected.ayana}</span></div>
                    )}
                    {selected.vikrama_samvat && (
                      <div><span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Vikrama Saṁvat</span><span className="font-medium">{selected.vikrama_samvat}</span></div>
                    )}
                    {selected.shaka_samvat && (
                      <div><span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Śaka Saṁvat</span><span className="font-medium">{selected.shaka_samvat}</span></div>
                    )}
                  </div>
                </div>
              )}
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

      {/* Kundali Match section */}
      <div ref={refs.match} data-section="match" id="match" className="scroll-mt-24 pt-4" data-testid="section-match">
        <KundaliMatch />
      </div>

      {/* Horoscope section */}
      <div ref={refs.horoscope} data-section="horoscope" id="horoscope" className="scroll-mt-24 pt-4" data-testid="section-horoscope">
        <DailyHoroscope onJumpToKundali={() => jump("kundali")} />
      </div>
    </div>
  );
}
