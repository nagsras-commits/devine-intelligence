"""Vedic astrology helpers — Panchangam timings, Kundali generation, Horoscope."""
from __future__ import annotations
import swisseph as swe
from datetime import datetime, timedelta, date as date_cls
from typing import Dict, List, Tuple, Any

# Use Lahiri ayanamsa (standard Indian sidereal system)
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)

RASI_NAMES = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
]

NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]

PLANETS = [
    ("Sun (Ravi)", swe.SUN), ("Moon (Chandra)", swe.MOON),
    ("Mars (Mangala)", swe.MARS), ("Mercury (Budha)", swe.MERCURY),
    ("Jupiter (Guru)", swe.JUPITER), ("Venus (Shukra)", swe.VENUS),
    ("Saturn (Shani)", swe.SATURN), ("Rahu", swe.MEAN_NODE), ("Ketu", swe.MEAN_NODE),
]

DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}
DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
NAKSHATRA_LORD = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"] * 3


def _parse_hhmm(s: str) -> Tuple[int, int]:
    parts = s.strip().split(":")
    return int(parts[0]), int(parts[1])


def compute_muhurta_timings(sunrise: str, sunset: str, weekday: int) -> Dict[str, Any]:
    """weekday: 0=Monday .. 6=Sunday (Python .weekday())."""
    sr_h, sr_m = _parse_hhmm(sunrise); ss_h, ss_m = _parse_hhmm(sunset)
    sunrise_min = sr_h * 60 + sr_m
    sunset_min  = ss_h * 60 + ss_m
    day_len = sunset_min - sunrise_min  # in minutes
    if day_len <= 0:
        day_len = 720
    slot = day_len / 8.0  # eight equal parts

    # Day-order for Rahu Kala (index of slot occupied) — 0=Sunday .. 6=Saturday (Vedic convention)
    # Python weekday: Mon=0 → convert to Sunday-first for these tables
    dow = (weekday + 1) % 7  # now Sun=0, Mon=1, ..., Sat=6
    rahu_kala_slot   = [8, 2, 7, 5, 6, 4, 3][dow]  # Sun=8th(after 8pm), ... using traditional order 
    # Standard positions:
    # Sun: 5th, Mon: 2nd, Tue: 7th, Wed: 5th, Thu: 6th, Fri: 4th, Sat: 3rd (0-indexed conventions vary)
    # Let's use the common 0-indexed 8-slot convention: Sun=7, Mon=1, Tue=6, Wed=4, Thu=5, Fri=3, Sat=2
    rahu_kala_slot = [7, 1, 6, 4, 5, 3, 2][dow]
    yama_ganda_slot = [4, 3, 2, 1, 0, 6, 5][dow]
    gulika_slot     = [6, 5, 4, 3, 2, 1, 0][dow]

    def format_slot(idx: int) -> Dict[str, str]:
        start = sunrise_min + int(idx * slot)
        end = sunrise_min + int((idx + 1) * slot)
        return {"start": f"{start // 60:02d}:{start % 60:02d}",
                "end":   f"{end // 60:02d}:{end % 60:02d}"}

    # Abhijit Muhurta — 8th of 15 slots between sunrise & sunset (middle ~24 mins around solar noon)
    noon = (sunrise_min + sunset_min) / 2
    abhijit_start = int(noon - 24)
    abhijit_end = int(noon + 24)

    # Brahma Muhurta — 96 minutes before sunrise, lasting 48 mins
    brahma_start = sunrise_min - 96
    brahma_end = sunrise_min - 48

    # Amrita Kalam — an auspicious 90-min window ~2h after sunrise
    amrita_start = sunrise_min + 120
    amrita_end = sunrise_min + 210

    def fm(m: int) -> str:
        m = max(0, m)
        return f"{(m // 60) % 24:02d}:{m % 60:02d}"

    return {
        "rahu_kala":       {"label": "Rāhu Kāla", "type": "inauspicious", **format_slot(rahu_kala_slot)},
        "yama_ganda":      {"label": "Yama Gaṇḍa", "type": "inauspicious", **format_slot(yama_ganda_slot)},
        "gulika_kala":     {"label": "Gulika Kāla", "type": "inauspicious", **format_slot(gulika_slot)},
        "abhijit_muhurta": {"label": "Abhijit Muhūrta", "type": "auspicious",
                             "start": fm(abhijit_start), "end": fm(abhijit_end)},
        "brahma_muhurta":  {"label": "Brahma Muhūrta", "type": "auspicious",
                             "start": fm(brahma_start), "end": fm(brahma_end)},
        "amrita_kala":     {"label": "Amṛta Kāla", "type": "auspicious",
                             "start": fm(amrita_start), "end": fm(amrita_end)},
        "durmuhurta":      {"label": "Durmuhūrta", "type": "inauspicious",
                             "start": fm(sunrise_min + int(slot * 5)),
                             "end":   fm(sunrise_min + int(slot * 5) + 48)},
    }


def _jd_from_datetime(dt: datetime, tz_offset_h: float) -> float:
    """Julian day from local datetime + timezone offset (in hours from UTC)."""
    ut = dt - timedelta(hours=tz_offset_h)
    return swe.julday(ut.year, ut.month, ut.day, ut.hour + ut.minute / 60.0 + ut.second / 3600.0)


