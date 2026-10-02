"""Backend tests for P0 astrology features: Muhurta timings, Kundali, Horoscope."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"


# ---------- Panchangam timings (Muhurta) ----------
def test_panchangam_timings_returns_key_slots():
    r = requests.get(f"{API}/panchangam/timings", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "timings" in data
    t = data["timings"]
    # Must contain the 5 core slots mentioned in spec
    for key in ("rahu_kala", "yama_ganda", "abhijit_muhurta", "brahma_muhurta", "amrita_kala"):
        assert key in t, f"missing timing slot: {key}. got keys={list(t.keys())}"
        slot = t[key]
        assert "start" in slot and "end" in slot and "label" in slot and "type" in slot
        assert slot["type"] in ("auspicious", "inauspicious")


def test_panchangam_timings_specific_date():
    r = requests.get(f"{API}/panchangam/timings", params={"date_str": "2026-01-15"}, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("date") == "2026-01-15"


# ---------- Kundali generation ----------
def test_kundali_generate_full_response():
    payload = {
        "name": "TEST_User",
        "dob": "1990-05-15",
        "time": "08:30",
        "place": "Hyderabad",
        "lat": 17.3850,
        "lng": 78.4867,
        "tz_offset": 5.5,
    }
    r = requests.post(f"{API}/kundali/generate", json=payload, timeout=90)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "chart" in d
    chart = d["chart"]
    assert "lagna" in chart and "rasi" in chart["lagna"]
    assert "janma_rasi" in chart
    assert "janma_nakshatra" in chart
    assert isinstance(chart.get("planets"), list) and len(chart["planets"]) >= 7
    for p in chart["planets"]:
        assert "name" in p and "rasi" in p and "house" in p
    assert isinstance(chart.get("vimshottari_dasha"), list) and len(chart["vimshottari_dasha"]) >= 5
    assert "doshas" in chart
    # AI reading (markdown)
    assert d.get("reading"), "AI reading missing/empty"
    assert isinstance(d["reading"], str) and len(d["reading"]) > 100


def test_kundali_generate_missing_fields_returns_422():
    # missing lat/lng
    r = requests.post(f"{API}/kundali/generate", json={"dob": "1990-05-15", "time": "08:30"}, timeout=15)
    assert r.status_code == 422


# ---------- Horoscope ----------
@pytest.mark.parametrize("rashi", ["Mesha", "Vrishabha", "Mithuna"])
def test_horoscope_returns_sections(rashi):
    r = requests.get(f"{API}/horoscope", params={"rashi": rashi}, timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d.get("rashi") == rashi
    for sec in ("general", "career", "health", "relationships", "wealth"):
        assert d.get(sec), f"missing/empty section: {sec}"
    # bonus fields
    assert "lucky_color" in d or "lucky" in d or "mantra" in d


# ---------- Deity names regression ----------
def test_deity_names_ashtottara_ganesha():
    r = requests.get(f"{API}/deities/ganesha/names",
                     params={"kind": "ashtottara", "page": 1, "page_size": 10}, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("deity_id") == "ganesha"
    assert d.get("kind") == "ashtottara"
    assert d.get("total") == 108
    assert len(d.get("names", [])) > 0
    n = d["names"][0]
    for f in ("n", "sa", "iast", "meaning"):
        assert f in n
