import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FESTIVALS } from "@/data/festivals";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import { Flame, ScrollText, BookOpen, Sparkles } from "lucide-react";

export default function Festivals() {
  const { lang } = useApp();
  const location = useLocation();

  const sorted = useMemo(() => {
    const today = new Date();
    const doy = (d) => (d.getMonth() + 1) * 31 + d.getDate();
    const today_v = doy(today);
    return FESTIVALS.map((f) => {
      const fd = new Date(today.getFullYear(), f.month - 1, f.day);
      let dist = doy(fd) - today_v;
      if (dist < 0) dist += 372;
      return { ...f, dist };
    }).sort((a, b) => a.dist - b.dist);
  }, []);

  const [selectedId, setSelectedId] = useState(sorted[0]?.id);

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (hash && FESTIVALS.some((f) => f.id === hash)) setSelectedId(hash);
  }, [location]);

  const selected = sorted.find((f) => f.id === selectedId) || sorted[0];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Utsavāḥ</div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "festivals")}</h1>
        <p className="mt-2 text-foreground/70 max-w-2xl">
          Story, celebration, pooja vidhi and mantras — every major festival, all in one column.
        </p>
      </header>

      <div className="grid lg:grid-cols-[280px,1fr] gap-6">
        {/* List */}
        <aside className="space-y-2 lg:sticky lg:top-24 lg:self-start">
          {sorted.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              data-testid={`festival-item-${f.id}`}
              className={`w-full text-left rounded-2xl p-3 transition-all border ${
                selectedId === f.id
                  ? "bg-[hsl(var(--gold)/0.18)] border-[hsl(var(--gold))] diya-glow"
                  : "gold-border bg-card hover:bg-[hsl(var(--gold)/0.08)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-saffron" />
                <div className="flex-1">
                  <div className="font-medium">{pickLang(f.name, lang)}</div>
                  <div className="text-[11px] text-muted-foreground">in {f.dist} day{f.dist === 1 ? "" : "s"} • {f.deity}</div>
                </div>
              </div>
            </button>
          ))}
        </aside>

        {/* Detail column */}
        {selected && (
          <article data-testid="festival-detail" className="sacred-card grain space-y-6" id={selected.id}>
            <div>
              <div className="font-devanagari text-4xl text-kumkum dark:text-[hsl(var(--gold))]">{pickLang(selected.name, "sa") || pickLang(selected.name, "hi")}</div>
              <h2 className="mt-1 text-3xl font-semibold">{pickLang(selected.name, lang)}</h2>
              <div className="mt-1 text-sm text-muted-foreground">Deity: {selected.deity} • in {selected.dist} day{selected.dist === 1 ? "" : "s"}</div>
            </div>

            <section>
              <div className="flex items-center gap-2 mb-1">
                <ScrollText className="w-4 h-4 text-saffron" />
                <h3 className="font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "story")}</h3>
              </div>
              <p className="text-foreground/85 leading-relaxed">{selected.story}</p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-saffron" />
                <h3 className="font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "how_to_celebrate")}</h3>
              </div>
              <p className="text-foreground/85 leading-relaxed">{selected.celebration}</p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-saffron" />
                <h3 className="font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]">{t(lang, "pooja_vidhi")}</h3>
              </div>
              <pre className="whitespace-pre-wrap text-foreground/85 leading-relaxed font-sans text-sm">
                {selected.pooja_vidhi}
              </pre>
            </section>

            <section>
              <h3 className="font-display text-lg text-kumkum dark:text-[hsl(var(--gold))] mb-2">{t(lang, "mantras")}</h3>
              <div className="space-y-3">
                {selected.mantras.map((m, i) => (
                  <pre key={i} className="font-devanagari text-lg whitespace-pre-wrap rounded-xl p-3 bg-[hsl(var(--gold)/0.08)] gold-border">
                    {m}
                  </pre>
                ))}
              </div>
            </section>
          </article>
        )}
      </div>
    </div>
  );
}
