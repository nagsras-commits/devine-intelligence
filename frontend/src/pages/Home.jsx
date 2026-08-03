import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import { RITUALS } from "@/data/rituals";
import { DEITIES } from "@/data/deities";
import { FESTIVALS } from "@/data/festivals";
import DeityImage from "@/components/DeityImage";
import DeityOfDayRibbon from "@/components/DeityOfDayRibbon";
import { ArrowRight, Sunrise, CalendarDays, Sparkles, Flame, Hash, PenLine } from "lucide-react";

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
      {/* DEITY OF THE DAY RIBBON */}
      <DeityOfDayRibbon />

      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative overflow-hidden rounded-3xl gold-border grain diya-glow-strong"
      >
        {/* Cinematic home banner background */}
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/api/static/banners/home.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(35 60% 12% / 0.86) 0%, hsl(30 50% 15% / 0.60) 45%, hsl(30 40% 10% / 0.35) 100%)",
          }}
        />
        <div className="absolute inset-0 kolam-bg opacity-25 pointer-events-none" />
        <div className="relative px-6 sm:px-10 py-14 sm:py-24 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] gold-border bg-black/40 backdrop-blur text-[hsl(var(--gold))]">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-flicker" />
            Sanātana Dharma
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-shimmer leading-[1.05]"
              style={{ letterSpacing: "0.04em", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.55))" }}>
            {t(lang, "hero_title")}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[hsl(45_100%_92%)]/95 max-w-xl leading-relaxed"
             style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
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
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] bg-black/30 backdrop-blur hover:bg-[hsl(var(--gold)/0.15)] transition"
            >
              {t(lang, "deities")} <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* EXPLORE — icon grid of every page */}
      <section data-testid="explore-grid">
        <div className="text-center mb-6">
          <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">Sanātana Sādhanā</div>
          <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl text-gold-shimmer inline-block" style={{ letterSpacing: "0.06em" }}>
            Explore Your Devine Journey
          </h2>
          <div className="mt-2 font-devanagari text-lg text-saffron/80">॥ हरिः ॐ तत् सत् ॥</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {[
            { to: "/dinacharya", icon: "dinacharya", title: t(lang, "dinacharya"), sanskrit: "दिनचर्या", desc: t(lang, "slokas_desc") },
            { to: "/pooja", icon: "nitya_pooja", title: t(lang, "nitya_pooja"), sanskrit: "नित्यपूजा", desc: t(lang, "nitya_pooja_desc") },
            { to: "/pooja/tulasi", icon: "tulasi_pooja", title: t(lang, "tulasi_pooja"), sanskrit: "तुलसीपूजा", desc: t(lang, "tulasi_pooja_desc") },
            { to: "/japa", icon: "japa", title: t(lang, "japa"), sanskrit: "जप", desc: t(lang, "japa_desc") },
            { to: "/rama-koti", icon: "rama_koti", title: t(lang, "rama_koti"), sanskrit: "रामकोटि", desc: t(lang, "rama_koti_desc") },
            { to: "/deities", icon: "deities", title: t(lang, "deities"), sanskrit: "देवाः", desc: t(lang, "deities_desc") },
            { to: "/panchangam", icon: "panchangam", title: t(lang, "panchangam"), sanskrit: "पञ्चाङ्गम्", desc: t(lang, "panchangam_desc") },
            { to: "/festivals", icon: "festivals", title: t(lang, "festivals"), sanskrit: "उत्सवाः", desc: t(lang, "festivals_desc") },
            { to: "/profile", icon: "profile", title: "Profile", sanskrit: "भक्तपरिचयः", desc: t(lang, "profile_desc") },
            { to: "/", icon: "home", title: t(lang, "home"), sanskrit: "स्वस्ति", desc: t(lang, "home_desc") },
          ].map((tile) => (
            <Link
              key={tile.to + tile.title}
              to={tile.to}
              data-testid={`explore-tile-${tile.icon}`}
              className="group relative rounded-2xl overflow-hidden gold-border diya-glow hover:diya-glow-strong transition-all hover:-translate-y-1"
              style={{ background: "hsl(var(--gold) / 0.06)" }}
            >
              {/* Icon image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/api/static/icons/${tile.icon}.png`}
                  alt={tile.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Bottom gradient for text legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/3"
                  style={{
                    background: "linear-gradient(180deg, transparent 0%, hsl(30 60% 8% / 0.4) 45%, hsl(30 60% 8% / 0.92) 100%)",
                  }}
                />
                {/* Devanāgarī title floating top */}
                <div
                  className="absolute top-2 right-3 font-devanagari text-2xl sm:text-3xl leading-none"
                  style={{
                    background: "linear-gradient(120deg, hsl(45 100% 88%), hsl(30 100% 62%), hsl(45 100% 88%))",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
                  }}
                >
                  {tile.sanskrit}
                </div>
                {/* Title + subtitle */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
                  <div className="font-display font-bold text-base sm:text-lg leading-tight tracking-wide"
                       style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                    {tile.title}
                  </div>
                  <div className="text-[11px] sm:text-xs opacity-90 mt-0.5 line-clamp-2"
                       style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
                    {tile.desc}
                  </div>
                </div>
                {/* Hover shine sweep */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "linear-gradient(115deg, transparent 30%, hsl(45 100% 75% / 0.30) 50%, transparent 70%)",
                  }}
                />
              </div>
            </Link>
          ))}
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

      {/* Sādhanā tiles — Japa & Rāma Koṭi */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Sādhanā</div>
            <h2 className="text-3xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Daily Practices</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Link
            to="/japa"
            data-testid="home-japa-tile"
            className="sacred-card grain group relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse at right, hsl(30 90% 55% / 0.14) 0%, transparent 60%)" }}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full grid place-items-center bg-gradient-to-br from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow">
                <Hash className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Japa Counter</h3>
                <p className="text-sm text-foreground/75 mt-1">
                  Chant your deity's bīja mantra. Complete <b>1,00,00,116</b> japa to receive a divine certificate.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-saffron group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3 font-devanagari text-3xl text-saffron/80 tracking-wider">ॐ नमः शिवाय</div>
          </Link>
          <Link
            to="/rama-koti"
            data-testid="home-ramakoti-tile"
            className="sacred-card grain group relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse at right, hsl(120 45% 35% / 0.14) 0%, transparent 60%)" }}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full grid place-items-center bg-gradient-to-br from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow">
                <PenLine className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Rāma Koṭi (Likhita Japa)</h3>
                <p className="text-sm text-foreground/75 mt-1">
                  Write the sacred name — Rāma, Om Namaḥ Śivāya, Kṛṣṇa & more. Reach <b>1,00,00,116</b> to unlock your certificate.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-saffron group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3 font-devanagari text-3xl text-emerald-800/80 tracking-wider">राम राम राम</div>
          </Link>
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
                <DeityImage deity={d} lang={lang} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="font-devanagari text-base leading-none drop-shadow-lg">{pickLang(d.name, "sa")}</div>
                <div className="text-sm mt-0.5 font-medium drop-shadow-lg">{pickLang(d.name, lang)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
