from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie, Header
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
import os
import logging
import asyncio
import hashlib
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, date as date_cls, timedelta
date = date_cls  # backward-compat alias for existing panchangam code
import math
import httpx
import json
from brahma_alarm import compute_next_brahma_alarm, vapid_configuration

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Ensure static image directory exists
STATIC_DIR = ROOT_DIR / "static"
(STATIC_DIR / "deities").mkdir(parents=True, exist_ok=True)

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Divine Journey API")
api_router = APIRouter(prefix="/api")


# ---------- Panchangam calculation (simplified traditional-lookup) ----------
TITHIS = [
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
]

TITHIS_TE = [
    "ప్రథమ", "ద్వితీయ", "తృతీయ", "చతుర్థి", "పంచమి",
    "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి",
    "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి", "పూర్ణిమ",
    "ప్రథమ", "ద్వితీయ", "తృతీయ", "చతుర్థి", "పంచమి",
    "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి",
    "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి", "అమావాస్య",
]

SAMVATSARAS = [
    "Prabhava", "Vibhava", "Shukla", "Pramoduta", "Prajotpatti", "Angirasa",
    "Srimukha", "Bhava", "Yuva", "Dhata", "Ishwara", "Bahudhanya",
    "Pramadi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana",
    "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikruti",
    "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
    "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakruti",
    "Shobhakruti", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga", "Kilaka",
    "Saumya", "Sadharana", "Virodhikruti", "Paridhavi", "Pramadicha", "Ananda",
    "Rakshasa", "Nala", "Pingala", "Kalayukti", "Siddharti", "Raudri",
    "Durmati", "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana", "Akshaya",
]

SAMVATSARAS_TE = [
    "ప్రభవ", "విభవ", "శుక్ల", "ప్రమోదూత", "ప్రజోత్పత్తి", "అంగీరస",
    "శ్రీముఖ", "భావ", "యువ", "ధాత", "ఈశ్వర", "బహుధాన్య",
    "ప్రమాది", "విక్రమ", "వృష", "చిత్రభాను", "స్వభాను", "తారణ",
    "పార్థివ", "వ్యయ", "సర్వజిత్", "సర్వధారి", "విరోధి", "వికృతి",
    "ఖర", "నందన", "విజయ", "జయ", "మన్మథ", "దుర్ముఖి",
    "హేవిళంబి", "విళంబి", "వికారి", "శార్వరి", "ప్లవ", "శుభకృత్",
    "శోభకృత్", "క్రోధి", "విశ్వావసు", "పరాభవ", "ప్లవంగ", "కీలక",
    "సౌమ్య", "సాధారణ", "విరోధికృత్", "పరిధావి", "ప్రమాదీచ", "ఆనంద",
    "రాక్షస", "నల", "పింగళ", "కాళయుక్తి", "సిద్ధార్థి", "రౌద్రి",
    "దుర్మతి", "దుందుభి", "రుధిరోద్గారి", "రక్తాక్షి", "క్రోధన", "అక్షయ",
]

MASAS = ["Chaitra", "Vaisakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
         "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"]
MASAS_TE = ["చైత్ర", "వైశాఖ", "జ్యేష్ఠ", "ఆషాఢ", "శ్రావణ", "భాద్రపద",
            "ఆశ్వయుజ", "కార్తీక", "మార్గశిర", "పుష్య", "మాఘ", "ఫాల్గుణ"]

RUTHUS = ["Vasanta", "Grishma", "Varsha", "Sharat", "Hemanta", "Shishira"]
RUTHUS_TE = ["వసంత", "గ్రీష్మ", "వర్ష", "శరత్", "హేమంత", "శిశిర"]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati",
]

YOGAS = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi",
    "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata",
    "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
    "Shukla", "Brahma", "Indra", "Vaidhriti",
]

KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]

VARAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
VARAS_SANSKRIT = ["Bhanuvara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"]

PAKSHA_LORDS = {
    "Sunday": "Surya", "Monday": "Chandra", "Tuesday": "Mangala",
    "Wednesday": "Budha", "Thursday": "Guru (Brihaspati)",
    "Friday": "Shukra", "Saturday": "Shani",
}


