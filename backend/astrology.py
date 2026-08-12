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


def compute_sunrise_sunset(d: date_cls, lat: float, lng: float, tz_offset: float = 5.5) -> Tuple[str, str]:
    """Real astronomical sunrise/sunset via pyswisseph.

    Returns ("HH:MM", "HH:MM") in local time (tz_offset in decimal hours).
    Falls back to a simple sinusoidal model on error.
    """
    try:
        # Start looking for the day's sunrise from local midnight (UT)
        jd_start = swe.julday(d.year, d.month, d.day, 0.0 - tz_offset)

        geopos = (lng, lat, 0.0)  # (longitude east, latitude north, altitude)
        # RSMI = rise. Note swe.rise_trans expects (jd_ut, planet, geopos, atpress, attemp, rsmi)
        rsmi_rise = swe.CALC_RISE | swe.BIT_DISC_CENTER
        rsmi_set  = swe.CALC_SET  | swe.BIT_DISC_CENTER

        # newer pyswisseph API: rise_trans(jd_start, body, rsmi, geopos, atpress, attemp)
        ret, rise_jd = swe.rise_trans(jd_start, swe.SUN, rsmi_rise, geopos, 0, 0)
        if ret < 0 or not rise_jd:
            raise ValueError("no rise")
        ret2, set_jd = swe.rise_trans(jd_start, swe.SUN, rsmi_set, geopos, 0, 0)
        if ret2 < 0 or not set_jd:
            raise ValueError("no set")

        # rise_jd/set_jd may be tuple in some versions
        r_ut = rise_jd[0] if isinstance(rise_jd, (tuple, list)) else rise_jd
        s_ut = set_jd[0]  if isinstance(set_jd,  (tuple, list)) else set_jd

        # convert to local time-of-day (hours) — JD starts at noon UT, so add 0.5
        r_local = (((r_ut + tz_offset / 24.0) + 0.5) % 1.0) * 24.0
        s_local = (((s_ut + tz_offset / 24.0) + 0.5) % 1.0) * 24.0

        def fmt(h_dec: float) -> str:
            h = int(h_dec) % 24
            m = int(round((h_dec - int(h_dec)) * 60))
            if m == 60: h = (h + 1) % 24; m = 0
            return f"{h:02d}:{m:02d}"

        return fmt(r_local), fmt(s_local)
    except Exception:
        # Fallback: approximate model (Hyderabad-like)
        import math
        doy = d.timetuple().tm_yday
        # crude latitude adjustment (deviation from 17°N reference)
        lat_shift = (lat - 17.4) * 0.03
        sr = 6 + math.sin(2 * math.pi * (doy - 80) / 365) * 0.5 + lat_shift
        ss = 18 - math.sin(2 * math.pi * (doy - 80) / 365) * 0.5 - lat_shift
        def fmt(h_dec):
            h = int(h_dec) % 24
            m = int(round((h_dec - int(h_dec)) * 60))
            if m == 60: h = (h + 1) % 24; m = 0
            return f"{h:02d}:{m:02d}"
        return fmt(sr), fmt(ss)


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


