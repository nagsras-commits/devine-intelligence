import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

/**
 * VoiceSlokaReader — narrates a Sanskrit sloka using the browser's
 * SpeechSynthesis engine and highlights each word as it's spoken (karaoke).
 *
 * Props:
 *  - text (string, required): sanskrit devanagari text to read (multi-line ok)
 *  - meaning (string, optional): English meaning to read after the sloka
 *  - langHint ("hi-IN" | "sa" | ...): passed as utterance.lang
 *  - onDone(): optional callback
 */
export default function VoiceSlokaReader({ text, meaning, langHint = "hi-IN", size = "sm" }) {
  const { pause: pauseBg, play: playBg, isPlaying } = useApp() || {};
  const [speaking, setSpeaking] = useState(false);
  const [wordIdx, setWordIdx] = useState(-1);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const bgWasPlayingRef = useRef(false);
  const utterRef = useRef(null);

  // Tokenize the sloka into words while preserving whitespace/newlines
  const tokens = useMemo(() => {
    if (!text) return [];
    // Match Devanagari + trailing punctuation, or whitespace
    const parts = text.split(/(\s+)/);
    return parts.map((p) => ({ text: p, isWord: !/^\s+$/.test(p) && p.length > 0 }));
  }, [text]);

  const wordIndices = useMemo(() =>
    tokens.reduce((acc, tok, i) => (tok.isWord ? [...acc, i] : acc), [])
  , [tokens]);

  const start = () => {
    if (!supported || !text || speaking) return;
    // Duck bg chant
    bgWasPlayingRef.current = !!isPlaying;
    if (isPlaying) pauseBg?.();

    const synth = window.speechSynthesis;
    try { synth.cancel(); } catch {}

    const u = new SpeechSynthesisUtterance(text);
    u.lang = langHint;
    u.rate = 0.75;
    u.pitch = 1.0;
    u.volume = 1.0;
    // Prefer an Indic voice if available
    const voices = synth.getVoices();
    const indic = voices.find((v) => /hi|sa|IN/i.test(v.lang)) || voices.find((v) => /Devan|Hindi|India/i.test(v.name));
    if (indic) u.voice = indic;

    let charOffset = 0;
    u.onstart = () => setSpeaking(true);
    u.onboundary = (evt) => {
      if (evt.name === "word" || evt.charIndex != null) {
        charOffset = evt.charIndex;
        // Find which token contains this charIndex
        let pos = 0, hit = -1;
        for (let i = 0; i < tokens.length; i++) {
          const t = tokens[i];
          const end = pos + t.text.length;
          if (charOffset >= pos && charOffset < end && t.isWord) { hit = i; break; }
          pos = end;
        }
        if (hit >= 0) setWordIdx(hit);
      }
    };
    u.onend = () => {
      setSpeaking(false); setWordIdx(-1);
      if (bgWasPlayingRef.current) playBg?.().catch?.(() => {});
      // Read English meaning as an appendix
      if (meaning) {
        const m = new SpeechSynthesisUtterance(meaning);
        m.lang = "en-IN"; m.rate = 0.9;
        const enVoice = voices.find((v) => /en-IN|en-GB|en-US/i.test(v.lang));
        if (enVoice) m.voice = enVoice;
        synth.speak(m);
      }
    };
    u.onerror = () => { setSpeaking(false); setWordIdx(-1); };
    utterRef.current = u;
    synth.speak(u);
  };

  const stop = () => {
    try { window.speechSynthesis.cancel(); } catch {}
    setSpeaking(false); setWordIdx(-1);
    if (bgWasPlayingRef.current) playBg?.().catch?.(() => {});
  };

  // Cleanup on unmount
  useEffect(() => () => { try { window.speechSynthesis.cancel(); } catch {} }, []);

  if (!supported || !text) return null;

  return (
    <div className="mt-3 rounded-xl gold-border p-3 bg-[hsl(var(--gold)/0.04)]" data-testid="voice-sloka">
      <div className="flex items-center gap-2 mb-2">
        {!speaking ? (
          <button
            onClick={start}
            data-testid="voice-sloka-play"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow"
          >
            <Mic className="w-3.5 h-3.5" /> Read aloud (karaoke)
          </button>
        ) : (
          <button
            onClick={stop}
            data-testid="voice-sloka-stop"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--kumkum)/0.15)]"
          >
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        )}
        {speaking && (
          <span className="inline-flex items-center gap-1 text-[11px] text-saffron">
            <Loader2 className="w-3 h-3 animate-spin" /> Chanting… follow the highlighted word
          </span>
        )}
      </div>

      {/* Karaoke line — same devanagari text, with active word highlighted */}
      <div className={`font-devanagari leading-relaxed text-foreground/90 ${size === "lg" ? "text-2xl" : "text-lg"}`}>
        {tokens.map((tok, i) => (
          <span
            key={i}
            className={`${tok.isWord && i === wordIdx ? "px-1 rounded bg-[hsl(var(--gold)/0.4)] text-kumkum dark:text-[hsl(var(--gold))] transition-all" : ""}`}
            style={{ whiteSpace: tok.isWord ? "normal" : "pre-wrap" }}
          >
            {tok.text}
          </span>
        ))}
      </div>
    </div>
  );
}