def compute_panchangam(d: date) -> Dict[str, Any]:
    # Reference epoch (Jan 1 2000 - Amavasya-ish anchor for demo)
    epoch = date(2000, 1, 6)
    days = (d - epoch).days

    # Astronomical cycles: lunar month ≈ 29.53d (30 tithis), sidereal month ≈ 27.32d (27 nakshatras),
    # yoga cycle ≈ same as sidereal, karana = half of a tithi.
    tithi_progress = (days * 30.0) / 29.530588
    tithi_idx = int(tithi_progress) % 30
    nak_idx = int((days * 27.0) / 27.32166) % 27
    yoga_idx = int((days * 27.0) / 27.0) % 27  # yoga cycles roughly daily
    karana_idx = int(tithi_progress * 2) % 7  # 7 rotating karanas (simplified)
    vara_idx = d.weekday()  # Mon=0
    # Map python weekday (Mon=0..Sun=6) to Vara (Sun=0..Sat=6)
    vara_sun_idx = (vara_idx + 1) % 7

    paksha = "Shukla Paksha" if tithi_idx < 15 else "Krishna Paksha"
    paksha_te = "శుక్ల పక్ష" if tithi_idx < 15 else "కృష్ణ పక్ష"

    # Samvatsara — cycle changes at Ugadi (~ mid-March). Krodhi = index 37 (0-based) for 2024 Ugadi year.
    ugadi_year = d.year if d.month >= 4 or (d.month == 3 and d.day >= 20) else d.year - 1
    samvatsara_idx = (ugadi_year - 2024 + 37) % 60

    # Ayana — Uttarayana from Jan 14 to Jul 15, else Dakshinayana
    doy = d.timetuple().tm_yday
    uttar_start = date(d.year, 1, 14).timetuple().tm_yday
    daksh_start = date(d.year, 7, 16).timetuple().tm_yday
    if uttar_start <= doy < daksh_start:
        ayana, ayana_te = "Uttarayana", "ఉత్తరాయణ"
    else:
        ayana, ayana_te = "Dakshinayana", "దక్షిణాయణ"

    # Ruthu — by Gregorian month (approximate)
    m = d.month
    ruthu_map = {(3, 4): 0, (5, 6): 1, (7, 8): 2, (9, 10): 3, (11, 12): 4, (1, 2): 5}
    ruthu_idx = next((v for k, v in ruthu_map.items() if m in k), 0)

    # Masa — by Gregorian month starting Chaitra ~ March-April
    masa_idx = (m - 3) % 12

    # Approximate sunrise/sunset - static for demo (Bharat ~ IST)
    month = d.month
    sunrise_min = 360 + (month - 6) * 6
    sunset_min = 1080 - (month - 6) * 6
    def m2t(mm):
        h, mm = divmod(mm, 60)
        return f"{h:02d}:{mm:02d}"

    return {
        "date": d.isoformat(),
        "vara": VARAS[vara_sun_idx],
        "vara_sanskrit": VARAS_SANSKRIT[vara_sun_idx],
        "paksha": paksha,
        "paksha_te": paksha_te,
        "tithi": TITHIS[tithi_idx],
        "tithi_te": TITHIS_TE[tithi_idx],
        "tithi_number": (tithi_idx % 15) + 1,
        "nakshatra": NAKSHATRAS[nak_idx],
        "yoga": YOGAS[yoga_idx],
        "karana": KARANAS[karana_idx],
        "sunrise": m2t(sunrise_min),
        "sunset": m2t(sunset_min),
        "deity_of_day": PAKSHA_LORDS[VARAS[vara_sun_idx]],
        "samvatsara": SAMVATSARAS[samvatsara_idx],
        "samvatsara_te": SAMVATSARAS_TE[samvatsara_idx],
        "ayana": ayana,
        "ayana_te": ayana_te,
        "ruthu": RUTHUS[ruthu_idx],
        "ruthu_te": RUTHUS_TE[ruthu_idx],
        "masa": MASAS[masa_idx],
        "masa_te": MASAS_TE[masa_idx],
        "auspicious_note": "Recite the day's deity mantra during Brahma Muhurta (~90 min before sunrise) for maximum benefit.",
    }


# ---------- Endpoints ----------
@api_router.get("/")
async def root():
    return {"message": "Om Namah Shivaya - Divine Journey API"}


@api_router.get("/panchangam")
async def get_panchangam(date_str: Optional[str] = None):
    if date_str:
        try:
            d = date.fromisoformat(date_str)
        except ValueError:
            raise HTTPException(400, "date must be YYYY-MM-DD")
    else:
        d = date.today()
    from astrology import panchangam_extras
    return {**compute_panchangam(d), **panchangam_extras(d)}


