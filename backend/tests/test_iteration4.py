"""Iteration 4 backend tests — Panchangam extras & Kundali Match (Ashtakuta Guna Milana)."""
import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / 'frontend' / '.env')
BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"

RITU_ALLOWED = {
    "Vasanta (Spring)", "Grishma (Summer)", "Varsha (Monsoon)",
    "Sharad (Autumn)", "Hemanta (Pre-winter)", "Shishira (Winter)"
}
AYANA_ALLOWED = {"Uttarāyaṇa", "Dakṣiṇāyana"}


# ---------- Panchangam extras ----------
class TestPanchangamExtras:
    def test_today_extras_present(self):
        r = requests.get(f"{API}/panchangam", timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ("samvatsara", "samvatsara_index", "vikrama_samvat", "shaka_samvat", "ritu", "ayana", "masa"):
            assert k in d, f"missing {k}"
        assert isinstance(d["samvatsara"], str) and d["samvatsara"]
        assert 1 <= d["samvatsara_index"] <= 60
        assert isinstance(d["vikrama_samvat"], int)
        assert isinstance(d["shaka_samvat"], int)
        assert d["ritu"] in RITU_ALLOWED
        assert d["ayana"] in AYANA_ALLOWED
        assert isinstance(d["masa"], str) and d["masa"]

    def test_aug_2026_vikrama(self):
        r = requests.get(f"{API}/panchangam", params={"date_str": "2026-08-15"}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        # Vikrama Samvat for Aug 2026 (after Chaitra) = 2026+57 = 2083
        assert d["vikrama_samvat"] == 2083
        # Shaka Samvat = 2026 - 78 = 1948
        assert d["shaka_samvat"] == 1948
        # Aug is Dakshinayana (after Jul 16)
        assert d["ayana"] == "Dakṣiṇāyana"

    def test_week_extras(self):
        r = requests.get(f"{API}/panchangam/week", timeout=15)
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list) and len(arr) == 7
        for day in arr:
            for k in ("samvatsara", "vikrama_samvat", "shaka_samvat", "ritu", "ayana", "masa"):
                assert k in day, f"missing {k} in week entry"
            assert day["ayana"] in AYANA_ALLOWED
            assert day["ritu"] in RITU_ALLOWED


# ---------- Kundali Match ----------
class TestKundaliMatch:
    def _sample(self):
        return {
            "bride": {"name": "Sita", "dob": "1992-03-15", "time": "14:20",
                      "place": "Hyderabad", "lat": 17.385, "lng": 78.4867, "tz_offset": 5.5},
            "groom": {"name": "Ram", "dob": "1990-05-15", "time": "08:30",
                      "place": "Hyderabad", "lat": 17.385, "lng": 78.4867, "tz_offset": 5.5},
        }

    def test_match_success(self):
        r = requests.post(f"{API}/kundali/match", json=self._sample(), timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "bride" in d and "groom" in d and "kutas" in d
        assert d["bride"]["name"] == "Sita"
        assert d["groom"]["name"] == "Ram"
        assert "janma_rasi" in d["bride"] and "janma_nakshatra" in d["bride"]

        k = d["kutas"]
        for key in ("varna", "vashya", "tara", "yoni", "graha_maitri", "gana", "bhakoot", "nadi"):
            assert key in k, f"missing kuta {key}"
            assert "score" in k[key] and "max" in k[key] and "desc" in k[key]
            assert 0 <= k[key]["score"] <= k[key]["max"]
        assert k["max"] == 36
        assert 0 <= k["total"] <= 36
        assert isinstance(k["verdict"], str) and len(k["verdict"]) > 0

    def test_match_verdict_range(self):
        r = requests.post(f"{API}/kundali/match", json=self._sample(), timeout=30)
        d = r.json()
        total = d["kutas"]["total"]
        # Spec says ~23.5 → verdict should start with "Acceptable" (18–23)
        # We assert verdict is consistent with total
        verdict = d["kutas"]["verdict"]
        if total >= 32:
            assert verdict.startswith("Excellent")
        elif total >= 24:
            assert verdict.startswith("Very Good")
        elif total >= 18:
            assert verdict.startswith("Acceptable")
        else:
            assert verdict.startswith("Low")

    def test_match_invalid_dob(self):
        payload = self._sample()
        payload["bride"]["dob"] = "not-a-date"
        r = requests.post(f"{API}/kundali/match", json=payload, timeout=15)
        # Server should reject: either 422 (pydantic/validation) or 400/500 from parse
        assert r.status_code in (400, 422, 500)

    def test_match_missing_bride(self):
        payload = self._sample()
        del payload["bride"]
        r = requests.post(f"{API}/kundali/match", json=payload, timeout=15)
        assert r.status_code == 422

    def test_match_missing_groom(self):
        payload = self._sample()
        del payload["groom"]
        r = requests.post(f"{API}/kundali/match", json=payload, timeout=15)
        assert r.status_code == 422


# ---------- Regression basics ----------
class TestRegression:
    def test_manifest(self):
        r = requests.get(f"{BASE_URL}/manifest.webmanifest", timeout=10)
        assert r.status_code == 200

    def test_panchangam_today_basic(self):
        r = requests.get(f"{API}/panchangam", timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ("tithi", "nakshatra", "vara", "sunrise", "sunset"):
            assert k in d
