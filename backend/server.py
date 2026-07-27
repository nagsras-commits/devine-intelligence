from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, date, timedelta
import math

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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

    tithi_idx = int((days * 12) % 30)
    nak_idx = int((days * 13) % 27)
    yoga_idx = int((days * 11) % 27)
    karana_idx = int((days * 2) % 7)
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
    return compute_panchangam(d)


@api_router.get("/panchangam/week")
async def get_week_panchangam():
    today = date.today()
    return [compute_panchangam(today + timedelta(days=i)) for i in range(7)]


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


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
