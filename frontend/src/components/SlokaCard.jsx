import React from "react";
import { useApp } from "@/context/AppContext";
import { pickLang, t } from "@/lib/i18n";
import { Play, Pause } from "lucide-react";
import VoiceSlokaReader from "@/components/VoiceSlokaReader";

/**
 * SlokaCard — displays sanskrit + transliteration + meaning in current language.
 * Props: sloka (string devanagari), translit ({en,te,hi,ta}), meaning ({en,te,hi,ta}),
 *        audio ({title, url}) optional, title (string), subtitle (string) optional
 */
export default function SlokaCard({ sloka, translit, meaning, audio, title, subtitle, dense = false }) {
  const { lang, playTrack, nowPlaying, isPlaying, stopTrackAndResumeBackground } = useApp();
  const langFontClass = lang === "te" ? "font-telugu" : lang === "ta" ? "font-tamil" : "font-devanagari";

  const isThisPlaying = audio && nowPlaying && nowPlaying.url === audio.url && isPlaying;

  const onPlayClick = () => {
    if (!audio?.url) return;
    if (isThisPlaying) stopTrackAndResumeBackground();
    else playTrack({ title: audio.title || title || "Sloka", url: audio.url });
  };

  return (
    <div data-testid="sloka-card" className="sacred-card grain animate-rise">
      {(title || subtitle) && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {title && <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{title}</h3>}
            {subtitle && <div className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
          {audio?.url && (
            <button
              onClick={onPlayClick}
              data-testid="sloka-play-btn"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 transition diya-glow"
            >
              {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isThisPlaying ? t(lang, "stop_sloka") : t(lang, "play_sloka")}
            </button>
          )}
        </div>
      )}

      {/* Sanskrit Devanagari */}
      {sloka && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{t(lang, "sanskrit")}</div>
          <pre className="font-devanagari text-lg sm:text-xl leading-relaxed whitespace-pre-wrap text-foreground/95">
            {sloka}
          </pre>
        </div>
      )}

      {/* Transliteration */}
      {translit && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{t(lang, "transliteration")}</div>
          <pre className={`text-base leading-relaxed whitespace-pre-wrap italic text-foreground/85 ${langFontClass}`}>
            {pickLang(translit, lang)}
          </pre>
        </div>
      )}

      {/* Meaning */}
      {meaning && !dense && (
        <div className="pt-3 gold-hairline">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{t(lang, "meaning")}</div>
          <p className={`text-sm sm:text-base leading-relaxed text-foreground/85 ${langFontClass}`}>
            {pickLang(meaning, lang)}
          </p>
        </div>
      )}

      {/* Voice narration with karaoke word highlighting */}
      {sloka && !dense && (
        <VoiceSlokaReader
          text={sloka}
          meaning={meaning ? pickLang(meaning, lang === "sa" ? "en" : lang) : ""}
          langHint="hi-IN"
        />
      )}
    </div>
  );
}
