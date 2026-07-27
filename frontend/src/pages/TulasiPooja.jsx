import React, { useState } from "react";
import { TULASI_POOJA } from "@/data/tulasi_pooja";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import * as Lucide from "lucide-react";
import { ChevronDown, Package, Leaf, Info } from "lucide-react";

function StepCard({ step, open, onToggle, lang }) {
  const Icon = (step.icon && Lucide[step.icon]) || Lucide.Circle;
  const translitClass = lang === "te" ? "font-telugu" : lang === "ta" ? "font-tamil" : "font-devanagari";
  const instructions = step.instructions?.[lang] || step.instructions?.en;
  return (
    <div className="relative" data-testid={`tulasi-step-${step.id}`}>
      <button
        onClick={onToggle}
        data-testid={`tulasi-toggle-${step.id}`}
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
          {instructions && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {t(lang, "how_to")}
              </div>
              <p className={`text-sm sm:text-base leading-relaxed text-foreground/85 ${translitClass}`}>{instructions}</p>
            </div>
          )}
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
          {step.translit?.en && lang !== "en" && lang !== "te" && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">IAST</div>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap italic text-foreground/75">{step.translit.en}</pre>
            </div>
          )}
          {step.meaning && (
            <div className="pt-3 gold-hairline">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {t(lang, "meaning")}
              </div>
              <p className={`text-sm sm:text-base leading-relaxed text-foreground/85 ${translitClass}`}>
                {pickLang(step.meaning, lang)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TulasiPooja() {
  const { lang } = useApp();
  const [openIds, setOpenIds] = useState(new Set([TULASI_POOJA.steps[0].id, "prayer"]));

  const toggle = (id) =>
    setOpenIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const expandAll = () => setOpenIds(new Set(TULASI_POOJA.steps.map((s) => s.id)));
  const collapseAll = () => setOpenIds(new Set());

  const introText =
    lang === "te" ? TULASI_POOJA.intro_te :
    lang === "hi" ? TULASI_POOJA.intro_hi :
    lang === "ta" ? TULASI_POOJA.intro_ta :
    TULASI_POOJA.intro_en;

  return (
    <div className="space-y-10">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Tulasi Pūjā Vidhānam</div>
        <div className="flex items-center gap-3 mt-1">
          <Leaf className="w-9 h-9 text-[hsl(120,45%,35%)] animate-breathe" />
          <h1 className="text-4xl sm:text-5xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
            {t(lang, "tulasi_pooja")}
          </h1>
        </div>
        <p className={`mt-3 text-foreground/85 max-w-3xl leading-relaxed ${lang === "te" ? "font-telugu" : lang === "ta" ? "font-tamil" : ""}`}>
          {introText}
        </p>

        <div className="mt-4 rounded-xl p-3 bg-[hsl(120,45%,35%)]/8 border border-[hsl(120,45%,35%)]/30 max-w-3xl">
          <div className="flex items-start gap-2 text-sm">
            <Info className="w-4 h-4 text-[hsl(120,45%,35%)] shrink-0 mt-0.5" />
            <p className={`text-foreground/85 ${lang === "te" ? "font-telugu" : lang === "ta" ? "font-tamil" : ""}`}>
              {TULASI_POOJA.when_to_perform[lang] || TULASI_POOJA.when_to_perform.en}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={expandAll} data-testid="tulasi-expand-all" className="text-xs rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]">
            {t(lang, "expand_all")}
          </button>
          <button onClick={collapseAll} data-testid="tulasi-collapse-all" className="text-xs rounded-full px-3 py-1.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]">
            {t(lang, "collapse_all")}
          </button>
        </div>
      </header>

      {/* Materials */}
      <section className="sacred-card grain">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-saffron" />
          <h2 className="text-2xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
            {pickLang(TULASI_POOJA.materials.title, lang)}
          </h2>
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {(TULASI_POOJA.materials.items[lang] || TULASI_POOJA.materials.items.en).map((m, i) => (
            <li key={i} className={`flex items-start gap-2 text-sm text-foreground/85 ${lang === "te" ? "font-telugu" : ""}`} data-testid={`tulasi-material-${i}`}>
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[hsl(120,45%,35%)] shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <div className="space-y-5">
        {TULASI_POOJA.steps.map((s) => (
          <StepCard key={s.id} step={s} open={openIds.has(s.id)} onToggle={() => toggle(s.id)} lang={lang} />
        ))}
      </div>

      {/* Kartika masa note */}
      <section className="sacred-card grain">
        <div className="flex items-center gap-2 mb-2">
          <Lucide.Flame className="w-5 h-5 text-saffron" />
          <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Kārtika Māsa</h3>
        </div>
        <p className={`text-sm text-foreground/85 leading-relaxed ${lang === "te" ? "font-telugu" : lang === "ta" ? "font-tamil" : ""}`}>
          {TULASI_POOJA.kartika_note[lang] || TULASI_POOJA.kartika_note.en}
        </p>
      </section>

      <div className="text-center text-2xl font-display text-kumkum dark:text-[hsl(var(--gold))]">
        — శుభం • Śubham —
      </div>
    </div>
  );
}
