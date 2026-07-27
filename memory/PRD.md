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
- Bulk deity list (Venkateswara, Padmavathi, Narasimha, Varahi, Lalitha, Kali, Dattatreya,
  Navagraha, Kubera, Gayatri, Parvathi, Raghavendra, Annapurna, Chamundeshwari,
  Mahalakshmi Kolhapur, Ganga, Bhairava, Dhanvantari, Varaha, Santoshi — 31+ total).
- Japa Counter for deity's bīja mantra — 1,00,00,116 target — Certificate on completion.
- Rāma Koṭi / Likhita Japa writing board — 1,00,00,116 target — Certificate on completion.
- Multi-lingual (EN/TE/HI/TA).
- Persistent OM background loop.

## Users
- Devout Hindus seeking daily spiritual guidance
- Students of Vedic dharma / Sanskrit learners
- Diaspora families wanting slokas in Telugu / Hindi / Tamil / English

## Core Requirements (Locked)
- Multilingual: Sanskrit Devanagari + English/Telugu/Hindi/Tamil transliteration & meaning
- Persistent background chant: OM by default; switchable to ≥ 10 alternatives now
- Tap-to-play individual slokas replaces chant, resumes after stop
- Panchāngam (Tithi, Nakshatra, Yoga, Karana, Vara, Sunrise, Sunset, Deity of Day)
- Festivals with story + celebration + pooja vidhi + mantras
- 32 deities with mūla mantra, dhyāna śloka, stotras, ashtottara, songs
- Nitya Pooja Vidhanam + Tulasi Pooja Vidhanam (fully implemented with authentic Telugu)
- 108 Pradakṣiṇā counter + 30-day streak + Sadhana certificate (Tulasi)
- Japa Counter (bīja mantra) with 1,00,00,116 target + certificate
- Rāma Koṭi / Likhita Japa board with 1,00,00,116 target + certificate
- No login for MVP; device-id + localStorage based tracking

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Endpoints: `/api/panchangam`, `/api/panchangam/week`,
  `/api/bookmarks`, `/api/rituals/done`
- **Frontend**: React + Tailwind + shadcn/ui, react-router-dom v7, axios, html2canvas
- **Content**: All slokas / stotras / festival data in static JS files (offline-friendly)
  - `deities.js` (12 core) + `deities_extended.js` (20 additional)
- **Storage**: localStorage for japa counts, likhita counts, ritual streak, bookmarks
- **Design**: Sandalwood/gold/kumkum-red palette, Cormorant Garamond + Tiro Devanagari Sanskrit,
  temple-arch deity niches, diya-glow shadows, kolam-dot patterns

## Implemented
### 2026-02-01
- [x] Multilingual switcher (EN/TE/HI/TA), persistent audio player, sloka-play integration
- [x] Home dashboard, Dinacharya timeline, Deities grid (12), Panchāngam, Festivals
- [x] Backend endpoints (7/7 pytest pass), Frontend flows (100% pass)

### 2026-02 (later iterations)
- [x] Nitya Pooja Vidhanam with authentic Telugu Sankalpam + Panchāngam integration
- [x] Tulasi Pooja Vidhanam: 108 pradakṣiṇā counter (Web Audio bell + SpeechSynthesis whisper)
- [x] 30-day diya streak (localStorage), Sadhana Certificate (html2canvas export)

### 2026-02-27 (this session)
- [x] **Added 20 new deities** (total 32) — Venkateswara, Padmavathi, Narasimha, Varaha,
      Dattatreya, Lalitha, Kali, Varahi, Navagraha, Kubera, Gayatri, Parvathi, Raghavendra,
      Annapurna, Chamundeshwari, Mahalakshmi (Kolhapur), Ganga, Bhairava, Dhanvantari, Santoshi
- [x] **Extended background chants** — Venkateswara Suprabhatam, Datta Bāvani, Rāghavendra
      Stotra, Navagraha Stotram (10+ total tracks now)
- [x] **Japa Counter** (`/japa`) — deity-wise bīja mantra japa counter, 108-round tracking,
      Web Audio bell chime every 108/27, milestones ladder (108→1008→10K→1L→10L→1Cr→Target),
      Undo, Reset, cross-deity total, certificate at **1,00,00,116**
- [x] **Rāma Koṭi / Likhita Japa** (`/rama-koti`) — 5 name presets (Rāma, Om Namaḥ Śivāya,
      Kṛṣṇa, Hanumān, Sāī Rām), fuzzy matching accepts EN/DEV/TE variants, 108-dot page grid,
      milestones ladder, chime, certificate at **1,00,00,116**
- [x] **NamaCertificate** — reusable html2canvas-exported certificate for both features
- [x] Home page has Sādhanā section with tiles for Japa & Rāma Koṭi

## Backlog / Deferred
### P0 (next)
- Authentication (Emergent Google Login) — save counts across devices
- Migrate deity data → MongoDB (before adding Sahasranamas)

### P1
- Full 108 & 1008 names for each deity
- Sahasranāma pages (currently titles listed)
- Dinacharya slokas per micro-moment (bathing, food, journey, sleeping)
- Location-aware sunrise/sunset
- Handwritten canvas draw mode for Likhita Japa (currently text-input)
- Optional Wikimedia image fixes for extended deities

### P2
- Devotional video playback synced with sloka audio
- Reminder notifications (Sandhyavandanam time, ekādaśī)
- Drik-panchang precision (pyswisseph)
- Community playlists

## Test Credentials
None — app is fully local-first (localStorage), no auth yet.
