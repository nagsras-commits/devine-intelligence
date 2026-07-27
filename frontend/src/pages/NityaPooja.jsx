import React, { useState } from "react";
import { NITYA_POOJA, ISHTA_STOTRAM_MAP } from "@/data/nityapooja";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import SlokaCard from "@/components/SlokaCard";
import DeityImage from "@/components/DeityImage";
import * as Lucide from "lucide-react";
import { ChevronDown, BookOpen, ScrollText, Sparkles, Package } from "lucide-react";

function Step({ step, index, open, onToggle, lang }) {
  const Icon = (step.icon && Lucide[step.icon]) || Lucide.Circle;
  return (
    <div className="relative" data-testid={`pooja-step-${step.id}`}>
      <div className="absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full grid place-items-center gold-border bg-background">
        <span className="text-[9px] font-bold text-kumkum">{step.num || index}</span>
      </div>

      <button
        onClick={onToggle}
        data-testid={`pooja-toggle-${step.id}`}
        className="w-full text-left sacred-card grain group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full grid place-items-center bg-[hsl(var(--gold)/0.15)] gold-border text-kumkum dark:text-[hsl(var(--gold))]">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
              {pickLang(step.title, lang)}
            </h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="mt-3">
          <SlokaCard sloka={step.sanskrit} translit={step.translit} meaning={step.meaning} />
        </div>
      )}
    </div>
  );
}

export default function NityaPooja() {
  const { lang } = useApp();
  const [openIds, setOpenIds] = useState(new Set(["achamana"]));
  const [ishtaId, setIshtaId] = useState("ganesha");

  const toggle = (id) =>
    setOpenIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const expandAll = () =>
    setOpenIds(new Set([
      ...NITYA_POOJA.preliminaries.map((p) => p.id),
      ...NITYA_POOJA.upacharas.map((u) => u.id),
      NITYA_POOJA.conclusion.id,
    ]));
  const collapseAll = () => setOpenIds(new Set());

  const ishtaDeity = DEITIES.find((d) => d.id === ishtaId) || DEITIES[0];
  const ishtaStotra = ISHTA_STOTRAM_MAP[ishtaId];

  return (
    <div className="space-y-10">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Nitya Pūjā Vidhānam</div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
          {t(lang, "nitya_pooja")}
        </h1>
        <p className="mt-3 text-foreground/80 max-w-3xl leading-relaxed">
          {pickLang(NITYA_POOJA.intro, lang)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={expandAll}
            data-testid="expand-all-btn"
            className="text-xs rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            data-testid="collapse-all-btn"
            className="text-xs rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]"
          >
            Collapse all
          </button>
        </div>
      </header>

      {/* Ishta devata picker */}
      <section className="sacred-card grain">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-saffron" />
          <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
            {t(lang, "ishta_devata")}
          </h2>
        </div>
        <p className="text-sm text-foreground/70 mb-4">
          {t(lang, "ishta_help")}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {DEITIES.filter((d) => ISHTA_STOTRAM_MAP[d.id]).map((d) => (
            <button
              key={d.id}
              onClick={() => setIshtaId(d.id)}
              data-testid={`ishta-${d.id}`}
              className={`text-sm rounded-full px-3 py-1.5 border transition ${
                ishtaId === d.id
                  ? "bg-[hsl(var(--kumkum)/0.18)] border-[hsl(var(--gold))] text-kumkum dark:text-[hsl(var(--gold))]"
                  : "gold-border hover:bg-[hsl(var(--gold)/0.08)]"
              }`}
            >
              <span className="font-devanagari mr-1">{pickLang(d.name, "sa")}</span>
              <span>{pickLang(d.name, lang)}</span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[220px,1fr] gap-5 items-start">
          <div className="rounded-2xl overflow-hidden gold-border aspect-square diya-glow">
            <DeityImage deity={ishtaDeity} lang={lang} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {t(lang, "favorite_stotram")}
            </div>
            <div className="mt-1 font-devanagari text-2xl text-kumkum dark:text-[hsl(var(--gold))]">
              {pickLang(ishtaDeity.name, "sa")}
            </div>
            <h3 className="text-2xl font-semibold mt-1">{pickLang(ishtaStotra.title, lang)}</h3>

            <div className="mt-4 rounded-xl p-4 bg-[hsl(var(--gold)/0.08)] gold-border">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                {t(lang, "mula_mantra")}
              </div>
              <div className="font-devanagari text-xl text-kumkum dark:text-[hsl(var(--gold))]">
                {ishtaDeity.mula_mantra.sa}
              </div>
              <div className="text-sm italic mt-1 text-foreground/80">{ishtaDeity.mula_mantra.en}</div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">{t(lang, "when_to_recite")}: </span>
                <span className="text-foreground/80">{pickLang(ishtaStotra.when, lang)}</span>
              </div>
            </div>

            <a
              href={`/deities/${ishtaDeity.id}`}
              data-testid="ishta-open-deity"
              className="inline-flex items-center gap-1.5 mt-4 rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow"
            >
              {t(lang, "open_deity")} <Lucide.ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="sacred-card grain">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-saffron" />
          <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
            {pickLang(NITYA_POOJA.materials.title, lang)}
          </h2>
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {NITYA_POOJA.materials.items[lang].map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/85" data-testid={`material-${i}`}>
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-saffron shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <div className="relative pl-6 sm:pl-8">
        <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-[hsl(var(--gold)/0.4)]" aria-hidden />

        {/* Preliminaries */}
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            {t(lang, "preliminaries")}
          </div>
        </div>
        <div className="space-y-5">
          {NITYA_POOJA.preliminaries.map((p, i) => (
            <Step key={p.id} step={p} index={i + 1} open={openIds.has(p.id)} onToggle={() => toggle(p.id)} lang={lang} />
          ))}
        </div>

        {/* 16 Upacharas */}
        <div className="mt-10 mb-4">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            {t(lang, "shodashopachara")}
          </div>
        </div>
        <div className="space-y-5">
          {NITYA_POOJA.upacharas.map((u, i) => (
            <Step key={u.id} step={u} index={u.num} open={openIds.has(u.id)} onToggle={() => toggle(u.id)} lang={lang} />
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-10 mb-4">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            {t(lang, "conclusion")}
          </div>
        </div>
        <div className="space-y-5">
          <Step
            step={NITYA_POOJA.conclusion}
            index="✓"
            open={openIds.has(NITYA_POOJA.conclusion.id)}
            onToggle={() => toggle(NITYA_POOJA.conclusion.id)}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