# ============================================================================
# ASHTAKUTA GUNA MILANA — 8-fold Kundali marriage compatibility scoring (36 pts)
# ============================================================================
_NAK_VARNA = {  # Brahmin=3, Kshatriya=2, Vaishya=1, Shudra=0 by nakshatra
    "Ashwini": 3, "Bharani": 0, "Krittika": 1, "Rohini": 3, "Mrigashira": 3, "Ardra": 2,
    "Punarvasu": 1, "Pushya": 0, "Ashlesha": 2, "Magha": 0, "Purva Phalguni": 2, "Uttara Phalguni": 2,
    "Hasta": 3, "Chitra": 0, "Swati": 1, "Vishakha": 3, "Anuradha": 0, "Jyeshtha": 1,
    "Mula": 1, "Purva Ashadha": 3, "Uttara Ashadha": 2, "Shravana": 2, "Dhanishta": 3,
    "Shatabhisha": 3, "Purva Bhadrapada": 1, "Uttara Bhadrapada": 2, "Revati": 0,
}
_VASHYA = {  # 0..5 mapped by rasi index (Mesha..Meena): typical vashya groups
    0: "quad", 1: "quad", 2: "human", 3: "aquatic", 4: "quad", 5: "human",
    6: "human", 7: "insect", 8: "quad", 9: "quad", 10: "human", 11: "aquatic",
}
_VASHYA_SCORE = {
    ("human","human"): 2, ("quad","quad"): 2, ("aquatic","aquatic"): 2, ("insect","insect"): 2,
    ("human","quad"): 1, ("quad","human"): 1, ("human","aquatic"): 0.5, ("aquatic","human"): 0.5,
    ("quad","aquatic"): 1, ("aquatic","quad"): 1, ("human","insect"): 0.5, ("insect","human"): 0.5,
}
_YONI = {  # 14 yoni animals, each nakshatra has one; simplified table (bride/groom)
    "Ashwini":"horse","Bharani":"elephant","Krittika":"sheep","Rohini":"serpent","Mrigashira":"serpent",
    "Ardra":"dog","Punarvasu":"cat","Pushya":"sheep","Ashlesha":"cat","Magha":"rat",
    "Purva Phalguni":"rat","Uttara Phalguni":"cow","Hasta":"buffalo","Chitra":"tiger","Swati":"buffalo",
    "Vishakha":"tiger","Anuradha":"deer","Jyeshtha":"deer","Mula":"dog","Purva Ashadha":"monkey",
    "Uttara Ashadha":"mongoose","Shravana":"monkey","Dhanishta":"lion","Shatabhisha":"horse",
    "Purva Bhadrapada":"lion","Uttara Bhadrapada":"cow","Revati":"elephant",
}
_YONI_ENEMIES = {  # simplified enemy pairs (score 0)
    frozenset({"cow","tiger"}), frozenset({"elephant","lion"}), frozenset({"horse","buffalo"}),
    frozenset({"dog","deer"}), frozenset({"cat","rat"}), frozenset({"serpent","mongoose"}),
    frozenset({"monkey","sheep"}),
}
_YONI_NEUTRAL = {  # 1 point for neutral pairs (very abbreviated)
    frozenset({"horse","sheep"}), frozenset({"dog","cat"}), frozenset({"elephant","monkey"}),
}
_RASI_LORD = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"]
_GRAHA_FRIENDS = {
    "Sun": {"Moon","Mars","Jupiter"}, "Moon": {"Sun","Mercury"},
    "Mars": {"Sun","Moon","Jupiter"}, "Mercury": {"Sun","Venus"},
    "Jupiter": {"Sun","Moon","Mars"}, "Venus": {"Mercury","Saturn"},
    "Saturn": {"Mercury","Venus"},
}
_GRAHA_ENEMIES = {
    "Sun": {"Venus","Saturn"}, "Moon": set(), "Mars": {"Mercury"},
    "Mercury": {"Moon"}, "Jupiter": {"Mercury","Venus"},
    "Venus": {"Sun","Moon"}, "Saturn": {"Sun","Moon","Mars"},
}
_GANA = {  # deva, manushya, rakshasa
    "Ashwini":"deva","Bharani":"manushya","Krittika":"rakshasa","Rohini":"manushya","Mrigashira":"deva",
    "Ardra":"manushya","Punarvasu":"deva","Pushya":"deva","Ashlesha":"rakshasa","Magha":"rakshasa",
    "Purva Phalguni":"manushya","Uttara Phalguni":"manushya","Hasta":"deva","Chitra":"rakshasa","Swati":"deva",
    "Vishakha":"rakshasa","Anuradha":"deva","Jyeshtha":"rakshasa","Mula":"rakshasa","Purva Ashadha":"manushya",
    "Uttara Ashadha":"manushya","Shravana":"deva","Dhanishta":"rakshasa","Shatabhisha":"rakshasa",
    "Purva Bhadrapada":"manushya","Uttara Bhadrapada":"manushya","Revati":"deva",
}
_NADI = {  # aadi, madhya, antya (0,1,2)
    "Ashwini":0,"Bharani":1,"Krittika":2,"Rohini":2,"Mrigashira":1,"Ardra":0,"Punarvasu":0,"Pushya":1,
    "Ashlesha":2,"Magha":2,"Purva Phalguni":1,"Uttara Phalguni":0,"Hasta":0,"Chitra":1,"Swati":2,
    "Vishakha":2,"Anuradha":1,"Jyeshtha":0,"Mula":0,"Purva Ashadha":1,"Uttara Ashadha":2,
    "Shravana":2,"Dhanishta":1,"Shatabhisha":0,"Purva Bhadrapada":0,"Uttara Bhadrapada":1,"Revati":2,
}

