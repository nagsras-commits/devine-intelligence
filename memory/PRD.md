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

### 2026-08-03 (this session — Astrology + Ribbon + Multilingual)
- [x] **Vedic Astrology suite (P0)** on `/panchangam`:
  - New tab bar: Panchāngam / Muhūrta & Alarms / Kundali / Horoscope.
  - `MuhurtaTimings` — Rāhu Kāla, Yama Gaṇḍa, Gulika, Abhijit, Brahma, Amṛta, Durmuhūrta with
    live NOW badge and countdown.
  - `KundaliMaker` — pyswisseph-driven Lagna, Janma Rāśi, Nakshatra, 9 planets, Vimshottari
    dasha timeline, Mangala/Kaala-Sarpa doshas + AI-generated 400-600 word reading via
    Claude Sonnet 4.5. Persists per user if signed in.
  - `DailyHoroscope` — by Rāśi and/or Nakshatra with 5 sections + lucky color/number/mantra
    (cached 24h in `horoscope_cache`).
- [x] **Muhūrta Alarm (P0)** — `MuhurtaAlarm` component with:
  - Devotional ringtones (Om, Om Namaḥ Śivāya 432 Hz, Gāyatrī, Mahā Mṛtyuñjaya, Hanumān
    Chālīsā, Viṣṇu Sahasranāmam, Lalitā Sahasranāmam, Suprabhātam, Datta Bāvani, etc.).
  - Per-timing bell toggles, lead-time (0/5/10/30 min), ring duration (10s/25s/1m/3m), vibrate.
  - 15-second poll for boundary crossings; full-screen overlay with animated bell + ॐ + type
    (auspicious/inauspicious) and Silence button.
  - Test-fire button + localStorage preference persistence + once-per-day dedupe.
- [x] **Deity of the Day Ribbon (P1)** on both Home and Panchāngam pages.
  - Maps `vara → deity_id` (Sunday→Sūrya, Monday→Śiva, Tuesday→Subrahmaṇya, etc.).
  - Portrait, mūla mantra (Devanāgarī + IAST), +108 Japa quick-add, Chant preview button.
- [x] **Multilingual UI updates (P2)** — 30+ new i18n keys across en/te/hi/ta:
  muhurta_timings, muhurta_alarms, kundali, horoscope, deity_of_day_ribbon, silence_alarm,
  auspicious/inauspicious labels, and all Home tile descriptions (`*_desc`) now translated.
- [x] **Background Name Generation** — running for all 34 deities (P1):
  30/34 ashtottara docs present at last check; sahasranama in-progress. Idempotent — safe
  to re-invoke `python generate_names.py --ashtottara|--sahasranama` for the missing ones.

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

## Test Results (iteration_2)
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
