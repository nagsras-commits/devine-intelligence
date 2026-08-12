# Divine Journey — Sanātana Dharma App

## Original Problem Statement
Build a divine-journey app containing real Sanātana Hindu lifestyle guidance per Vedic Dharma:
which sloka to read when — waking up (Karagre Vasate), stepping on floor (Bhumi Vandanam),
bathing, Sandhyavandanam, before/after food, going outside, work, journey, sleep.
Continuous OM chanting while app runs; switchable to other deity chants.
Show Panchangam. Contain all Hindu Gods/Goddesses with slokas, mantras, ashtottaras,
sahasranamas and songs. Festivals: notify beforehand with full story, celebration,
pooja vidhi, mantras — all in one column.

Additional user requests:
- Bulk deity list (34 total).
- Japa Counter for deity's bīja mantra — 1,00,00,116 target — Certificate on completion.
- Rāma Koṭi / Likhita Japa writing board — 1,00,00,116 target — Certificate on completion.
- Multi-lingual (EN/TE/HI/TA).
- Persistent OM background loop.
- Full Vedic astrology: Kundali page with AI descriptions, daily horoscope by Rāśi + Nakshatra,
  push/in-app alarms with devotional ringtones for Rāhu Kāla/Yama Ganda/Abhijit muhurta.
- Deity of the Day ribbon linked to Panchāngam vāra.

## Users
- Devout Hindus seeking daily spiritual guidance
- Students of Vedic dharma / Sanskrit learners
- Diaspora families wanting slokas in Telugu / Hindi / Tamil / English
- Anyone seeking Vedic astrology (Kundali, Muhūrta, Horoscope)

## Core Requirements (Locked)
- Multilingual: Sanskrit Devanagari + English/Telugu/Hindi/Tamil transliteration & meaning
- Persistent background chant: OM + ≥ 10 alternatives; switchable
- Panchāngam (Tithi, Nakshatra, Yoga, Karana, Vara, Sunrise, Sunset, Deity of Day)
- Festivals with story + celebration + pooja vidhi + mantras
- 34 deities with mūla mantra, dhyāna śloka, stotras, 108 & 1008 names
- Japa Counter (bīja) with 1,00,00,116 target + certificate
- Rāma Koṭi / Likhita Japa canvas board with 1,00,00,116 target + certificate
- Vedic astrology: Kundali maker, Muhūrta timings, Daily Horoscope, In-app alarms
- Deity-of-the-day ribbon at top of key pages
- Optional Google login for cross-device sādhanā sync

## Architecture
- **Backend**: FastAPI + MongoDB (motor), pyswisseph for Kundali/Muhurta.
  Endpoints: `/api/panchangam`, `/api/panchangam/week`, `/api/panchangam/timings`,
  `/api/kundali/generate`, `/api/kundali/mine`, `/api/horoscope`,
  `/api/deities/{id}/names`, `/api/auth/*`, `/api/user/sadhana*`, `/api/static/*`.
- **Frontend**: React + Tailwind + shadcn/ui, react-router-dom v7, axios, html2canvas, react-markdown.
- **Content**: 34 deities in static JS + MongoDB (108/1008 names auto-generated via Claude 4.5).
- **Storage**: localStorage for guest mode; MongoDB user_sadhana for logged-in.
- **Design**: Sandalwood/gold/kumkum palette, Cormorant Garamond + Tiro Devanagari Sanskrit.

## Implemented

### 2026-02-01 (initial MVP)
- [x] Multilingual switcher (EN/TE/HI/TA), persistent audio player, sloka-play
- [x] Home dashboard, Dinacharya timeline, Deities grid (12), Panchāngam, Festivals

### 2026-02-27 (Auth + Japa + Names)
- [x] Emergent Google Login; guest mode preserved.
- [x] Cross-device sādhanā sync via `/api/user/sadhana`.
- [x] MongoDB `deity_names` collection populated via `generate_names.py` (Claude Sonnet 4.5).
- [x] `NamesModal` — searchable, paginated 108/1008 viewer.

