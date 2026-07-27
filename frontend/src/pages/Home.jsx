import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import { RITUALS } from "@/data/rituals";
import { DEITIES } from "@/data/deities";
import { FESTIVALS } from "@/data/festivals";
import DeityIcon from "@/components/DeityIcon";
import { ArrowRight, Sunrise, CalendarDays, Sparkles, Flame } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const { lang } = useApp();
  const [panch, setPanch] = useState(null);

  useEffect(() => {
    axios.get(`${API}/panchangam`).then((r) => setPanch(r.data)).catch(() => setPanch(null));
  }, []);

  // Find next upcoming festival (nearest by day-of-year)
  const upcoming = React.useMemo(() => {
    const today = new Date();
    const doy = (d) => (d.getMonth() + 1) * 31 + d.getDate();
    const today_v = doy(today);
    const withDist = FESTIVALS.map((f) => {
      const fd = new Date(today.getFullYear(), f.month - 1, f.day);
      let dist = doy(fd) - today_v;
      if (dist < 0) dist += 372;
      return { ...f, dist };
    }).sort((a, b) => a.dist - b.dist);
    return withDist[0];
  }, []);

  const featured = DEITIES.slice(0, 6);
  const nextRituals = RITUALS.slice(0, 3);

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative overflow-hidden rounded-3xl gold-border grain diya-glow-strong parchment"
      >
        <div className="absolute inset-0 kolam-bg opacity-40 pointer-events-none" />
        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80)",
            maskImage: "linear-gradient(to left, black, transparent)",
            WebkitMaskImage: "linear-gradient(to left, black, transparent)",
          }}
        />
        <div className="relative px-6 sm:px-10 py-14 sm:py-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] gold-border bg-background/60">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-flicker" />
            Sanātana Dharma
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold text-kumkum dark:text-[hsl(var(--gold))] leading-[1.05]">
            {t(lang, "hero_title")}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-foreground/80 max-w-xl leading-relaxed">
            {t(lang, "hero_sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dinacharya"
              data-testid="hero-cta-begin"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white font-medium hover:opacity-90 transition diya-glow"
            >
              {t(lang, "begin_journey")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/deities"
              data-testid="hero-cta-deities"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 gold-border hover:bg-[hsl(var(--gold)/0.12)] transition"
            >
              {t(lang, "deities")} <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TODAY: Panchangam + Festival */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div data-testid="today-panchangam-card" className="lg:col-span-2 sacred-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                {t(lang, "today")} • {t(lang, "panchangam")}
              </div>
              <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))] mt-1">
                {panch ? new Date(panch.date).toDateString() : "…"}
              </h2>
            </div>
            <CalendarDays className="w-6 h-6 text-saffron" />
          </div>
          {panch ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["vara", panch.vara],
                ["tithi", `${panch.tithi} (${panch.paksha})`],
                ["nakshatra", panch.nakshatra],
                ["yoga", panch.yoga],
                ["karana", panch.karana],
                ["sunrise", panch.sunrise],
                ["sunset", panch.sunset],
                ["deity_of_day", panch.deity_of_day],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl p-3 bg-[hsl(var(--gold)/0.08)] gold-border">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t(lang, k)}</div>
                  <div className="mt-1 font-medium">{v}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic">Loading panchāngam…</div>
          )}
          <div className="mt-4 text-sm italic text-foreground/70">
            {panch?.auspicious_note}
          </div>
        </div>

        <Link
          to={`/festivals#${upcoming.id}`}
          data-testid="upcoming-festival-card"
          className="sacred-card grain block group"
        >
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {t(lang, "festival_upcoming")}
          </div>
          <div className="flex items-start gap-3 mt-2">
            <Flame className="w-6 h-6 text-saffron animate-flicker" />
            <div>
              <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
                {pickLang(upcoming.name, lang)}
              </h3>
              <div className="text-xs text-muted-foreground mt-0.5">
                in {upcoming.dist} day{upcoming.dist === 1 ? "" : "s"} • {upcoming.deity}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-4">
            {upcoming.story}
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-xs text-kumkum dark:text-[hsl(var(--gold))] group-hover:gap-2 transition-all">
            {t(lang, "view_all")} <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </section>

      {/* Rituals preview */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Dinacharya</div>
            <h2 className="text-3xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "dinacharya")}</h2>
          </div>
          <Link to="/dinacharya" data-testid="see-all-rituals" className="text-sm inline-flex items-center gap-1 text-kumkum dark:text-[hsl(var(--gold))] hover:gap-2 transition-all">
            {t(lang, "view_all")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {nextRituals.map((r) => (
            <Link key={r.id} to="/dinacharya" data-testid={`ritual-home-${r.id}`} className="sacred-card grain">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Sunrise className="w-4 h-4 text-saffron" /> {r.time}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
                {pickLang(r.title, lang)}
              </h3>
              <pre className="font-devanagari mt-3 text-base whitespace-pre-wrap leading-relaxed line-clamp-3 text-foreground/85">
                {r.sanskrit}
              </pre>
            </Link>
          ))}
        </div>
      </section>

      {/* Deities preview */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Devāḥ & Devyaḥ</div>
            <h2 className="text-3xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "deities")}</h2>
          </div>
          <Link to="/deities" data-testid="see-all-deities" className="text-sm inline-flex items-center gap-1 text-kumkum dark:text-[hsl(var(--gold))] hover:gap-2 transition-all">
            {t(lang, "view_all")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((d) => (
            <Link
              key={d.id}
              to={`/deities/${d.id}`}
              data-testid={`deity-card-${d.id}`}
              className="group relative rounded-2xl overflow-hidden gold-border diya-glow hover:diya-glow-strong transition-all bg-card"
            >
              <div className="aspect-[3/4] relative">
                <DeityIcon deity={d} lang={lang} size="sm" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="text-sm font-medium">{pickLang(d.name, lang)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
