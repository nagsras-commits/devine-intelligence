# Divine Journey — Sanātana Dharma App

## Original Problem Statement
Build a divine-journey app containing real Sanātana Hindu lifestyle guidance per Vedic Dharma:
which sloka to read when — waking up (Karagre Vasate), stepping on floor (Bhumi Vandanam),
bathing, Sandhyavandanam, before/after food, going outside, work, journey, sleep.
Continuous OM chanting while app runs; switchable to other deity chants.
Show Panchangam. Contain all Hindu Gods/Goddesses with slokas, mantras, ashtottaras,
sahasranamas and songs. Festivals: notify beforehand with full story, celebration,
pooja vidhi, mantras — all in one column.

## Users
- Devout Hindus seeking daily spiritual guidance
- Students of Vedic dharma / Sanskrit learners
- Diaspora families wanting slokas in Telugu / Hindi / Tamil / English

## Core Requirements (Locked)
- Multilingual: Sanskrit Devanagari + English/Telugu/Hindi/Tamil transliteration & meaning
- Persistent background chant: OM by default, switchable to Gāyatrī / Mahāmṛtyuñjaya /
  Hanumān Chālīsā / Viṣṇu Sahasranāmam / Lalitā Sahasranāmam
- Tap-to-play individual slokas replaces chant, resumes after stop
- Panchāngam (Tithi, Nakshatra, Yoga, Karana, Vara, Sunrise, Sunset, Deity of Day)
- Festivals with story + celebration + pooja vidhi + mantras
- Deities library (Ganesha, Shiva, Vishnu, Krishna, Rama, Hanuman, Lakshmi, Saraswati,
  Durga, Subrahmanya, Surya, Ayyappa)
- No login for MVP; device-id based ritual tracking

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Endpoints: `/api/panchangam`, `/api/panchangam/week`,
  `/api/bookmarks` (POST/GET/DELETE), `/api/rituals/done` (POST/GET/DELETE)
- **Frontend**: React + Tailwind + shadcn/ui, react-router-dom v7, axios
- **Content**: All slokas / stotras / festival data in static JS files (offline-friendly)
- **Design**: Sandalwood/gold/kumkum-red palette, Cormorant Garamond + Tiro Devanagari Sanskrit,
  temple-arch deity niches, diya-glow shadows, kolam-dot patterns, flicker/breathe animations

## Implemented (2026-02-01)
- [x] Multilingual switcher (EN/TE/HI/TA) with per-language transliteration & meaning
- [x] Persistent bottom audio player with chant switcher (6 chants) and unmute-tap-to-start
- [x] Sloka-play integration that pauses background chant and resumes on stop
- [x] Home dashboard with hero, today's panchāngam, upcoming festival, deity + ritual previews
- [x] Dinacharya timeline (10 rituals) with expand-collapse + ritual-done tracking via API
- [x] Deities grid (12 deities) with detail page: mūla mantra, dhyāna śloka, stotras, ashtottara
- [x] Panchāngam page: 7-day strip + day detail with all 6 anga + deity-of-day
- [x] Festivals page: sidebar list + detail column with story/celebration/pooja/mantras
- [x] Backend endpoints tested (7/7 pytest pass)
- [x] Frontend flows tested (100% pass)

## Backlog / Deferred
### P1 (soon)
- Full 108-name Aṣṭottara for every deity (currently 8-12 sample names)
- Sahasranāma pages (currently only titles listed)
- More festivals (regional: Onam, Vishu, Bihu, Ugadi, Ratha Saptami…)
- Location-aware sunrise/sunset (currently static)
- Emergent Google login for cross-device bookmark sync

### P2 (later)
- Devotional video playback synced with sloka audio
- Reminder notifications (e.g., Sandhyavandanam time, ekādaśī)
- More accurate drik-panchang calculations (pyswisseph)
- User-uploaded sloka recitations / community playlists

## Next Tasks
1. Add full 108 & 1008 name lists (Ganeśa first)
2. Add Emergent Google login for personalization
3. Add Onam, Ugādi, Vaisākhi, Ratha Saptami, Hanumat Jayanti festivals
4. Add search across all slokas