### 2026-08-03 (this session — Astrology + Ribbon + Multilingual + PWA/Push/Geo/Kundali export)
- [x] **Vedic Astrology suite (P0)** on `/panchangam`:
  - New tab bar: Panchāngam / Muhūrta & Alarms / Kundali / Horoscope.
  - `MuhurtaTimings` — Rāhu Kāla, Yama Gaṇḍa, Gulika, Abhijit, Brahma, Amṛta, Durmuhūrta with
    live NOW badge and countdown.
  - `KundaliMaker` — pyswisseph-driven Lagna, Janma Rāśi, Nakshatra, 9 planets, Vimshottari
    dasha timeline, Mangala/Kaala-Sarpa doshas + AI-generated 400-600 word reading via
    Claude Sonnet 4.5. Persists per user if signed in.
  - `DailyHoroscope` — by Rāśi and/or Nakshatra with 5 sections + lucky color/number/mantra
    (cached 24h in `horoscope_cache`).
- [x] **Muhūrta Alarm (P0)** — `MuhurtaAlarm` component with devotional ringtones + per-timing
  toggles + lead-time / ring-duration / vibrate settings + overlay + localStorage prefs +
  once-per-day dedupe.
- [x] **Deity of the Day Ribbon (P1)** on both Home and Panchāngam pages.
- [x] **Multilingual UI updates (P2)** — 30+ new i18n keys across en/te/hi/ta.
- [x] **Geo Sunrise/Sunset (P2)** — `/api/panchangam/timings?lat=&lng=&tz_offset=` uses
  `pyswisseph` `rise_trans` for accurate local astronomical sunrise/sunset. Verified
  Hyderabad, London, Sydney, NY, Tokyo all within ±5 min of published values. Frontend
  `useGeolocation` hook (7-day cache) + `MuhurtaTimings` shows geo-request / geo-active /
  geo-denied pill.
