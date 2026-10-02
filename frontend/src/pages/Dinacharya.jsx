import React, { useEffect, useState } from "react";
import axios from "axios";
import { RITUALS } from "@/data/rituals";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import SlokaCard from "@/components/SlokaCard";
import PageHero from "@/components/PageHero";
import * as Lucide from "lucide-react";
import { Check } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dinacharya() {
  const { lang, deviceId } = useApp();
  const [doneIds, setDoneIds] = useState([]);
  const [openId, setOpenId] = useState(RITUALS[0].id);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    axios.get(`${API}/rituals/done`, { params: { device_id: deviceId, date_str: today } })
      .then((r) => setDoneIds(r.data || []))
      .catch(() => {});
  }, [deviceId, today]);

  const toggleDone = async (id) => {
    const isDone = doneIds.includes(id);
    try {
      if (isDone) {
        await axios.delete(`${API}/rituals/done`, { params: { ritual_id: id, device_id: deviceId, date_str: today } });
        setDoneIds((d) => d.filter((x) => x !== id));
      } else {
        await axios.post(`${API}/rituals/done`, { ritual_id: id, device_id: deviceId, date_str: today });
        setDoneIds((d) => [...d, id]);
      }
    } catch {}
  };

  return (
    <div className="space-y-8">
      <PageHero
        bannerId="dinacharya"
        eyebrow="Dinacharya"
        title={t(lang, "dinacharya")}
        sanskritTitle="दिनचर्या"
        subtitle="A day lived in ślokas — from waking to sleeping, each threshold has a sacred verse."
      />

      <div className="relative pl-6 sm:pl-8">
        {/* Vertical gold line */}
        <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-[hsl(var(--gold)/0.4)]" aria-hidden />

        <div className="space-y-6">
          {RITUALS.map((r) => {
            const Icon = Lucide[r.icon] || Lucide.Circle;
            const isDone = doneIds.includes(r.id);
            const isOpen = openId === r.id;
            return (
              <div key={r.id} className="relative" data-testid={`ritual-${r.id}`}>
                {/* Node dot */}
                <div className={`absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full grid place-items-center gold-border ${isDone ? "bg-saffron" : "bg-background"}`}>
                  {isDone && <Check className="w-3 h-3 text-white" />}
                </div>

                <button
                  onClick={() => setOpenId(isOpen ? "" : r.id)}
                  data-testid={`ritual-toggle-${r.id}`}
                  className="w-full text-left sacred-card grain group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full grid place-items-center bg-[hsl(var(--gold)/0.15)] gold-border text-kumkum dark:text-[hsl(var(--gold))]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{r.time}</div>
                      <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{pickLang(r.title, lang)}</h3>
                    </div>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); toggleDone(r.id); }}
                      data-testid={`ritual-done-${r.id}`}
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition ${
                        isDone
                          ? "bg-[hsl(var(--gold)/0.2)] text-kumkum dark:text-[hsl(var(--gold))] gold-border"
                          : "gold-border hover:bg-[hsl(var(--gold)/0.1)]"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> {isDone ? t(lang, "done_today") : t(lang, "mark_done")}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3">
                    <SlokaCard
                      sloka={r.sanskrit}
                      translit={r.translit}
                      meaning={r.meaning}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
