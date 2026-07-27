import React from "react";
import { Link } from "react-router-dom";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import DeityIcon from "@/components/DeityIcon";

export default function Deities() {
  const { lang } = useApp();
  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Devāḥ & Devyaḥ</div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "deities")}</h1>
        <p className="mt-2 text-foreground/70 max-w-2xl">
          Mūla mantras, dhyāna ślokas, aṣṭottara names, sahasranāma and songs of every deity.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {DEITIES.map((d) => (
          <Link
            key={d.id}
            to={`/deities/${d.id}`}
            data-testid={`deity-tile-${d.id}`}
            className="group relative rounded-2xl overflow-hidden gold-border diya-glow hover:diya-glow-strong transition-all bg-card"
          >
            <div className="aspect-[3/4] relative transition-transform duration-500 group-hover:scale-[1.02]">
              <DeityIcon deity={d} lang={lang} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="text-base font-medium">{pickLang(d.name, lang)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest opacity-80">
                {d.stotras?.length || 0} stotras • {d.ashtottara_sample?.length || 0}+ names
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