def _rasi_idx(rasi_name: str) -> int:
    return RASI_NAMES.index(rasi_name) if rasi_name in RASI_NAMES else 0

def _compute_kutas(bride_nak: str, bride_rasi: str, groom_nak: str, groom_rasi: str) -> Dict[str, Any]:
    b_ri, g_ri = _rasi_idx(bride_rasi), _rasi_idx(groom_rasi)

    # 1. Varna (1 pt): groom's varna >= bride's varna
    bv, gv = _NAK_VARNA.get(bride_nak, 0), _NAK_VARNA.get(groom_nak, 0)
    varna = 1 if gv >= bv else 0

    # 2. Vashya (2 pt)
    v = _VASHYA_SCORE.get((_VASHYA[b_ri], _VASHYA[g_ri]), 0)
    vashya = float(v)

    # 3. Tara / Dina (3 pt): count from bride nak to groom nak mod 9
    b_ni = NAKSHATRA_NAMES.index(bride_nak) if bride_nak in NAKSHATRA_NAMES else 0
    g_ni = NAKSHATRA_NAMES.index(groom_nak) if groom_nak in NAKSHATRA_NAMES else 0
    tara_b = ((g_ni - b_ni) % 27) % 9
    tara_g = ((b_ni - g_ni) % 27) % 9
    # 0,2,4,6,8 = auspicious → 1.5 each; both auspicious = 3
    tara = (1.5 if tara_b in (0,2,4,6,8) else 0) + (1.5 if tara_g in (0,2,4,6,8) else 0)

    # 4. Yoni (4 pt)
    by, gy = _YONI.get(bride_nak,""), _YONI.get(groom_nak,"")
    if by == gy: yoni = 4
    elif frozenset({by, gy}) in _YONI_ENEMIES: yoni = 0
    elif frozenset({by, gy}) in _YONI_NEUTRAL: yoni = 2
    else: yoni = 3

    # 5. Graha Maitri (5 pt): lord of moon rasi
    bl, gl = _RASI_LORD[b_ri], _RASI_LORD[g_ri]
    if bl == gl: gm = 5
    elif gl in _GRAHA_FRIENDS.get(bl, set()) and bl in _GRAHA_FRIENDS.get(gl, set()): gm = 5
    elif gl in _GRAHA_FRIENDS.get(bl, set()) or bl in _GRAHA_FRIENDS.get(gl, set()): gm = 4
    elif gl in _GRAHA_ENEMIES.get(bl, set()) and bl in _GRAHA_ENEMIES.get(gl, set()): gm = 0
    elif gl in _GRAHA_ENEMIES.get(bl, set()) or bl in _GRAHA_ENEMIES.get(gl, set()): gm = 1
    else: gm = 3

    # 6. Gana (6 pt)
    bg, gg = _GANA.get(bride_nak,"deva"), _GANA.get(groom_nak,"deva")
    if bg == gg: gana = 6
    elif {bg, gg} == {"deva","manushya"}: gana = 5
    elif {bg, gg} == {"manushya","rakshasa"}: gana = 1
    else: gana = 0

    # 7. Bhakoot / Rasi (7 pt): count 12 - 6/8, 5/9, 2/12
    diff = (g_ri - b_ri) % 12
    bad = { (6-1) % 12, (8-1) % 12, (5-1) % 12, (9-1) % 12, (2-1) % 12, (12-1) % 12 }
    if diff in {6, 8, 5, 9, 2, 12 % 12}:
        # 6/8 and 2/12 and 5/9 pairs
        pass
    if diff in {6, 8}: bhakoot = 0
    elif diff in {5, 9}: bhakoot = 0
    elif diff in {2, 10}: bhakoot = 0
    else: bhakoot = 7

    # 8. Nadi (8 pt): different nadi → 8, same nadi → 0 (dosha)
    nadi = 8 if _NADI.get(bride_nak,0) != _NADI.get(groom_nak,0) else 0

    total = varna + vashya + tara + yoni + gm + gana + bhakoot + nadi
    return {
        "varna":     {"score": varna,   "max": 1, "desc": "Spiritual compatibility (groom's varna ≥ bride's)"},
        "vashya":    {"score": vashya,  "max": 2, "desc": "Dominance & mutual attraction"},
        "tara":      {"score": tara,    "max": 3, "desc": "Health & longevity (birth-star fortune)"},
        "yoni":      {"score": yoni,    "max": 4, "desc": "Sexual & instinctual harmony"},
        "graha_maitri": {"score": gm,   "max": 5, "desc": "Mental & spiritual friendship of ruling planets"},
        "gana":      {"score": gana,    "max": 6, "desc": "Temperament (deva/manushya/rakshasa)"},
        "bhakoot":   {"score": bhakoot, "max": 7, "desc": "Rāśi placement & family prosperity"},
        "nadi":      {"score": nadi,    "max": 8, "desc": "Genetic / progeny compatibility"},
        "total":     round(total, 1),
        "max":       36,
        "verdict":   _match_verdict(total),
    }

