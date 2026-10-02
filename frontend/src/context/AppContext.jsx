import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BACKGROUND_CHANTS } from "@/data/deities";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const LS_LANG = "dj_lang";
const LS_MUTE = "dj_muted";
const LS_CHANT = "dj_chant";
const LS_DEVICE = "dj_device";
const LS_VOL = "dj_volume";

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(LS_LANG) || "en");
  const [muted, setMuted] = useState(() => localStorage.getItem(LS_MUTE) === "true");
  const [chantId, setChantId] = useState(() => localStorage.getItem(LS_CHANT) || "om");
  const [volume, setVolumeState] = useState(() => {
    const v = parseFloat(localStorage.getItem(LS_VOL));
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1.0;
  });
  const [nowPlaying, setNowPlaying] = useState(null);
  const [deviceId] = useState(() => {
    let id = localStorage.getItem(LS_DEVICE);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(LS_DEVICE, id); }
    return id;
  });

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => { localStorage.setItem(LS_LANG, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(LS_MUTE, String(muted)); }, [muted]);
  useEffect(() => { localStorage.setItem(LS_CHANT, chantId); }, [chantId]);
  useEffect(() => { localStorage.setItem(LS_VOL, String(volume)); }, [volume]);

  const currentTrack = useMemo(() => {
    if (nowPlaying) return nowPlaying;
    const c = BACKGROUND_CHANTS.find((x) => x.id === chantId) || BACKGROUND_CHANTS[0];
    return { title: c.label, url: c.url, isBackground: true };
  }, [nowPlaying, chantId]);

  // Init audio element once. NOTE: NO crossOrigin, NO Web Audio graph — cross-origin
  // archive.org audio would be silenced otherwise (CORS zero-output rule).
  useEffect(() => {
    if (audioRef.current) return;
    const el = new Audio();
    el.loop = true;
    el.preload = "auto";
    el.volume = volume;
    audioRef.current = el;
    el.addEventListener("play", () => { setIsPlaying(true); setAutoplayBlocked(false); });
    el.addEventListener("pause", () => setIsPlaying(false));
    el.addEventListener("ended", () => setIsPlaying(false));
    // eslint-disable-next-line
  }, []);

  // Apply volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Load track and (try to) play
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.src !== currentTrack.url) el.src = currentTrack.url;
    el.loop = !!currentTrack.isBackground;
    if (!muted) {
      el.play().then(() => setAutoplayBlocked(false)).catch(() => setAutoplayBlocked(true));
    }
  }, [currentTrack, muted]);

  // First user gesture retry (satisfies browser autoplay policies)
  useEffect(() => {
    if (muted) return;
    const kick = async () => {
      const el = audioRef.current;
      if (el && el.paused && !muted) {
        try { await el.play(); setAutoplayBlocked(false); } catch {}
      }
    };
    const opts = { once: true, capture: true };
    window.addEventListener("pointerdown", kick, opts);
    window.addEventListener("keydown", kick, opts);
    window.addEventListener("touchstart", kick, opts);
    return () => {
      window.removeEventListener("pointerdown", kick, opts);
      window.removeEventListener("keydown", kick, opts);
      window.removeEventListener("touchstart", kick, opts);
    };
  }, [muted, autoplayBlocked]);

  const play = async () => {
    const el = audioRef.current; if (!el) return;
    try { await el.play(); setMuted(false); } catch {}
  };
  const pause = () => { audioRef.current?.pause(); };

  const toggleMute = async () => {
    if (isPlaying) { pause(); setMuted(true); }
    else { setMuted(false); await play(); }
  };

  const setVolume = (v) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (clamped > 0 && muted) {
      setMuted(false);
      play();
    }
  };

  const playTrack = async (track) => {
    setNowPlaying({ ...track, isBackground: false });
    setTimeout(async () => {
      const el = audioRef.current; if (!el) return;
      el.currentTime = 0;
      try { await el.play(); setMuted(false); } catch {}
    }, 50);
  };

  const stopTrackAndResumeBackground = async () => {
    setNowPlaying(null);
    setTimeout(async () => {
      const el = audioRef.current; if (!el) return;
      try { await el.play(); } catch {}
    }, 50);
  };

  const value = {
    lang, setLang,
    muted, isPlaying, toggleMute, autoplayBlocked,
    chantId, setChantId,
    volume, setVolume, volumeMax: 1.0,
    currentTrack, nowPlaying,
    playTrack, stopTrackAndResumeBackground, pause, play,
    deviceId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
