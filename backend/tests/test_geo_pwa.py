"""Backend tests for iteration 3 — geolocation-aware panchangam timings + PWA files."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"


def _hhmm_to_hours(s: str) -> float:
    h, m = s.split(":")
    return int(h) + int(m) / 60.0


# ---------- Panchangam timings: source=approximate ----------
def test_timings_no_geo_source_approximate():
    r = requests.get(f"{API}/panchangam/timings", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("source") == "approximate"
    assert "sunrise" in d and "sunset" in d


# ---------- Geolocation ----------
@pytest.mark.parametrize("city,lat,lng,tz,sr_min,sr_max,date_str", [
    ("Hyderabad",  17.3850,   78.4867,   5.5,  5.5,  6.5,  "2026-08-15"),
    ("London",     51.5074,   -0.1278,   0.0,  4.0,  5.5,  "2026-08-15"),
    ("Sydney",     -33.8688, 151.2093,  10.0,  6.0,  7.5,  "2026-08-15"),
    ("NewYork",    40.7128,  -74.006,   -5.0,  4.5,  6.0,  "2026-08-15"),
])
def test_timings_geolocation_source_and_sunrise(city, lat, lng, tz, sr_min, sr_max, date_str):
    r = requests.get(
        f"{API}/panchangam/timings",
        params={"lat": lat, "lng": lng, "tz_offset": tz, "date_str": date_str},
        timeout=15,
    )
    assert r.status_code == 200, r.text
    d = r.json()
    assert d.get("source") == "geolocation", f"{city}: source={d.get('source')}"
    sr = _hhmm_to_hours(d["sunrise"])
    assert sr_min <= sr <= sr_max, f"{city} sunrise={d['sunrise']} not in [{sr_min},{sr_max}]"


def test_timings_geolocation_tz_offset_zero_does_not_default():
    """Regression: tz_offset=0 must NOT be interpreted as default 5.5."""
    r = requests.get(
        f"{API}/panchangam/timings",
        params={"lat": 51.5074, "lng": -0.1278, "tz_offset": 0, "date_str": "2026-08-15"},
        timeout=15,
    )
    assert r.status_code == 200
    d = r.json()
    assert d.get("source") == "geolocation"
    sr = _hhmm_to_hours(d["sunrise"])
    # London Aug 15: real sunrise ~05:47 local. If tz was misinterpreted as 5.5 we'd see ~11:xx
    assert 4.0 <= sr <= 6.0, f"tz=0 handling broken: sunrise={d['sunrise']}"


# ---------- Backend regressions ----------
def test_kundali_regression():
    payload = {"name": "TEST_geo", "dob": "1990-05-15", "time": "08:30",
               "place": "Hyderabad", "lat": 17.385, "lng": 78.4867, "tz_offset": 5.5}
    r = requests.post(f"{API}/kundali/generate", json=payload, timeout=90)
    assert r.status_code == 200
    d = r.json()
    assert d.get("chart") and d.get("reading")


def test_horoscope_regression():
    r = requests.get(f"{API}/horoscope", params={"rashi": "Mesha"}, timeout=45)
    assert r.status_code == 200
    d = r.json()
    for sec in ("general", "career", "health", "relationships", "wealth"):
        assert d.get(sec)


def test_panchangam_and_week_regression():
    r1 = requests.get(f"{API}/panchangam", timeout=15)
    assert r1.status_code == 200
    r2 = requests.get(f"{API}/panchangam/week", timeout=15)
    assert r2.status_code == 200


def test_ganesha_ashtottara_regression():
    r = requests.get(f"{API}/deities/ganesha/names",
                     params={"kind": "ashtottara", "page": 1, "page_size": 200}, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("total") >= 100
    assert len(d.get("names", [])) >= 100


# ---------- PWA files ----------
def test_manifest_webmanifest():
    r = requests.get(f"{BASE_URL}/manifest.webmanifest", timeout=15)
    assert r.status_code == 200
    ct = r.headers.get("content-type", "").lower()
    assert "manifest" in ct or "json" in ct, f"content-type={ct}"
    j = r.json()
    assert "Devine Intelligence" in j.get("name", "")
    assert j.get("short_name")
    assert isinstance(j.get("icons"), list) and len(j["icons"]) >= 1
    scs = j.get("shortcuts", [])
    urls = {s.get("url") for s in scs}
    assert {"/japa", "/rama-koti", "/panchangam"}.issubset(urls), f"shortcuts urls={urls}"


def test_service_worker_js():
    r = requests.get(f"{BASE_URL}/service-worker.js", timeout=15)
    assert r.status_code == 200
    ct = r.headers.get("content-type", "").lower()
    assert "javascript" in ct, f"content-type={ct}"
    body = r.text
    assert "schedule-notification" in body
    assert "showNotification" in body
