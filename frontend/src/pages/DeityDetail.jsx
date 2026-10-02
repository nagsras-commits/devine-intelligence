import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import SlokaCard from "@/components/SlokaCard";
import DeityImage from "@/components/DeityImage";
import NamesModal from "@/components/NamesModal";
import { ArrowLeft, Play, BookOpen, Music, Sparkles } from "lucide-react";

export default function DeityDetail() {
  const { id } = useParams();
  const { lang, playTrack } = useApp();
  const deity = DEITIES.find((d) => d.id === id);
  const [namesOpen, setNamesOpen] = useState(false);
  if (!deity) return <Navigate to="/deities" replace />;

  return (
    <div className="space-y-8">
      <Link to="/deities" data-testid="back-to-deities" className="inline-flex items-center gap-2 text-sm text-kumkum dark:text-[hsl(var(--gold))] hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> {t(lang, "deities")}
      </Link>

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative rounded-3xl overflow-hidden gold-border diya-glow-strong aspect-square">
          <DeityImage deity={deity} lang={lang} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Divine Presence</div>
          <div className="mt-2 font-devanagari text-5xl sm:text-6xl text-kumkum dark:text-[hsl(var(--gold))]">
            {pickLang(deity.name, "sa")}
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold">{pickLang(deity.name, lang)}</h1>

          <div className="mt-6 sacred-card grain">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" /> {t(lang, "mula_mantra")}
            </div>
            <div className="mt-2 font-devanagari text-2xl text-kumkum dark:text-[hsl(var(--gold))]">
              {deity.mula_mantra.sa}
            </div>
            <div className="mt-1 italic text-sm text-foreground/80">{deity.mula_mantra.en}</div>
            <div className="mt-2 text-sm text-foreground/70">{pickLang(deity.mula_mantra.meaning, lang)}</div>
          </div>
        </div>
      </section>

      {/* Dhyana Sloka */}
      <section>
        <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))] mb-3">{t(lang, "dhyana_sloka")}</h2>
        <SlokaCard sloka={deity.dhyana_sloka} meaning={deity.meaning} />
      </section>

      {/* Stotras + Ashtottara */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="sacred-card grain">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-saffron" />
            <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "stotras")}</h3>
          </div>
          <ul className="space-y-2">
            {deity.stotras.map((s, i) => (
              <li key={i} data-testid={`stotra-${i}`} className="flex items-center gap-2 text-foreground/85">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sacred-card grain">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-saffron" />
            <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "ashtottara")}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {deity.ashtottara_sample.map((n, i) => (
              <span
                key={i}
                data-testid={`ashtottara-${i}`}
                className="text-sm px-2.5 py-1 rounded-full gold-border bg-[hsl(var(--gold)/0.08)] text-foreground/85"
              >
                {n}
              </span>
            ))}
          </div>
          <div className="mt-4 text-xs italic text-muted-foreground flex items-center justify-between gap-3 flex-wrap">
            <span>These are traditional divine names from the canonical stotras.</span>
            <button
              onClick={() => setNamesOpen(true)}
              data-testid="open-names-modal"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" /> Open full 108 & 1008 names
            </button>
          </div>
        </div>
      </section>

      <NamesModal
        deityId={deity.id}
        deityName={pickLang(deity.name, "en")}
        isOpen={namesOpen}
        onClose={() => setNamesOpen(false)}
      />

      {/* Songs */}
      {deity.songs?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-5 h-5 text-saffron" />
            <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "songs")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {deity.songs.map((s, i) => (
              <button
                key={i}
                onClick={() => playTrack({ title: s.title, url: s.url })}
                data-testid={`song-play-${i}`}
                className="sacred-card grain text-left flex items-center gap-4 group"
              >
                <div className="w-12 h-12 shrink-0 rounded-full grid place-items-center bg-gradient-to-br from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow group-hover:scale-110 transition">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Tap to play • pauses background chant</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
