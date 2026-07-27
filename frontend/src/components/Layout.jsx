import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { LANGUAGES, t } from "@/lib/i18n";
import { BACKGROUND_CHANTS } from "@/data/deities";
import { Volume2, VolumeX, Volume1, Home, Sunrise, Sparkles, CalendarDays, Music2, Languages, X, Flame, Leaf, Hash, PenLine } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const OmSymbol = ({ className = "" }) => (
  <span className={`font-devanagari ${className}`} aria-hidden>ॐ</span>
);

const LOGO_URL = "https://customer-assets-eiarnc6j.emergentagent.net/job_divine-dharma-daily/artifacts/ylzii3mp_165b9e9c-bb2d-4147-a8ae-4a58b631a103.png";

export default function Layout({ children }) {
  const { lang, setLang, muted, isPlaying, toggleMute, chantId, setChantId,
          currentTrack, nowPlaying, stopTrackAndResumeBackground,
          volume, setVolume, volumeMax, autoplayBlocked } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { to: "/", label: t(lang, "home"), icon: Home, key: "home" },
    { to: "/dinacharya", label: t(lang, "dinacharya"), icon: Sunrise, key: "dinacharya" },
    { to: "/pooja", label: t(lang, "nitya_pooja"), icon: Flame, key: "pooja" },
    { to: "/pooja/tulasi", label: t(lang, "tulasi_pooja"), icon: Leaf, key: "tulasi" },
    { to: "/japa", label: t(lang, "japa"), icon: Hash, key: "japa" },
    { to: "/rama-koti", label: t(lang, "rama_koti"), icon: PenLine, key: "ramakoti" },
    { to: "/deities", label: t(lang, "deities"), icon: Sparkles, key: "deities" },
    { to: "/panchangam", label: t(lang, "panchangam"), icon: CalendarDays, key: "panchangam" },
    { to: "/festivals", label: t(lang, "festivals"), icon: Music2, key: "festivals" },
  ];

  const BANNER_URL = `${process.env.REACT_APP_BACKEND_URL}/api/static/banners/header.png`;

  return (
    <div className="App min-h-screen">
      {/* HEADER */}
      <header
        data-testid="app-header"
        className={`sticky top-0 z-40 transition-all duration-300 relative overflow-hidden ${
          scrolled ? "backdrop-blur-xl bg-background/75 border-b border-[hsl(var(--gold)/0.35)]" : "bg-transparent"
        }`}
      >
        {/* Catchy banner background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${BANNER_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: scrolled ? 0.28 : 0.42,
            transition: "opacity 300ms",
          }}
        />
        {/* Gold-warm overlay to keep nav readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, hsl(30 90% 55% / 0.10) 0%, hsl(43 74% 55% / 0.06) 50%, hsl(0 0% 0% / 0.10) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-4">
          <NavLink to="/" data-testid="brand-link" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden diya-glow-strong ring-2 ring-[hsl(var(--gold)/0.7)] shrink-0">
              <img src={LOGO_URL} alt="Devine Intelligence" className="w-full h-full object-cover animate-flicker" />
            </div>
            <div className="leading-tight" data-testid="brand-title">
              <div
                className="font-display font-bold text-lg sm:text-xl md:text-2xl lg:text-[26px] whitespace-nowrap text-gold-shimmer"
                style={{ letterSpacing: "0.14em" }}
              >
                DEVINE INTELLIGENCE
              </div>
              <div className="hidden sm:block text-[10px] md:text-[11px] text-[hsl(var(--kumkum))] dark:text-[hsl(var(--gold)/0.9)] italic mt-0.5 tracking-wider">
                {t(lang, "app_subtitle")}
              </div>
            </div>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-0.5 ml-2 xl:ml-4">
            {nav.map((n) => (
              <NavLink
                key={n.key}
                to={n.to}
                data-testid={`nav-${n.key}`}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-2 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[hsl(var(--gold)/0.15)] text-kumkum dark:text-[hsl(var(--gold))] gold-border"
                      : "text-foreground/75 hover:text-foreground hover:bg-[hsl(var(--gold)/0.08)]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="lang-switcher"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm gold-border hover:bg-[hsl(var(--gold)/0.1)] transition"
                  aria-label="Change language"
                >
                  <Languages className="w-4 h-4" />
                  <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.native}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="parchment gold-border">
                <DropdownMenuLabel className="font-display">Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
                  {LANGUAGES.map((l) => (
                    <DropdownMenuRadioItem
                      key={l.code}
                      value={l.code}
                      data-testid={`lang-option-${l.code}`}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{l.native}</span>
                      <span className="text-xs text-muted-foreground">({l.label})</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile / tablet nav */}
        <nav className="relative lg:hidden overflow-x-auto no-scrollbar px-3 pb-2 flex gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.key}
              to={n.to}
              data-testid={`mobile-nav-${n.key}`}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-[hsl(var(--gold)/0.15)] text-kumkum dark:text-[hsl(var(--gold))] gold-border"
                    : "text-foreground/70 hover:text-foreground"
                }`
              }
            >
              <n.icon className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">{children}</main>

      {/* PERSISTENT AUDIO PLAYER */}
      <div
        data-testid="persistent-audio-player"
        className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl bg-background/85 border-t border-[hsl(var(--gold)/0.5)]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={toggleMute}
            data-testid="chant-toggle"
            className="relative w-11 h-11 rounded-full grid place-items-center bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] text-white diya-glow-strong hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause chant" : "Play chant"}
          >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-breathe" aria-hidden />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {nowPlaying ? t(lang, "now_playing") : t(lang, "background_chant")}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <OmSymbol className={`text-lg text-saffron ${isPlaying ? "animate-flicker" : "opacity-60"}`} />
              <div data-testid="track-title" className="truncate text-sm font-medium">{currentTrack.title}</div>
            </div>
            {!isPlaying && autoplayBlocked && (
              <div className="text-[10px] italic text-muted-foreground mt-0.5">{t(lang, "unmute_chant")}</div>
            )}
          </div>

          {/* Volume slider — visible on all screen sizes */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-28 sm:w-44 shrink-0" data-testid="volume-control">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : volume < 0.7 ? (
              <Volume1 className="w-4 h-4 text-saffron shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-saffron shrink-0" />
            )}
            <Slider
              data-testid="volume-slider"
              value={[Math.round(volume * 100)]}
              onValueChange={(v) => setVolume((v[0] || 0) / 100)}
              min={0}
              max={Math.round(volumeMax * 100)}
              step={5}
              className="w-full"
              aria-label="Volume"
            />
            <span className="text-[10px] tabular-nums text-muted-foreground w-7 text-right shrink-0">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {nowPlaying ? (
            <button
              onClick={stopTrackAndResumeBackground}
              data-testid="stop-sloka-btn"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--kumkum)/0.15)] transition"
              aria-label="Stop sloka"
            >
              <X className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="chant-switcher"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.12)] transition"
                >
                  <Music2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t(lang, "switch_chant")}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="parchment gold-border">
                <DropdownMenuLabel className="font-display">{t(lang, "background_chant")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={chantId} onValueChange={setChantId}>
                  {BACKGROUND_CHANTS.map((c) => (
                    <DropdownMenuRadioItem
                      key={c.id}
                      value={c.id}
                      data-testid={`chant-option-${c.id}`}
                      className="cursor-pointer"
                    >
                      {c.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
