"""Iteration 5 — Vrata calendar, Family Sādhanā, Panchangam regression."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://divine-dharma-daily.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# --- Panchangam regression ----------------------------------------------------
class TestPanchangamRegression:
    def test_week_endpoint_returns_7_days_with_required_fields(self):
        r = requests.get(f"{API}/panchangam/week", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) == 7
        req = {"samvatsara", "vikrama_samvat", "ritu", "ayana"}
        for day in data:
            missing = req - set(day.keys())
            assert not missing, f"Missing fields {missing} in day {day.get('date')}"

    def test_60_day_sweep_has_all_15_tithi_numbers(self):
        """Scan 60 days of /panchangam?date_str=... to ensure tithi math covers 1..15."""
        from datetime import date, timedelta
        today = date.today()
        seen = set()
        # Sample every day for 60 days
        for i in range(60):
            d = today + timedelta(days=i)
            r = requests.get(f"{API}/panchangam", params={"date_str": d.isoformat()}, timeout=15)
            assert r.status_code == 200, r.text
            seen.add(r.json().get("tithi_number"))
        missing = set(range(1, 16)) - seen
        assert not missing, f"Tithi numbers never seen in 60-day sweep: {missing}"


# --- Vrata upcoming -----------------------------------------------------------
class TestVrataUpcoming:
    def test_default_60_days(self):
        r = requests.get(f"{API}/vrata/upcoming", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["days_scanned"] == 60
        assert data["count"] >= 10, f"Expected >=10 vratas in 60 days, got {data['count']}"
        for v in data["vratas"]:
            for k in ("date", "vara", "tithi", "paksha", "day_offset", "vrata", "sanskrit", "deity", "vidhi", "prasad", "significance"):
                assert k in v, f"Field {k} missing from vrata entry"

    def test_all_5_vrata_types_in_45_days(self):
        r = requests.get(f"{API}/vrata/upcoming", params={"days": 45}, timeout=20)
        assert r.status_code == 200
        names = {v["vrata"] for v in r.json()["vratas"]}
        required = {"Ekādaśī", "Pradoṣam", "Pūrṇimā", "Amāvāsyā", "Sankaṣṭī Chaturthī"}
        missing = required - names
        assert not missing, f"Missing vratas in 45 days: {missing}; got {names}"

    def test_cap_at_180_days(self):
        r = requests.get(f"{API}/vrata/upcoming", params={"days": 500}, timeout=30)
        assert r.status_code == 200
        assert r.json()["days_scanned"] == 180


# --- Family / Household -------------------------------------------------------
class TestHouseholdAuth:
    def test_create_requires_auth(self):
        r = requests.post(f"{API}/household/create", json={"name": "Test Family"}, timeout=15)
        assert r.status_code == 401

    def test_join_requires_auth(self):
        r = requests.post(f"{API}/household/join", params={"code": "ABCDEF"}, timeout=15)
        assert r.status_code == 401

    def test_mine_requires_auth(self):
        r = requests.get(f"{API}/household/mine", timeout=15)
        assert r.status_code == 401

    def test_contribute_requires_auth(self):
        r = requests.post(f"{API}/household/contribute", json={"deity_id": "shiva", "japa": 108, "likhita": 0}, timeout=15)
        assert r.status_code == 401

    def test_leave_requires_auth(self):
        r = requests.post(f"{API}/household/leave", timeout=15)
        assert r.status_code == 401


# --- Household full flow with mocked session ---------------------------------
class TestHouseholdFlow:
    """Create a session by injecting a user+session directly into Mongo."""

    @pytest.fixture(scope="class")
    def session(self):
        import pymongo
        import uuid
        from datetime import datetime, timezone, timedelta
        mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        db_name = os.environ.get("DB_NAME", "test_database")
        cli = pymongo.MongoClient(mongo_url)
        db = cli[db_name]

        user_id = f"user_test_{uuid.uuid4().hex[:8]}"
        token = f"tok_test_{uuid.uuid4().hex}"
        db.users.insert_one({
            "user_id": user_id, "email": f"TEST_{user_id}@example.com",
            "name": "TEST User", "picture": "", "created_at": datetime.now(timezone.utc),
        })
        db.user_sessions.insert_one({
            "user_id": user_id, "session_token": token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=1),
            "created_at": datetime.now(timezone.utc),
        })

        s = requests.Session()
        s.cookies.set("session_token", token)

        yield s, user_id, db

        # cleanup
        db.households.delete_many({"owner_id": user_id})
        db.household_contributions.delete_many({"user_id": user_id})
        db.user_sessions.delete_many({"user_id": user_id})
        db.users.delete_many({"user_id": user_id})

    def test_full_flow(self, session):
        s, user_id, db = session

        # Hit /auth/me to confirm session is recognised by backend
        r = s.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 200, f"Session not recognised: {r.status_code} {r.text}"

        # Create
        r = s.post(f"{API}/household/create", json={"name": "TEST Fam"}, timeout=15)
        assert r.status_code == 200, r.text
        hh = r.json()
        assert len(hh["code"]) == 6 and hh["code"].isupper()
        assert hh["owner_id"] == user_id
        assert any(m["user_id"] == user_id for m in hh["members"])
        assert hh["japa_counts"] == {} and hh["likhita_counts"] == {}
        code = hh["code"]

        # Join wrong code
        r = s.post(f"{API}/household/join", params={"code": "ZZZZZZ"}, timeout=15)
        assert r.status_code == 404

        # Join correct (idempotent — already a member)
        r = s.post(f"{API}/household/join", params={"code": code}, timeout=15)
        assert r.status_code == 200
        assert any(m["user_id"] == user_id for m in r.json()["members"])

        # Mine
        r = s.get(f"{API}/household/mine", timeout=15)
        assert r.status_code == 200
        assert any(h["code"] == code for h in r.json())

        # Contribute
        r = s.post(f"{API}/household/contribute", json={"deity_id": "shiva", "japa": 108, "likhita": 0}, timeout=15)
        assert r.status_code == 200
        assert r.json()["japa_counts"]["shiva"] == 108

        # Leave
        r = s.post(f"{API}/household/leave", timeout=15)
        assert r.status_code == 200

        r = s.get(f"{API}/household/mine", timeout=15)
        assert r.status_code == 200
        assert not any(h["code"] == code for h in r.json())
