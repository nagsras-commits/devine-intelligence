import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BACKGROUND_CHANTS } from "@/data/deities";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const LS_LANG = "dj_lang";
const LS_MUTE = "dj_muted";
const LS_CHANT = "dj_chant";
const LS_DEVICE = "dj_device";

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(LS_LANG) || "en");
  const [muted, setMuted] = useState(() => localStorage.getItem(LS_MUTE) !== "false");
  const [chantId, setChantId] = useState(() => localStorage.getItem(LS_CHANT) || "om");
  const [nowPlaying, setNowPlaying] = useState(null); // {title, url} - overrides background chant when set
  const [deviceId] = useState(() => {
    let id = localStorage.getItem(LS_DEVICE);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(LS_DEVICE, id);
    }
    return id;
  });

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => { localStorage.setItem(LS_LANG, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(LS_MUTE, String(muted)); }, [muted]);
  useEffect(() => { localStorage.setItem(LS_CHANT, chantId); }, [chantId]);

  const currentTrack = useMemo(() => {
    if (nowPlaying) return nowPlaying;
    const c = BACKGROUND_CHANTS.find(x => x.id === chantId) || BACKGROUND_CHANTS[0];
    return { title: c.label, url: c.url, isBackground: true };
  }, [nowPlaying, chantId]);

  // Manage HTMLAudio - single element
  useEffect(() => {
    if (!audioRef.current) {
      const el = new Audio();
      el.loop = true;
      el.volume = 0.55;
      el.preload = "auto";
      el.crossOrigin = "anonymous";
      audioRef.current = el;
      el.addEventListener("play", () => setIsPlaying(true));
      el.addEventListener("pause", () => setIsPlaying(false));
      el.addEventListener("ended", () => setIsPlaying(false));
    }
  }, []);

  // Update src when track changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.src !== currentTrack.url) {
      el.src = currentTrack.url;
    }
    el.loop = !!currentTrack.isBackground;
  }, [currentTrack]);

  // Play/pause based on muted state; users need to unmute (first tap) to satisfy autoplay policies
  const play = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      await el.play();
      setMuted(false);
    } catch {
      // autoplay blocked
    }
  };

  const pause = () => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
  };

  const toggleMute = async () => {
    if (isPlaying) {
      pause();
      setMuted(true);
    } else {
      await play();
    }
  };

  const playTrack = async (track) => {
    // track: {title, url}
    setNowPlaying({ ...track, isBackground: false });
    setTimeout(async () => {
      const el = audioRef.current;
      if (!el) return;
      el.currentTime = 0;
      try {
        await el.play();
        setMuted(false);
      } catch {}
    }, 50);
  };

  const stopTrackAndResumeBackground = async () => {
    setNowPlaying(null);
    setTimeout(async () => {
      const el = audioRef.current;
      if (!el) return;
      try {
        await el.play();
      } catch {}
    }, 50);
  };

  const value = {
    lang, setLang,
    muted, isPlaying, toggleMute,
    chantId, setChantId,
    currentTrack, nowPlaying,
    playTrack, stopTrackAndResumeBackground, pause, play,
    deviceId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
