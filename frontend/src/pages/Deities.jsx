import React from "react";
import { Link } from "react-router-dom";
import { DEITIES } from "@/data/deities";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import DeityImage from "@/components/DeityImage";
import PageHero from "@/components/PageHero";

export default function Deities() {
  const { lang } = useApp();
  return (
    <div className="space-y-8">
      <PageHero
        bannerId="deities"
        eyebrow="Devāḥ & Devyaḥ"
        title={t(lang, "deities")}
        sanskritTitle="देवाः देव्यश्च"
        subtitle="Mūla mantras, dhyāna ślokas, aṣṭottara names, sahasranāma and songs of every deity."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {DEITIES.map((d) => (
          <Link
            key={d.id}
            to={`/deities/${d.id}`}
            data-testid={`deity-tile-${d.id}`}
            className="group relative rounded-2xl overflow-hidden gold-border diya-glow hover:diya-glow-strong transition-all bg-card"
          >
            <div className="aspect-[3/4] relative transition-transform duration-500 group-hover:scale-[1.02]">
              <DeityImage deity={d} lang={lang} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="font-devanagari text-xl leading-none drop-shadow-lg">{pickLang(d.name, "sa")}</div>
              <div className="text-base font-medium mt-1 drop-shadow-lg">{pickLang(d.name, lang)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest opacity-90">
                {d.stotras?.length || 0} stotras • {d.ashtottara_sample?.length || 0}+ names
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