@api_router.get("/vrata/upcoming")
async def upcoming_vratas(days: int = 60):
    days = max(1, min(days, 180))
    today = date.today()
    out = []
    KRISHNA = {"paksha": "Krishna Paksha", "shift": 15}
    for i in range(days):
        d = today + timedelta(days=i)
        p = compute_panchangam(d)
        # tithi_number: 1..15 within paksha
        tn = p.get("tithi_number", 0)
        paksha = p.get("paksha", "")
        vratas_today = []
        if tn == 11:
            vratas_today.append({
                "vrata": "Ekādaśī", "sanskrit": "एकादशी",
                "deity": "Vishnu",
                "vidhi": "Fast (full or fruit-only), stay awake in bhajan/dhyāna, chant Viṣṇu Sahasranāma.",
                "prasad": "Panchāmṛta, tulasi leaf, fruits, sabudana khichdi.",
                "significance": "Sacred to Śrī Viṣṇu. Fasting purifies body and mind; grants mokṣa.",
            })
        if tn == 13:
            vratas_today.append({
                "vrata": "Pradoṣam", "sanskrit": "प्रदोषम्",
                "deity": "Shiva",
                "vidhi": "Fast till twilight (pradoṣa kāla). Perform Śiva abhiṣeka with milk, bilva leaves, water. Chant Mahā Mṛtyuñjaya 108 times.",
                "prasad": "Bilva patra water, coconut, banana, kheer.",
                "significance": "Dedicated to Lord Śiva; removes sins accumulated over lifetimes.",
            })
        if paksha == "Krishna Paksha" and tn == 4:
            vratas_today.append({
                "vrata": "Sankaṣṭī Chaturthī", "sanskrit": "सङ्कष्टी चतुर्थी",
                "deity": "Ganesha",
                "vidhi": "Fast until moonrise. Offer 21 durvā (grass) blades and modaks to Gaṇeśa. Chant Gaṇapati Atharvashīrṣa.",
                "prasad": "Modak, laddu, coconut, durvā.",
                "significance": "Removes obstacles (sankaṭa) and blesses success in undertakings.",
            })
        if tn == 15 and paksha == "Shukla Paksha":
            vratas_today.append({
                "vrata": "Pūrṇimā", "sanskrit": "पूर्णिमा",
                "deity": "Satyanārāyaṇa / Full-moon deities",
                "vidhi": "Satyanārāyaṇa vrat kathā, moon offering (arghya), donate to brahmins.",
                "prasad": "Sheera / halwa, banana, panchāmṛta.",
                "significance": "Auspicious for wealth, health & harmonious family.",
            })
        if tn == 15 and paksha == "Krishna Paksha":
            vratas_today.append({
                "vrata": "Amāvāsyā", "sanskrit": "अमावस्या",
                "deity": "Pitṛs / Ancestors",
                "vidhi": "Perform tarpaṇ / śrāddha for ancestors. Bathe in a river or with holy water.",
                "prasad": "Rice-sesame balls, milk, offer to crows.",
                "significance": "Best day for pitṛ tarpaṇa; ancestors bless the family.",
            })
        for v in vratas_today:
            out.append({
                "date": d.isoformat(),
                "vara": p.get("vara"),
                "tithi": p.get("tithi"),
                "paksha": paksha,
                "day_offset": i,
                **v,
            })
    return {"days_scanned": days, "count": len(out), "vratas": out}


@api_router.get("/panchangam/week")
async def get_week_panchangam():
    from astrology import panchangam_extras
    today = date.today()
    return [{**compute_panchangam(today + timedelta(days=i)), **panchangam_extras(today + timedelta(days=i))} for i in range(7)]


# --- Bookmarks (simple, no auth) ---
class BookmarkCreate(BaseModel):
    kind: str  # "sloka" | "deity" | "ritual" | "festival"
    ref_id: str
    title: str
    device_id: str  # local device UUID from client


class Bookmark(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    kind: str
    ref_id: str
    title: str
    device_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.post("/bookmarks", response_model=Bookmark)
async def add_bookmark(payload: BookmarkCreate):
    obj = Bookmark(**payload.model_dump())
    doc = obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.bookmarks.insert_one(doc)
    return obj


@api_router.get("/bookmarks", response_model=List[Bookmark])
async def list_bookmarks(device_id: str):
    docs = await db.bookmarks.find({"device_id": device_id}, {"_id": 0}).to_list(500)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


@api_router.delete("/bookmarks/{bookmark_id}")
async def delete_bookmark(bookmark_id: str, device_id: str):
    res = await db.bookmarks.delete_one({"id": bookmark_id, "device_id": device_id})
    return {"deleted": res.deleted_count}


# --- Ritual completion tracking ---
class RitualDone(BaseModel):
    ritual_id: str
    device_id: str
    date_str: str  # YYYY-MM-DD


@api_router.post("/rituals/done")
async def mark_ritual_done(payload: RitualDone):
    key = {"ritual_id": payload.ritual_id, "device_id": payload.device_id, "date_str": payload.date_str}
    await db.ritual_log.update_one(key, {"$set": {**key, "at": datetime.now(timezone.utc).isoformat()}}, upsert=True)
    return {"ok": True}


@api_router.get("/rituals/done")
async def list_ritual_done(device_id: str, date_str: str):
    docs = await db.ritual_log.find({"device_id": device_id, "date_str": date_str}, {"_id": 0}).to_list(50)
    return [d["ritual_id"] for d in docs]


@api_router.delete("/rituals/done")
async def unmark_ritual(ritual_id: str, device_id: str, date_str: str):
    res = await db.ritual_log.delete_one({"ritual_id": ritual_id, "device_id": device_id, "date_str": date_str})
    return {"deleted": res.deleted_count}


# =============================================================================
# EMERGENT-MANAGED GOOGLE AUTH (optional — guest mode remains default)
# REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
# =============================================================================
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


async def get_current_user(request: Request) -> Optional[Dict[str, Any]]:
    """Return the currently-authenticated user or None (guest)."""
    token = request.cookies.get("session_token")
    if not token:
        auth = request.headers.get("authorization")
        if auth and auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1]
    if not token:
        return None

    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        return None

    exp = sess["expires_at"]
    if isinstance(exp, str):
        exp = datetime.fromisoformat(exp)
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp < datetime.now(timezone.utc):
        return None

    user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
    return user


