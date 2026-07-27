import React, { useEffect, useState } from "react";
import axios from "axios";
import { AUTHENTIC_POOJA, ISHTA_STOTRAM_MAP } from "@/data/nityapooja";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import DeityImage from "@/components/DeityImage";
import * as Lucide from "lucide-react";
import { ChevronDown, BookOpen, Sparkles, Package, ScrollText } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Substitute {{samvatsara}} etc placeholders with today's panchangam values.
function fillSankalpa(text, panch, lang) {
  if (!panch) return text;
  const map = lang === "te"
    ? {
        "{{samvatsara}}": panch.samvatsara_te || panch.samvatsara,
        "{{ayana}}": panch.ayana_te || panch.ayana,
        "{{ruthu}}": panch.ruthu_te || panch.ruthu,
        "{{masa}}": panch.masa_te || panch.masa,
        "{{paksha}}": panch.paksha_te || panch.paksha,
        "{{tithi}}": panch.tithi_te || panch.tithi,
        "{{vara}}": panch.vara,
      }
    : {
        "{{samvatsara}}": panch.samvatsara,
        "{{ayana}}": panch.ayana,
        "{{ruthu}}": panch.ruthu,
        "{{masa}}": panch.masa,
        "{{paksha}}": panch.paksha,
        "{{tithi}}": panch.tithi,
        "{{vara}}": panch.vara,
      };
  let out = text;
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
  return out;
}

function StepCard({ step, open, onToggle, lang, panch }) {
  const Icon = (step.icon && Lucide[step.icon]) || Lucide.Circle;
  const isTelugu = lang === "te";
  const isSanskritScript = isTelugu || lang === "hi";
  const translitClass = lang === "te" ? "font-telugu" : lang === "ta" ? "font-tamil" : "font-devanagari";

  const sankalpaTe = step.sankalpam_te ? fillSankalpa(step.sankalpam_te, panch, "te") : null;
  const sankalpaEn = step.sankalpam_en ? fillSankalpa(step.sankalpam_en, panch, "en") : null;

  const instructionsText = step.instructions?.[lang] || step.instructions?.en;

  return (
    <div className="relative" data-testid={`pooja-step-${step.id}`}>
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
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="mt-3 sacred-card grain animate-rise space-y-4">
          {/* Instructions */}
          {instructionsText && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {t(lang, "how_to")}
              </div>
              <p className={`text-sm sm:text-base leading-relaxed text-foreground/85 ${translitClass}`}>
                {instructionsText}
              </p>
            </div>
          )}

          {/* Sanskrit */}
          {step.sanskrit && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {t(lang, "sanskrit")}
              </div>
              <pre className="font-devanagari text-lg leading-relaxed whitespace-pre-wrap text-foreground/95">
                {step.sanskrit}
              </pre>
            </div>
          )}

          {/* Sankalpam (dynamic) */}
          {sankalpaTe && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {t(lang, "sankalpam_dynamic")}
              </div>
              <pre className={`font-telugu text-base leading-relaxed whitespace-pre-wrap text-foreground/90 rounded-xl p-3 bg-[hsl(var(--gold)/0.06)] gold-border`}>
                {sankalpaTe}
              </pre>
              {lang !== "te" && sankalpaEn && (
                <pre className="mt-2 text-sm leading-relaxed whitespace-pre-wrap italic text-foreground/75">
                  {sankalpaEn}
                </pre>
              )}
            </div>
          )}

          {/* Transliteration (per language) */}
          {step.translit?.[lang] && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {t(lang, "transliteration")}
              </div>
              <pre className={`text-base leading-relaxed whitespace-pre-wrap italic text-foreground/85 ${translitClass}`}>
                {step.translit[lang]}
              </pre>
            </div>
          )}

          {/* If current language isn't Telugu, also show English translit as a helper */}
          {step.translit?.en && lang !== "en" && lang !== "te" && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">IAST</div>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap italic text-foreground/75">
                {step.translit.en}
              </pre>
            </div>
          )}

          {/* Addendum note */}
          {step.addendum && (
            <div className="pt-3 gold-hairline">
              <p className={`text-sm text-foreground/80 italic ${translitClass}`}>
                {step.addendum[lang] || step.addendum.en}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NityaPooja() {
  const { lang } = useApp();
  const [openIds, setOpenIds] = useState(new Set([AUTHENTIC_POOJA.steps[0].id]));
  const [ishtaId, setIshtaId] = useState("ganesha");
  const [panch, setPanch] = useState(null);

  useEffect(() => {
    axios.get(`${API}/panchangam`).then((r) => setPanch(r.data)).catch(() => {});
  }, []);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const expandAll = () => setOpenIds(new Set(AUTHENTIC_POOJA.steps.map((s) => s.id)));
  const collapseAll = () => setOpenIds(new Set());

  const ishtaDeity = DEITIES.find((d) => d.id === ishtaId) || DEITIES[0];
  const ishtaStotra = ISHTA_STOTRAM_MAP[ishtaId] || ISHTA_STOTRAM_MAP.ganesha;

  const introText = lang === "te" ? AUTHENTIC_POOJA.intro_te : AUTHENTIC_POOJA.intro_en;

  return (
    <div className="space-y-10">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Nitya Pūjā Vidhānam</div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
          {t(lang, "nitya_pooja")}
        </h1>
        <p className={`mt-3 text-foreground/80 max-w-3xl leading-relaxed ${lang === "te" ? "font-telugu" : ""}`}>
          {introText}
        </p>

        {panch && (
          <div className="mt-4 rounded-xl p-3 bg-[hsl(var(--gold)/0.08)] gold-border inline-flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-muted-foreground">{t(lang, "today_panch")}:</span>
            <span><b>{lang === "te" ? panch.samvatsara_te : panch.samvatsara}</b> {t(lang, "samvatsara_short")}</span>
            <span>{lang === "te" ? panch.ayana_te : panch.ayana}</span>
            <span>{lang === "te" ? panch.ruthu_te : panch.ruthu} ṛtu</span>
            <span>{lang === "te" ? panch.masa_te : panch.masa} māsa</span>
            <span>{lang === "te" ? panch.paksha_te : panch.paksha}</span>
            <span>{lang === "te" ? panch.tithi_te : panch.tithi}</span>
            <span>{panch.vara}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={expandAll} data-testid="expand-all-btn" className="text-xs rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]">
            {t(lang, "expand_all")}
          </button>
          <button onClick={collapseAll} data-testid="collapse-all-btn" className="text-xs rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]">
            {t(lang, "collapse_all")}
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
        <p className="text-sm text-foreground/70 mb-4">{t(lang, "ishta_help")}</p>

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

      {/* Steps timeline */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-saffron" />
          <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
            {t(lang, "step_by_step")}
          </h2>
        </div>

        {AUTHENTIC_POOJA.steps.map((s, i) => (
          <StepCard
            key={s.id}
            step={s}
            open={openIds.has(s.id)}
            onToggle={() => toggle(s.id)}
            lang={lang}
            panch={panch}
          />
        ))}

        <div className="mt-6 text-center text-2xl font-display text-kumkum dark:text-[hsl(var(--gold))]">
          — శుభం • Śubham —
        </div>
      </div>
    </div>
  );
}