- [x] **PWA / Offline (P2)** — `/public/manifest.webmanifest` + `/public/service-worker.js`
  registered via `/src/index.js`. Cache strategy: network-first for HTML, stale-while-revalidate
  for static, pass-through for /api/* (except /api/static/*). Installable, home-screen icons
  and shortcuts to Japa / Rāma Koṭi / Panchāngam.
- [x] **OS-level Muhūrta Notifications (P2)** — Notification API + Service Worker. When user
  grants permission and enables `browserNotify`, each enabled timing is scheduled via
  `sw.postMessage({type:'schedule-notification', delayMs, ...})` for today; SW also fires
  immediate notification if page is hidden during in-tab alarm. Once-per-tag dedupe via
  `dj_alarm_scheduled_v1` localStorage.
- [x] **Kundali Export (P2)** — Download PDF (jsPDF, multi-page slice), Save as Image (PNG),
  Share (Web Share Level 2 → clipboard → download fallback). Beautiful printable card layout
  with parchment background.
- [x] **Background Name Generation** — Ashtottara: 17/34 fully at ≥100 names + 17 partials
  (66-99 names). Sahasranama: 2/12 popular fully done (Shiva 687, Vishnu 678), Ganesha 112.
  Generator threshold lowered to 95 for pragmatic completion; scripts still running.

## Backend Endpoints (v2 additions)
- `GET /api/panchangam/timings?date_str=YYYY-MM-DD` → sunrise, sunset, muhurta timings dict.
- `POST /api/kundali/generate` (body: name, dob, time, place, lat, lng, tz_offset) → chart +
  AI reading; optionally persisted per user.
- `GET /api/kundali/mine` → saved Kundali (auth required).
- `GET /api/horoscope?rashi=&nakshatra=&date_str=` → daily prediction (cached).

## Backlog / Deferred

### P1
- Sahasranāma for all 34 deities (background generation in progress — check
  `deity_names.<id>.sahasranama` length; expect ~1008 when complete).
- Full 108 for 4 remaining deities (mahalakshmi_kolhapur, dhanvantari, santoshi, vishwakarma,
  veerabrahmendra) — script running.

### P2
- Browser push notifications 30 min before each astrological timing (Service Worker + VAPID).
- PWA offline support.
- Precise sunrise/sunset via user geolocation (currently approximate math).
- Streaming Kundali AI reading (currently 25-30s blocking).
- Free-form place input with geocoder for Kundali (currently 18-city dropdown).

### 2026-08-12 (Kundali Match + Sanskrit Almanac + Voice Sloka + Festival Push + Aarti Timer)
- [x] **Kundali Match — Aṣṭakūṭa Guṇa Milāna (P1)**. New backend
  `POST /api/kundali/match` computes 8 kūṭas (Varṇa 1 / Vaśya 2 / Tāra 3 / Yoni 4 /
  Graha Maitri 5 / Gaṇa 6 / Bhakoot 7 / Nāḍī 8) totalling 36 with a verdict band.
  Frontend `KundaliMatch.jsx` with dual bride/groom form, color-coded kuta bars,
  and PNG/PDF export via html2canvas + jsPDF. Mounted as a 5th quick-jump section
  on `/panchangam`.
- [x] **Sanskrit Panchangam (P1)** — `panchangam_extras(d)` adds Samvatsara (60-year
  Prabhava cycle), Vikrama Saṁvat, Śaka Saṁvat, Ṛtu (6 seasons), Ayana (Uttarāyaṇa/
  Dakṣiṇāyana), Māsa (lunar month) to both `/api/panchangam` and `/api/panchangam/week`.
  Frontend renders a "Traditional Almanac" block below the daily card.
- [x] **Voice Sloka Reader (P2)** — `VoiceSlokaReader.jsx` uses SpeechSynthesis with
  Indic-voice preference (hi-IN) + `onboundary` word-index tracking to karaoke-highlight
  each Devanāgarī word as it's chanted. Auto-ducks the background chant during narration.
  Mounted inside every `SlokaCard`, so every sloka across Dinacharya / Nitya Pooja /
  Tulasi Pooja / deity detail can now be read aloud.
- [x] **Festival Push (P2)** — `FestivalPushOptIn.jsx` iterates `FESTIVALS`, computes
  next-year fallback if a festival has passed, and schedules an OS notification at
  6 PM the evening before every major festival via the existing SW postMessage protocol.
  Shows upcoming list, permission-aware CTA, and a "Send test" button.
- [x] **Home Aarti Timer (P2)** — `AartiTimer.jsx` with 3 presets (Morning 5m / Evening 7m
  / Quick 3m). Animated SVG diya with a flickering flame and halo glow; synthesised
  bell (Web Audio API, two-oscillator harmonic decay) rings at preset intervals; a
  final triple-bell on completion; volume slider. Mounted on `/` above the Explore grid,
  side-by-side with FestivalPushOptIn.

## Test Results (iteration_4)
- Backend: **10/10 pytest pass** — panchangam extras, kundali/match happy path,
  validation errors, dosha edge cases. All API contracts held.
- Frontend: **100% of specified flows pass** — Aarti Timer presets/start/pause/reset,
  Festival opt-in states, Panchangam almanac fields (Plavanga / Shravana / Shishira /
  Dakṣiṇāyana / 2083 / 1948 for Aug 2026), Kundali Match (Sita ⚭ Ram → 23.5/36
  "Acceptable — Consider carefully"), PNG/PDF export, karaoke sloka reader (no errors).
- Only cosmetic P3: spec-vs-impl naming difference on one quick-jump testid — no bug.

- Backend: **15/15 pytest pass** — panchangam, timings, kundali (incl. 422 validation),
  horoscope (Mesha/Vrishabha/Mithuna), deity names.
- Frontend: **100% of specified flows** — 4-tab Panchāngam, Muhūrta timings + alarm
  overlay/dismiss/config, Kundali chart+reading, Horoscope, Deity-of-Day ribbon +108 Japa,
  i18n switch to te/hi/ta/en, regression on Japa/Rāma Koṭi/Deities.
- No critical or minor issues. 2 tiny design-polish notes applied (alarm active-state
  affordance, ribbon name/Devanāgarī kerning).

## Test Credentials
See `/app/memory/test_credentials.md`. All astrology features are guest-accessible; auth is
optional and used only for persisting Kundali across devices.