@api_router.post("/auth/session")
async def create_session(response: Response, x_session_id: str = Header(...)):
    """Exchange Emergent session_id for a persistent session_token cookie."""
    async with httpx.AsyncClient(timeout=15) as h:
        r = await h.get(EMERGENT_AUTH_URL, headers={"X-Session-ID": x_session_id})
    if r.status_code != 200:
        raise HTTPException(401, "Invalid session id")
    data = r.json()

    email = data.get("email")
    name = data.get("name") or email or "Devotee"
    picture = data.get("picture") or ""
    session_token = data["session_token"]

    # Upsert user by email (custom user_id, exclude _id everywhere)
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"user_id": user_id}, {"$set": {"name": name, "picture": picture}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc),
        })

    # Save session
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc),
    })

    response.set_cookie(
        key="session_token", value=session_token, max_age=7 * 24 * 3600,
        httponly=True, secure=True, samesite="none", path="/",
    )
    return {"user_id": user_id, "email": email, "name": name, "picture": picture}


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Not authenticated")
    return user


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"ok": True}


# =============================================================================
# USER SADHANA SYNC — japa counts, likhita counts, ritual streak
# =============================================================================
class SadhanaPayload(BaseModel):
    japa_counts: Optional[Dict[str, int]] = None            # { deity_id: count }
    likhita_counts: Optional[Dict[str, int]] = None         # { name_id: count }
    ritual_streak: Optional[Dict[str, Any]] = None          # arbitrary streak data
    merge: bool = True                                       # if True, max-merge; else overwrite