def _match_verdict(total: float) -> str:
    if total >= 32: return "Excellent — Highly compatible"
    if total >= 24: return "Very Good — Recommended"
    if total >= 18: return "Acceptable — Consider carefully"
    return "Low — Not recommended without remedies"


# ============================================================================
# Panchangam extras: Samvatsara, Ṛtu, Ayana, Māsa
# ============================================================================
_SAMVATSARA_NAMES = [
    "Prabhava","Vibhava","Shukla","Pramodyuta","Prajapati","Angirasa","Shrimukha","Bhava","Yuva","Dhata",
    "Ishvara","Bahudhanya","Pramathi","Vikrama","Vrisha","Chitrabhanu","Svabhanu","Tarana","Parthiva","Vyaya",
    "Sarvajit","Sarvadhari","Virodhi","Vikriti","Khara","Nandana","Vijaya","Jaya","Manmatha","Durmukhi",
    "Hemalambi","Vilambi","Vikari","Sharvari","Plava","Shubhakrit","Shobhakrit","Krodhi","Vishvavasu","Parabhava",
    "Plavanga","Kilaka","Saumya","Sadharana","Virodhikrit","Paridhavi","Pramadi","Ananda","Rakshasa","Nala",
    "Pingala","Kalayukti","Siddharthi","Raudra","Durmati","Dundubhi","Rudhirodgari","Raktakshi","Krodhana","Akshaya",
]
_RITU_NAMES = ["Vasanta (Spring)","Grishma (Summer)","Varsha (Monsoon)","Sharad (Autumn)","Hemanta (Pre-winter)","Shishira (Winter)"]
_MASA_NAMES = ["Chaitra","Vaishakha","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashvin","Kartika","Margashirsha","Pausha","Magha","Phalguna"]

def panchangam_extras(d: date_cls) -> Dict[str, Any]:
    """Return samvatsara (60-year cycle), Vikrama & Shaka years, ritu, ayana, masa."""
    year = d.year
    # Vikrama Samvat = CE + 57 (from Chaitra); Shaka = CE - 78
    vikrama = year + 57 if d.month >= 4 else year + 56
    shaka = year - 78 if d.month >= 4 else year - 79
    # Samvatsara: cycle indexed from Shaka era offset ~ (Shaka - 4) mod 60 for Prabhava
    samv_idx = (shaka + 12) % 60
    # Ritu: 6 seasons of 2 months each starting Chaitra (~ mid-March)
    # Solar rāśi approximation: month of Chaitra begins ~ March 22 (Mesha)
    ritu_map = [
        (3, 22, 0), (5, 22, 1), (7, 22, 2), (9, 23, 3), (11, 22, 4), (1, 20, 5),  # approx sun sign starts
    ]
    ritu_idx = 5  # default winter
    for m, day, ri in ritu_map:
        if (d.month, d.day) >= (m, day): ritu_idx = ri
    # Ayana: Uttarayana ~ Jan 14 (Makara Sankranti) to Jul 16
    if (d.month, d.day) >= (1, 14) and (d.month, d.day) < (7, 16):
        ayana = "Uttarāyaṇa"
    else:
        ayana = "Dakṣiṇāyana"
    # Masa: approximate Chaitra starts mid-Mar; each lunar month spans ~30d
    m_idx = (d.month + 8) % 12  # Chaitra = index 0 aligns with March
    return {
        "samvatsara": _SAMVATSARA_NAMES[samv_idx],
        "samvatsara_index": samv_idx + 1,
        "vikrama_samvat": vikrama,
        "shaka_samvat": shaka,
        "ritu": _RITU_NAMES[ritu_idx],
        "ayana": ayana,
        "masa": _MASA_NAMES[m_idx],
    }
