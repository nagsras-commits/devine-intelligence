import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bell, BellOff, BellRing, MapPin, Moon, Sunrise } from "lucide-react";
import useGeolocation from "@/hooks/useGeolocation";
import { BACKGROUND_CHANTS } from "@/data/deities";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PREF_KEY = "dj_brahma_alarm_v1";
const STATE_KEY = "dj_brahma_alarm_state_v1";
const ENDPOINT_KEY = "dj_brahma_alarm_endpoint_v1";
const SNOOZE_MS = 5 * 60 * 1000;

const localDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPreference = () => {
  try { return localStorage.getItem(PREF_KEY) === "true"; }
  catch { return false; }
};

const getAlarmState = (date) => {
  try {
    const state = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
    return state?.date === date ? state : { date, dismissed: false, snoozeUntil: 0 };
  } catch { return { date, dismissed: false, snoozeUntil: 0 }; }
};

const decodeVapidKey = (key) => {
  const padded = key.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(key.length / 4) * 4, "=");
  return Uint8Array.from(window.atob(padded), (character) => character.charCodeAt(0));
};

export default function BrahmaMuhurtaAlarm() {
  const geo = useGeolocation();
  const [enabled, setEnabled] = useState(getPreference);
  const [today, setToday] = useState(() => localDate());
  const [data, setData] = useState(null);
  const [ringing, setRinging] = useState(false);
  const [alarmState, setAlarmState] = useState(() => getAlarmState(localDate()));
  const [notifStatus, setNotifStatus] = useState(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  const [pushConfig, setPushConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [nextAlarmAt, setNextAlarmAt] = useState(null);
  const [message, setMessage] = useState("");
  const audioRef = useRef(null);
  const syncedSubscriptionRef = useRef("");

  useEffect(() => {
    axios.get(`${API}/brahma-alarm/config`)
      .then((response) => setPushConfig(response.data))
      .catch(() => setPushConfig({ available: false }));
  }, []);

  useEffect(() => {
    const params = {
      date_str: today,
      tz_offset: -new Date().getTimezoneOffset() / 60,
    };
    if (geo.status === "ready") {
      params.lat = geo.lat;
      params.lng = geo.lng;
      params.tz_offset = geo.tz_offset;
    }
    axios.get(`${API}/panchangam/timings`, { params })
      .then((response) => setData(response.data))
      .catch(() => setData(null));
  }, [today, geo.status, geo.lat, geo.lng, geo.tz_offset]);

  useEffect(() => {
    const refreshDate = () => {
      const today = localDate();
      setToday((current) => current === today ? current : today);
      setAlarmState((current) => current.date === today ? current : getAlarmState(today));
    };
    const id = setInterval(refreshDate, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(alarmState)); } catch {}
  }, [alarmState]);

  useEffect(() => {
    if (!ringing || !data) return undefined;
    const chant = BACKGROUND_CHANTS[0];
    if (chant?.url) {
      const audio = new Audio(chant.url);
      audio.loop = true;
      audio.volume = 0.55;
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [ringing, data]);

  useEffect(() => {
    if (!enabled || !pushConfig?.available || geo.status !== "ready" || notifStatus !== "granted" || !("serviceWorker" in navigator)) return undefined;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const syncId = `${geo.lat}:${geo.lng}:${timeZone}`;
    if (syncedSubscriptionRef.current === syncId) return undefined;
    syncedSubscriptionRef.current = syncId;
    let active = true;
    setSaving(true);
    (async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) throw new Error("No browser push subscription. Turn the alarm off and on to restore it.");
        const response = await axios.post(`${API}/brahma-alarm/subscription`, {
          subscription: subscription.toJSON(),
          lat: geo.lat,
          lng: geo.lng,
          tz_offset: geo.tz_offset,
          time_zone: timeZone,
        });
        if (active) {
          setNextAlarmAt(response.data.next_alarm_at);
          setMessage("Daily background alarm is scheduled.");
        }
      } catch (error) {
        syncedSubscriptionRef.current = "";
        if (active) setMessage(error.response?.data?.detail || error.message || "Could not refresh the background alarm.");
      } finally {
        if (active) setSaving(false);
      }
    })();
    return () => { active = false; };
  }, [enabled, pushConfig, geo.status, geo.lat, geo.lng, geo.tz_offset, notifStatus]);

  useEffect(() => {
    if (!enabled || !data?.timings?.brahma_muhurta) return undefined;
    const checkAlarm = () => {
      const today = localDate();
      const currentState = alarmState.date === today ? alarmState : getAlarmState(today);
      const timing = data.timings.brahma_muhurta;
      const [startHour, startMinute] = timing.start.split(":").map(Number);
      const [endHour, endMinute] = timing.end.split(":").map(Number);
      const start = new Date();
      start.setHours(startHour, startMinute, 0, 0);
      const end = new Date();
      end.setHours(endHour, endMinute, 0, 0);
      const now = Date.now();
      if (now >= end.getTime()) {
        setRinging(false);
        return;
      }
      if (now >= start.getTime() && !currentState.dismissed && now >= currentState.snoozeUntil) {
        setRinging(true);
      }
    };
    checkAlarm();
    const id = setInterval(checkAlarm, 10000);
    return () => clearInterval(id);
  }, [enabled, data, alarmState]);

  const toggleAlarm = async () => {
    if (saving) return;
    if (!enabled && !pushConfig?.available) {
      setMessage("Background delivery is not configured on this server yet.");
      return;
    }
    if (!enabled && geo.status !== "ready") {
      if (geo.status !== "loading") geo.request();
      setMessage("Allow location access, then turn on the alarm to calculate your local sunrise.");
      return;
    }

    setSaving(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (enabled) {
        const endpoint = subscription?.endpoint || localStorage.getItem(ENDPOINT_KEY);
        if (endpoint) {
          await axios.delete(`${API}/brahma-alarm/subscription`, { params: { endpoint } });
        }
        registration.active?.postMessage({ type: "cancel-brahma-notifications" });
        if (subscription) await subscription.unsubscribe();
        try { localStorage.removeItem(ENDPOINT_KEY); } catch {}
        syncedSubscriptionRef.current = "";
        setEnabled(false);
        setRinging(false);
        setNextAlarmAt(null);
        setMessage("Alarm is off; its server schedule and browser subscription were canceled.");
        try { localStorage.setItem(PREF_KEY, "false"); } catch {}
        return;
      }

      if (typeof Notification === "undefined" || !("PushManager" in window)) {
        throw new Error("This browser does not support background push notifications.");
      }
      let permission = Notification.permission;
      if (permission === "default") permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission !== "granted") throw new Error("Allow notifications in your browser to enable the background alarm.");

      const pushSubscription = subscription || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeVapidKey(pushConfig.public_key),
      });
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const response = await axios.post(`${API}/brahma-alarm/subscription`, {
        subscription: pushSubscription.toJSON(),
        lat: geo.lat,
        lng: geo.lng,
        tz_offset: geo.tz_offset,
        time_zone: timeZone,
      });
      try {
        localStorage.setItem(ENDPOINT_KEY, pushSubscription.endpoint);
        localStorage.setItem(PREF_KEY, "true");
      } catch {}
      syncedSubscriptionRef.current = `${geo.lat}:${geo.lng}:${timeZone}`;
      setNextAlarmAt(response.data.next_alarm_at);
      setEnabled(true);
      setMessage("Daily background alarm is scheduled.");
    } catch (error) {
      setMessage(error.response?.data?.detail || error.message || "Could not update the background alarm.");
    } finally {
      setSaving(false);
    }
  };

  const silence = (snooze) => {
    setRinging(false);
    const today = localDate();
    setAlarmState({
      date: today,
      dismissed: !snooze,
      snoozeUntil: snooze ? Date.now() + SNOOZE_MS : 0,
    });
  };

  const timing = data?.timings?.brahma_muhurta;

  return (
    <section className="sacred-card grain" data-testid="brahma-muhurta-alarm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full gold-border bg-[hsl(var(--gold)/0.1)]">
            <Sunrise className="h-5 w-5 text-saffron" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Brahma Muhūrta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {timing ? `Today ${timing.start} – ${timing.end}` : "Calculating today's sunrise timings…"}
              {data?.sunrise ? ` · Sunrise ${data.sunrise}` : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Daily Brahma Muhurta background alarm"
          data-testid="brahma-alarm-toggle"
          onClick={toggleAlarm}
          disabled={saving || (!enabled && (pushConfig === null || !pushConfig.available))}
          className={`inline-flex min-w-28 items-center justify-between gap-3 rounded-full px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${enabled ? "bg-[hsl(var(--kumkum))] text-white" : "gold-border hover:bg-[hsl(var(--gold)/0.1)]"}`}
        >
          <span>{saving ? "Working…" : enabled ? "Alarm on" : "Alarm off"}</span>
          <span className={`relative h-5 w-9 rounded-full transition ${enabled ? "bg-white/35" : "bg-black/20"}`} aria-hidden="true">
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-0.5"}`} />
          </span>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--gold)/0.2)] pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-saffron" />
          {data?.source === "geolocation" ? "Sunrise calculated for your location" : "Approximate sunrise; allow location for accuracy"}
        </span>
        {geo.status !== "ready" && geo.status !== "loading" && (
          <button type="button" onClick={geo.request} className="text-kumkum underline underline-offset-2 dark:text-[hsl(var(--gold))]">
            Use my location
          </button>
        )}
        {enabled && nextAlarmAt && <span>Next alarm: {new Date(nextAlarmAt).toLocaleString()}</span>}
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {pushConfig === null
          ? "Checking background alarm service…"
          : !pushConfig.available
            ? "Background delivery is unavailable until this server is configured for Web Push."
            : "Delivered through browser push while the app is closed; device connectivity and power settings can affect delivery."}
      </p>
      {message && <p role="status" className="mt-2 text-xs text-muted-foreground">{message}</p>}

      {ringing && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg gold-border bg-[hsl(var(--gold)/0.08)] p-3" role="alert" data-testid="brahma-alarm-ringing">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BellRing className="h-4 w-4 animate-pulse text-saffron" />
            Brahma Muhūrta is now. Your reminder stays active until {timing?.end}.
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => silence(true)} className="inline-flex items-center gap-1.5 rounded-md gold-border px-3 py-1.5 text-xs hover:bg-[hsl(var(--gold)/0.12)]">
              <Moon className="h-3.5 w-3.5" /> Snooze 5 min
            </button>
            <button type="button" onClick={() => silence(false)} className="rounded-md bg-[hsl(var(--kumkum))] px-3 py-1.5 text-xs text-white hover:opacity-90">
              Dismiss today
            </button>
          </div>
        </div>
      )}
    </section>
  );
}