@api_router.get("/user/sadhana")
async def get_sadhana(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Not authenticated")
    doc = await db.user_sadhana.find_one({"user_id": user["user_id"]}, {"_id": 0}) or {}
    return {
        "japa_counts": doc.get("japa_counts", {}),
        "likhita_counts": doc.get("likhita_counts", {}),
        "ritual_streak": doc.get("ritual_streak", {}),
        "updated_at": doc.get("updated_at"),
    }


@api_router.post("/user/sadhana/sync")
async def sync_sadhana(request: Request, payload: SadhanaPayload):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Not authenticated")

    doc = await db.user_sadhana.find_one({"user_id": user["user_id"]}, {"_id": 0}) or {}

    def merge_counts(server: Dict[str, int], client: Dict[str, int]) -> Dict[str, int]:
        out = dict(server or {})
        for k, v in (client or {}).items():
            out[k] = max(int(out.get(k, 0)), int(v or 0)) if payload.merge else int(v or 0)
        return out

    new_doc = {
        "user_id": user["user_id"],
        "japa_counts": merge_counts(doc.get("japa_counts", {}), payload.japa_counts or {}),
        "likhita_counts": merge_counts(doc.get("likhita_counts", {}), payload.likhita_counts or {}),
        "ritual_streak": payload.ritual_streak or doc.get("ritual_streak", {}),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.user_sadhana.update_one({"user_id": user["user_id"]}, {"$set": new_doc}, upsert=True)
    return {
        "japa_counts": new_doc["japa_counts"],
        "likhita_counts": new_doc["likhita_counts"],
        "ritual_streak": new_doc["ritual_streak"],
    }


# =============================================================================
# FAMILY / HOUSEHOLD SADHANA — Shared counters across a household
# =============================================================================
import secrets
import string

def _new_household_code() -> str:
    """6-char uppercase alphanumeric code, avoiding confusables."""
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "".join(secrets.choice(alphabet) for _ in range(6))


class HouseholdCreate(BaseModel):
    name: str


class HouseholdContribute(BaseModel):
    deity_id: str
    japa: int = 0
    likhita: int = 0


@api_router.post("/household/create")
async def household_create(payload: HouseholdCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to create a family sādhanā")
    # Ensure unique code
    for _ in range(10):
        code = _new_household_code()
        if not await db.households.find_one({"code": code}):
            break
    else:
        raise HTTPException(500, "Could not generate a unique household code")
    doc = {
        "household_id": str(uuid.uuid4()),
        "name": payload.name.strip()[:60] or "Our Family Sādhanā",
        "code": code,
        "owner_id": user["user_id"],
        "members": [{"user_id": user["user_id"], "name": user.get("name"), "picture": user.get("picture"), "joined_at": datetime.now(timezone.utc).isoformat()}],
        "japa_counts": {},
        "likhita_counts": {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.households.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.post("/household/join")
async def household_join(code: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to join a family sādhanā")
    code_up = code.strip().upper()
    hh = await db.households.find_one({"code": code_up})
    if not hh:
        raise HTTPException(404, "No household found for that code")
    if any(m.get("user_id") == user["user_id"] for m in hh.get("members", [])):
        hh.pop("_id", None)
        return hh
    await db.households.update_one(
        {"household_id": hh["household_id"]},
        {"$push": {"members": {"user_id": user["user_id"], "name": user.get("name"), "picture": user.get("picture"), "joined_at": datetime.now(timezone.utc).isoformat()}}}
    )
    hh = await db.households.find_one({"household_id": hh["household_id"]}, {"_id": 0})
    return hh


@api_router.get("/household/mine")
async def household_mine(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Sign in")
    docs = await db.households.find({"members.user_id": user["user_id"]}, {"_id": 0}).to_list(None)
    return docs


@api_router.post("/household/contribute")
async def household_contribute(payload: HouseholdContribute, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Sign in")
    hh = await db.households.find_one({"members.user_id": user["user_id"]}, {"_id": 0})
    if not hh:
        raise HTTPException(404, "You have not joined a family sādhanā yet")
    inc = {}
    if payload.japa:
        inc[f"japa_counts.{payload.deity_id}"] = int(payload.japa)
    if payload.likhita:
        inc[f"likhita_counts.{payload.deity_id}"] = int(payload.likhita)
    if not inc:
        raise HTTPException(400, "Nothing to contribute")
    await db.households.update_one({"household_id": hh["household_id"]}, {"$inc": inc})
    # Record per-user contribution history
    hist = {
        "household_id": hh["household_id"],
        "user_id": user["user_id"],
        "user_name": user.get("name"),
        "deity_id": payload.deity_id,
        "japa": int(payload.japa),
        "likhita": int(payload.likhita),
        "at": datetime.now(timezone.utc).isoformat(),
    }
    await db.household_contributions.insert_one(hist)
    updated = await db.households.find_one({"household_id": hh["household_id"]}, {"_id": 0})
    return updated


@api_router.post("/household/leave")
async def household_leave(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Sign in")
    hh = await db.households.find_one({"members.user_id": user["user_id"]})
    if not hh:
        return {"ok": True}
    await db.households.update_one(
        {"household_id": hh["household_id"]},
        {"$pull": {"members": {"user_id": user["user_id"]}}}
    )
    return {"ok": True}



# =============================================================================
# DEITY NAMES — Ashtottara (108) & Sahasranama (1008) — MongoDB backed
# =============================================================================
@api_router.get("/deities/{deity_id}/names")
async def get_deity_names(deity_id: str, kind: str = "ashtottara", q: str = "", page: int = 1, page_size: int = 108):
    """Return names paginated + searchable. kind = 'ashtottara' | 'sahasranama'."""
    if kind not in ("ashtottara", "sahasranama"):
        raise HTTPException(400, "kind must be 'ashtottara' or 'sahasranama'")
    doc = await db.deity_names.find_one({"deity_id": deity_id}, {"_id": 0}) or {}
    names: List[Dict[str, Any]] = doc.get(kind, []) or []

    if q:
        ql = q.lower()
        names = [n for n in names if
                 ql in (n.get("iast") or "").lower() or
                 ql in (n.get("meaning") or "").lower() or
                 q in (n.get("sa") or "") or
                 q in (n.get("te") or "")]

    total = len(names)
    page = max(1, page)
    page_size = min(1008, max(10, page_size))
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "deity_id": deity_id,
        "kind": kind,
        "total": total,
        "page": page,
        "page_size": page_size,
        "names": names[start:end],
        "available": {
            "ashtottara": len(doc.get("ashtottara") or []),
            "sahasranama": len(doc.get("sahasranama") or []),
        },
    }


# =============================================================================
# ASTROLOGY — Muhūrta timings, Kundali, Daily Horoscope
# =============================================================================
from astrology import compute_kundali, compute_muhurta_timings, compute_sunrise_sunset
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    LLM_AVAILABLE = True
except Exception:
    LLM_AVAILABLE = False


@api_router.get("/panchangam/timings")
async def get_muhurta_timings(
    date_str: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    tz_offset: Optional[float] = 5.5,
):
    """Return Rāhu Kāla, Yama Gaṇḍa, Gulika Kāla, Abhijit, Brahma & Amṛta Muhurtas.

    If lat/lng provided, uses pyswisseph for accurate local sunrise/sunset. Otherwise
    falls back to Hyderabad-approximate model.
    """
    d = date_cls.fromisoformat(date_str) if date_str else date_cls.today()
    if lat is not None and lng is not None:
        sunrise, sunset = compute_sunrise_sunset(d, lat, lng, 5.5 if tz_offset is None else tz_offset)
        source = "geolocation"
    else:
        day_of_year = d.timetuple().tm_yday
        sunrise_hour = 6 + math.sin(2 * math.pi * (day_of_year - 80) / 365) * 0.5
        sunset_hour = 18 - math.sin(2 * math.pi * (day_of_year - 80) / 365) * 0.5
        sunrise = f"{int(sunrise_hour):02d}:{int((sunrise_hour % 1) * 60):02d}"
        sunset  = f"{int(sunset_hour):02d}:{int((sunset_hour % 1) * 60):02d}"
        source = "approximate"
    timings = compute_muhurta_timings(sunrise, sunset, d.weekday())
    return {"date": d.isoformat(), "sunrise": sunrise, "sunset": sunset, "source": source, "timings": timings}


class BrahmaAlarmSubscription(BaseModel):
    subscription: Dict[str, Any]
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    time_zone: str = Field(..., min_length=1, max_length=64)
    tz_offset: float = Field(..., ge=-14, le=14)


def _push_endpoint_id(endpoint: str) -> str:
    return hashlib.sha256(endpoint.encode("utf-8")).hexdigest()


@api_router.get("/brahma-alarm/config")
async def get_brahma_alarm_config():
    config = vapid_configuration()
    return {"available": bool(config), "public_key": config["public_key"] if config else None}


@api_router.get("/brahma-alarm/subscription")
async def get_brahma_alarm_subscription(endpoint: str):
    doc = await db.brahma_alarm_subscriptions.find_one(
        {"_id": _push_endpoint_id(endpoint), "enabled": True},
        {"_id": 0, "enabled": 1, "next_alarm_at": 1, "next_alarm_date": 1},
    )
    return {
        "enabled": bool(doc),
        "next_alarm_at": doc["next_alarm_at"].isoformat() if doc and doc.get("next_alarm_at") else None,
        "next_alarm_date": doc.get("next_alarm_date") if doc else None,
    }


@api_router.post("/brahma-alarm/subscription")
async def enable_brahma_alarm(payload: BrahmaAlarmSubscription):
    if not vapid_configuration():
        raise HTTPException(503, "Background alarm delivery is not configured on this server")
    subscription = payload.subscription
    endpoint = subscription.get("endpoint")
    keys = subscription.get("keys") or {}
    if not isinstance(endpoint, str) or not endpoint.startswith("https://") or not keys.get("p256dh") or not keys.get("auth"):
        raise HTTPException(400, "Invalid browser push subscription")

    alarm_date, alarm_at = await asyncio.to_thread(
        compute_next_brahma_alarm,
        payload.lat,
        payload.lng,
        payload.time_zone,
        payload.tz_offset,
    )
    now = datetime.now(timezone.utc)
    await db.brahma_alarm_subscriptions.update_one(
        {"_id": _push_endpoint_id(endpoint)},
        {
            "$set": {
                "subscription": subscription,
                "lat": payload.lat,
                "lng": payload.lng,
                "time_zone": payload.time_zone,
                "tz_offset": payload.tz_offset,
                "enabled": True,
                "next_alarm_at": alarm_at,
                "next_alarm_date": alarm_date.isoformat(),
                "updated_at": now,
            },
            "$unset": {"claim_until": ""},
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )
    return {"enabled": True, "next_alarm_at": alarm_at.isoformat(), "next_alarm_date": alarm_date.isoformat()}


@api_router.delete("/brahma-alarm/subscription")
async def disable_brahma_alarm(endpoint: str):
    result = await db.brahma_alarm_subscriptions.delete_one({"_id": _push_endpoint_id(endpoint)})
    return {"enabled": False, "cancelled": result.deleted_count > 0}


class KundaliRequest(BaseModel):
    name: Optional[str] = None
    dob: str = Field(..., description="YYYY-MM-DD")
    time: str = Field(..., description="HH:MM 24-hour")
    place: str
    lat: float
    lng: float
    tz_offset: float = 5.5


@api_router.post("/kundali/generate")
async def generate_kundali(payload: KundaliRequest, request: Request):
    """Compute Kundali + optionally AI-generated reading. Persists per-user if signed-in."""
    chart = compute_kundali(payload.dob, payload.time, payload.lat, payload.lng, payload.tz_offset)

    reading = ""
    if LLM_AVAILABLE and os.getenv("EMERGENT_LLM_KEY"):
        try:
            chat = LlmChat(
                api_key=os.environ["EMERGENT_LLM_KEY"],
                session_id=f"kundali-{uuid.uuid4().hex[:8]}",
                system_message="You are an experienced Vedic astrologer. Give warm, personalized guidance. Never predict specific dates of death or catastrophes. Emphasize dharma, karma and personal effort alongside astrological patterns.",
            )
            chat.with_model("anthropic", "claude-sonnet-4-5-20250929").with_params(max_tokens=4096)
            summary = {
                "name": payload.name or "the native",
                "lagna": chart["lagna"]["rasi"],
                "janma_rasi": chart["janma_rasi"],
                "janma_nakshatra": chart["janma_nakshatra"],
                "planets": [{"n": p["name"], "r": p["rasi"], "h": p["house"], "nak": p["nakshatra"]} for p in chart["planets"]],
                "current_dasha": chart["vimshottari_dasha"][0],
                "doshas": chart["doshas"],
            }
            prompt = (
                f"Give a personalized Vedic Kundali reading for {payload.name or 'this native'} born on "
                f"{payload.dob} at {payload.time} in {payload.place}. Their chart summary is:\n\n"
                f"{json.dumps(summary, ensure_ascii=False, indent=2)}\n\n"
                "Please write 6 sections (use ## Markdown headings):\n"
                "1. **Overview** — Lagna, Janma Rāśi & Nakshatra character traits.\n"
                "2. **Career & Wealth** — 10th, 2nd, 11th houses.\n"
                "3. **Marriage & Relationships** — 7th, 5th houses; note any doshas.\n"
                "4. **Health & Vitality** — 1st, 6th, 8th houses.\n"
                "5. **Current Mahādaśā** — What this period suggests + spiritual guidance.\n"
                "6. **Remedies** — Simple mantras, deity worship, colours, gemstones (only suggest, don't demand)\n\n"
                "Keep it uplifting, ~400-600 words total."
            )
            reading = await chat.send_message(UserMessage(text=prompt))
        except Exception as e:
            reading = f"(AI reading currently unavailable: {e})"

    # If user is signed-in, persist
    user = await get_current_user(request)
    if user:
        await db.user_kundali.update_one(
            {"user_id": user["user_id"]},
            {"$set": {
                "user_id": user["user_id"],
                "name": payload.name, "dob": payload.dob, "time": payload.time,
                "place": payload.place, "lat": payload.lat, "lng": payload.lng, "tz_offset": payload.tz_offset,
                "chart": chart, "reading": reading,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
            upsert=True,
        )

    return {"chart": chart, "reading": reading, "saved": bool(user)}


@api_router.get("/kundali/mine")
async def get_saved_kundali(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Not authenticated")
    doc = await db.user_kundali.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "No kundali saved")
    return doc


class MatchPerson(BaseModel):
    name: Optional[str] = None
    dob: str
    time: str
    place: str
    lat: float
    lng: float
    tz_offset: float = 5.5


class KundaliMatchRequest(BaseModel):
    bride: MatchPerson
    groom: MatchPerson


@api_router.post("/kundali/match")
async def kundali_match(payload: KundaliMatchRequest):
    """Compute Aṣṭakūṭa Guṇa Milāna score between bride and groom."""
    from astrology import _compute_kutas
    b_chart = compute_kundali(payload.bride.dob, payload.bride.time, payload.bride.lat, payload.bride.lng, payload.bride.tz_offset)
    g_chart = compute_kundali(payload.groom.dob, payload.groom.time, payload.groom.lat, payload.groom.lng, payload.groom.tz_offset)
    result = _compute_kutas(b_chart["janma_nakshatra"], b_chart["janma_rasi"], g_chart["janma_nakshatra"], g_chart["janma_rasi"])
    return {
        "bride":  {"name": payload.bride.name, "janma_rasi": b_chart["janma_rasi"], "janma_nakshatra": b_chart["janma_nakshatra"]},
        "groom":  {"name": payload.groom.name, "janma_rasi": g_chart["janma_rasi"], "janma_nakshatra": g_chart["janma_nakshatra"]},
        "kutas":  result,
    }


@api_router.get("/horoscope")
async def get_horoscope(rashi: Optional[str] = None, nakshatra: Optional[str] = None, date_str: Optional[str] = None):
    """Daily horoscope for a given rāśi and/or nakshatra. Cached for 24h."""
    d = date_str or date_cls.today().isoformat()
    if not rashi and not nakshatra:
        raise HTTPException(400, "rashi or nakshatra required")

    cache_key = f"{d}::{(rashi or '').lower()}::{(nakshatra or '').lower()}"
    cached = await db.horoscope_cache.find_one({"key": cache_key}, {"_id": 0})
    if cached:
        return cached["data"]

    if not LLM_AVAILABLE or not os.getenv("EMERGENT_LLM_KEY"):
        return {"date": d, "rashi": rashi, "nakshatra": nakshatra, "prediction": "Horoscope service temporarily unavailable."}

    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"horo-{cache_key}",
            system_message="You are a compassionate Vedic astrologer. Give short, uplifting daily predictions rooted in classical jyotish. Always end with a positive mantra or affirmation.",
        )
        chat.with_model("anthropic", "claude-sonnet-4-5-20250929").with_params(max_tokens=800)
        who = []
        if rashi: who.append(f"Rāśi (Moon sign): {rashi}")
        if nakshatra: who.append(f"Janma Nakshatra: {nakshatra}")
        prompt = (
            f"Give today's Vedic horoscope for {d}.\n"
            + "\n".join(who) + "\n\n"
            "Provide 5 short sections (~35 words each) in this JSON format only:\n"
            '{"general": "...", "career": "...", "health": "...", "relationships": "...", "wealth": "...", "lucky_color": "...", "lucky_number": ..., "mantra": "..."}\n'
            "No commentary outside the JSON."
        )
        reply = await chat.send_message(UserMessage(text=prompt))
        import re as _re, json as _j
        m = _re.search(r"\{[\s\S]*\}", reply)
        if not m:
            raise ValueError("No JSON returned")
        data = _j.loads(m.group(0))
        payload = {"date": d, "rashi": rashi, "nakshatra": nakshatra, **data}
        await db.horoscope_cache.update_one({"key": cache_key}, {"$set": {"key": cache_key, "data": payload, "cached_at": datetime.now(timezone.utc)}}, upsert=True)
        return payload
    except Exception as e:
        return {"date": d, "rashi": rashi, "nakshatra": nakshatra, "prediction": f"(temporarily unavailable: {e})"}


app.include_router(api_router)




# Mount static images (deity portraits) — accessible at /api/static/deities/{id}.png
app.mount("/api/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

cors_origins = [origin.strip() for origin in os.environ.get("CORS_ORIGINS", "").split(",") if origin.strip()]
if not cors_origins:
    cors_origins = [
        "https://devineinintelligence.com",
        "https://www.devineinintelligence.com",
        "https://divine-dharma-daily.preview.emergentagent.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

allowed_hosts = [host.strip() for host in os.environ.get("ALLOWED_HOSTS", "").split(",") if host.strip()]
if not allowed_hosts:
    allowed_hosts = [
        "devineinintelligence.com",
        "www.devineinintelligence.com",
        "divine-dharma-daily.preview.emergentagent.com",
        "localhost",
        "127.0.0.1",
        "testserver",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=allowed_hosts,
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def _send_brahma_push(subscription, payload, config):
    from pywebpush import webpush

    await asyncio.to_thread(
        webpush,
        subscription_info=subscription,
        data=json.dumps(payload),
        vapid_private_key=config["private_key"],
        vapid_claims={"sub": config["subject"]},
        ttl=60,
        timeout=15,
    )


async def _process_due_brahma_alarms():
    config = vapid_configuration()
    if not config:
        return

    collection = db.brahma_alarm_subscriptions
    now = datetime.now(timezone.utc)
    due = await collection.find({"enabled": True, "next_alarm_at": {"$lte": now}}).to_list(100)
    for candidate in due:
        claim_until = now + timedelta(minutes=1)
        claimed = await collection.find_one_and_update(
            {
                "_id": candidate["_id"],
                "enabled": True,
                "next_alarm_at": {"$lte": now},
                "$or": [
                    {"claim_until": {"$exists": False}},
                    {"claim_until": {"$lte": now}},
                ],
            },
            {"$set": {"claim_until": claim_until}},
            return_document=ReturnDocument.AFTER,
        )
        if not claimed:
            continue

        try:
            next_date, next_at = await asyncio.to_thread(
                compute_next_brahma_alarm,
                claimed["lat"],
                claimed["lng"],
                claimed["time_zone"],
                claimed["tz_offset"],
                now + timedelta(seconds=1),
            )
            if (now - claimed["next_alarm_at"].replace(tzinfo=timezone.utc)).total_seconds() > 60:
                await collection.update_one(
                    {"_id": claimed["_id"], "claim_until": claim_until},
                    {"$set": {"next_alarm_at": next_at, "next_alarm_date": next_date.isoformat()}, "$unset": {"claim_until": ""}},
                )
                continue

            await _send_brahma_push(
                claimed["subscription"],
                {
                    "title": "Brahma Muhūrta",
                    "body": "Your local Brahma Muhūrta practice window has begun.",
                    "url": "/",
                    "tag": f"brahma-muhurta-{claimed['next_alarm_date']}",
                },
                config,
            )
            await collection.update_one(
                {"_id": claimed["_id"], "claim_until": claim_until},
                {
                    "$set": {
                        "next_alarm_at": next_at,
                        "next_alarm_date": next_date.isoformat(),
                        "last_sent_at": now,
                    },
                    "$unset": {"claim_until": ""},
                },
            )
        except Exception as error:
            status_code = getattr(getattr(error, "response", None), "status_code", None)
            if status_code in (404, 410):
                await collection.delete_one({"_id": claimed["_id"]})
                continue
            logger.exception("Brahma Muhurta push delivery failed")
            await collection.update_one(
                {"_id": claimed["_id"], "claim_until": claim_until},
                {"$unset": {"claim_until": ""}},
            )


async def _brahma_alarm_worker():
    while True:
        try:
            await _process_due_brahma_alarms()
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("Brahma Muhurta scheduler iteration failed")
        await asyncio.sleep(5)


_brahma_alarm_task = None


@app.on_event("startup")
async def start_brahma_alarm_worker():
    global _brahma_alarm_task
    if not vapid_configuration():
        logger.warning("Brahma Muhurta Web Push is disabled; configure VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY")
        return
    await db.brahma_alarm_subscriptions.create_index([("enabled", 1), ("next_alarm_at", 1)])
    _brahma_alarm_task = asyncio.create_task(_brahma_alarm_worker())


@app.on_event("shutdown")
async def shutdown_db_client():
    if _brahma_alarm_task:
        _brahma_alarm_task.cancel()
        try:
            await _brahma_alarm_task
        except asyncio.CancelledError:
            pass
    client.close()