def _sidereal_ecliptic(jd: float, planet: int) -> float:
    """Return sidereal longitude (0..360) using Lahiri ayanamsa."""
    val, _flg = swe.calc_ut(jd, planet, swe.FLG_SIDEREAL)
    return val[0] % 360.0


def _lagna(jd: float, lat: float, lng: float) -> float:
    """Return ascendant (Lagna) sidereal longitude 0..360."""
    houses, ascmc = swe.houses_ex(jd, lat, lng, b'W', swe.FLG_SIDEREAL)
    return ascmc[0] % 360.0  # asc
    

def compute_kundali(dob: str, time_str: str, lat: float, lng: float, tz_offset_h: float = 5.5) -> Dict[str, Any]:
    """dob 'YYYY-MM-DD', time_str 'HH:MM'."""
    dt = datetime.fromisoformat(f"{dob}T{time_str}:00")
    jd = _jd_from_datetime(dt, tz_offset_h)

    lagna_deg = _lagna(jd, lat, lng)
    lagna_rasi = int(lagna_deg // 30)

    planet_positions: List[Dict[str, Any]] = []
    for name, code in PLANETS:
        if name == "Ketu":
            rahu_pos = _sidereal_ecliptic(jd, swe.MEAN_NODE)
            deg = (rahu_pos + 180.0) % 360.0
        else:
            deg = _sidereal_ecliptic(jd, code)
        rasi_idx = int(deg // 30)
        nak_idx = int(deg // (360.0 / 27))
        pada = int(((deg % (360.0 / 27)) / ((360.0 / 27) / 4))) + 1
        house = ((rasi_idx - lagna_rasi) % 12) + 1
        planet_positions.append({
            "name": name,
            "longitude": round(deg, 4),
            "rasi": RASI_NAMES[rasi_idx],
            "rasi_idx": rasi_idx,
            "nakshatra": NAKSHATRA_NAMES[nak_idx],
            "nakshatra_idx": nak_idx,
            "pada": pada,
            "house": house,
        })

    moon = next(p for p in planet_positions if p["name"].startswith("Moon"))
    janma_nakshatra = moon["nakshatra"]
    janma_rasi = moon["rasi"]

    # Vimshottari Mahadasha
    moon_lord = NAKSHATRA_LORD[moon["nakshatra_idx"]]
    frac_in_nak = (moon["longitude"] % (360.0 / 27)) / (360.0 / 27)
    balance_years = DASHA_YEARS[moon_lord] * (1 - frac_in_nak)

    dashas: List[Dict[str, Any]] = []
    cursor = dt
    # First (running) dasha
    order_start = DASHA_ORDER.index(moon_lord)
    end = cursor + timedelta(days=balance_years * 365.25)
    dashas.append({"lord": moon_lord, "start": cursor.date().isoformat(), "end": end.date().isoformat(), "years": round(balance_years, 2)})
    cursor = end
    for i in range(1, 9):
        lord = DASHA_ORDER[(order_start + i) % 9]
        end = cursor + timedelta(days=DASHA_YEARS[lord] * 365.25)
        dashas.append({"lord": lord, "start": cursor.date().isoformat(), "end": end.date().isoformat(), "years": DASHA_YEARS[lord]})
        cursor = end

    # Doshas — mangala dosha (Mars in 1,2,4,7,8,12 from Lagna or Moon)
    mars = next(p for p in planet_positions if "Mars" in p["name"])
    mangal_houses = {1, 2, 4, 7, 8, 12}
    mangal_dosha = mars["house"] in mangal_houses

    # Kaal Sarpa Dosha — all planets between Rahu and Ketu (rough check)
    rahu = next(p for p in planet_positions if p["name"] == "Rahu")
    ketu = next(p for p in planet_positions if p["name"] == "Ketu")
    def _within(deg, a, b):
        # is deg between a and b going forward
        return ((deg - a) % 360) < ((b - a) % 360)
    others = [p for p in planet_positions if p["name"] not in ("Rahu", "Ketu")]
    kaal_sarpa = all(_within(p["longitude"], rahu["longitude"], ketu["longitude"]) for p in others) or \
                 all(_within(p["longitude"], ketu["longitude"], rahu["longitude"]) for p in others)

    # 12 house lords (which rasi occupies each house)
    houses: List[Dict[str, Any]] = []
    for h in range(1, 13):
        rasi_idx = (lagna_rasi + h - 1) % 12
        occupants = [p["name"] for p in planet_positions if p["house"] == h]
        houses.append({"house": h, "rasi": RASI_NAMES[rasi_idx], "occupants": occupants})

    return {
        "lagna": {"rasi": RASI_NAMES[lagna_rasi], "degree": round(lagna_deg, 4)},
        "janma_rasi": janma_rasi,
        "janma_nakshatra": janma_nakshatra,
        "moon_nakshatra_lord": moon_lord,
        "planets": planet_positions,
        "houses": houses,
        "vimshottari_dasha": dashas,
        "doshas": {
            "mangal_dosha": mangal_dosha,
            "kaal_sarpa_dosha": kaal_sarpa,
        },
    }
