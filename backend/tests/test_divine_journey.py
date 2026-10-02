"""Backend tests for Divine Journey / Sanathana Dharma app."""
import os
import uuid
from datetime import date, timedelta

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://divine-dharma-daily.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

REQUIRED_PANCHANGAM_FIELDS = [
    "date", "vara", "vara_sanskrit", "paksha", "tithi", "tithi_number",
    "nakshatra", "yoga", "karana", "sunrise", "sunset", "deity_of_day",
    "auspicious_note",
]


@pytest.fixture(scope="module")
def device_id():
    return f"TEST_{uuid.uuid4()}"


# ---------- Root ----------
def test_root_returns_message():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "message" in data
    assert isinstance(data["message"], str) and len(data["message"]) > 0


# ---------- Panchangam ----------
def test_panchangam_today():
    r = requests.get(f"{API}/panchangam", timeout=15)
    assert r.status_code == 200
    data = r.json()
    for f in REQUIRED_PANCHANGAM_FIELDS:
        assert f in data, f"missing {f}"
    assert data["date"] == date.today().isoformat()


def test_panchangam_specific_date():
    r = requests.get(f"{API}/panchangam", params={"date_str": "2026-01-15"}, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["date"] == "2026-01-15"
    assert data["paksha"] in ("Shukla Paksha", "Krishna Paksha")


def test_panchangam_invalid_date():
    r = requests.get(f"{API}/panchangam", params={"date_str": "not-a-date"}, timeout=15)
    assert r.status_code == 400


def test_panchangam_week():
    r = requests.get(f"{API}/panchangam/week", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 7
    assert data[0]["date"] == date.today().isoformat()
    assert data[6]["date"] == (date.today() + timedelta(days=6)).isoformat()
    for item in data:
        for f in REQUIRED_PANCHANGAM_FIELDS:
            assert f in item


# ---------- Bookmarks ----------
def test_bookmarks_crud(device_id):
    payload = {"kind": "sloka", "ref_id": "wake-up", "title": "Karagre Vasate", "device_id": device_id}
    r = requests.post(f"{API}/bookmarks", json=payload, timeout=15)
    assert r.status_code == 200
    created = r.json()
    assert created["kind"] == "sloka"
    assert created["ref_id"] == "wake-up"
    assert created["title"] == "Karagre Vasate"
    assert created["device_id"] == device_id
    assert "id" in created
    bid = created["id"]

    # List
    r = requests.get(f"{API}/bookmarks", params={"device_id": device_id}, timeout=15)
    assert r.status_code == 200
    lst = r.json()
    assert any(b["id"] == bid for b in lst)

    # Delete
    r = requests.delete(f"{API}/bookmarks/{bid}", params={"device_id": device_id}, timeout=15)
    assert r.status_code == 200
    assert r.json().get("deleted") == 1

    # Confirm gone
    r = requests.get(f"{API}/bookmarks", params={"device_id": device_id}, timeout=15)
    assert not any(b["id"] == bid for b in r.json())


# ---------- Rituals done ----------
def test_ritual_done_flow(device_id):
    today_str = date.today().isoformat()
    payload = {"ritual_id": "wake-up", "device_id": device_id, "date_str": today_str}
    r = requests.post(f"{API}/rituals/done", json=payload, timeout=15)
    assert r.status_code == 200
    assert r.json().get("ok") is True

    r = requests.get(f"{API}/rituals/done", params={"device_id": device_id, "date_str": today_str}, timeout=15)
    assert r.status_code == 200
    lst = r.json()
    assert "wake-up" in lst

    # Idempotency: post again shouldn't cause duplicates
    r2 = requests.post(f"{API}/rituals/done", json=payload, timeout=15)
    assert r2.status_code == 200
    r = requests.get(f"{API}/rituals/done", params={"device_id": device_id, "date_str": today_str}, timeout=15)
    assert lst.count("wake-up") == 1

    # Delete
    r = requests.delete(f"{API}/rituals/done", params={"ritual_id": "wake-up", "device_id": device_id, "date_str": today_str}, timeout=15)
    assert r.status_code == 200
    assert r.json().get("deleted") == 1

    r = requests.get(f"{API}/rituals/done", params={"device_id": device_id, "date_str": today_str}, timeout=15)
    assert "wake-up" not in r.json()
