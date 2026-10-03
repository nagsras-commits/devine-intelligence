import base64
from datetime import datetime, timezone

import brahma_alarm
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from py_vapid import Vapid


def test_next_alarm_uses_timezone_and_next_local_day(monkeypatch):
    monkeypatch.setattr(
        brahma_alarm,
        "compute_sunrise_sunset",
        lambda day, lat, lng, offset: ("06:00", "18:00"),
    )
    now = datetime(2026, 10, 2, 16, 0, tzinfo=timezone.utc)

    alarm_date, alarm_at = brahma_alarm.compute_next_brahma_alarm(
        17.385,
        78.4867,
        "Asia/Kolkata",
        5.5,
        now,
    )

    assert alarm_date.isoformat() == "2026-10-03"
    assert alarm_at == datetime(2026, 10, 2, 22, 54, tzinfo=timezone.utc)


def test_next_alarm_uses_dst_offset_for_target_date(monkeypatch):
    monkeypatch.setattr(
        brahma_alarm,
        "compute_sunrise_sunset",
        lambda day, lat, lng, offset: ("06:00", "18:00"),
    )
    now = datetime(2026, 3, 28, 12, 0, tzinfo=timezone.utc)

    alarm_date, alarm_at = brahma_alarm.compute_next_brahma_alarm(
        51.5074,
        -0.1278,
        "Europe/London",
        0,
        now,
    )

    assert alarm_date.isoformat() == "2026-03-29"
    assert alarm_at == datetime(2026, 3, 29, 3, 24, tzinfo=timezone.utc)


def test_vapid_configuration_requires_matching_keys(monkeypatch):
    vapid = Vapid()
    vapid.generate_keys()
    private_key = base64.urlsafe_b64encode(
        vapid.private_key.private_numbers().private_value.to_bytes(32, "big")
    ).rstrip(b"=").decode("ascii")
    public_key = base64.urlsafe_b64encode(
        vapid.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
    ).rstrip(b"=").decode("ascii")
    monkeypatch.setenv("VAPID_PRIVATE_KEY", private_key)
    monkeypatch.setenv("VAPID_PUBLIC_KEY", public_key)

    assert brahma_alarm.vapid_configuration()["public_key"] == public_key

    monkeypatch.setenv("VAPID_PUBLIC_KEY", "not-the-matching-key")
    assert brahma_alarm.vapid_configuration() is None