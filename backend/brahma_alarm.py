"""Timezone-aware Brahma Muhurta scheduling helpers."""
import os
import base64
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from astrology import compute_muhurta_timings, compute_sunrise_sunset


def vapid_configuration():
    public_key = os.environ.get("VAPID_PUBLIC_KEY", "").strip()
    private_key = os.environ.get("VAPID_PRIVATE_KEY", "").strip()
    if not public_key or not private_key:
        return None
    subject = os.environ.get("VAPID_SUBJECT", "mailto:admin@example.com").strip()
    try:
        from py_vapid import Vapid

        vapid = Vapid.from_string(private_key)
        derived_public_key = base64.urlsafe_b64encode(
            vapid.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
        ).rstrip(b"=").decode("ascii")
        if derived_public_key != public_key.rstrip("="):
            return None
    except Exception:
        return None
    return {"public_key": public_key, "private_key": private_key, "subject": subject}


def compute_next_brahma_alarm(lat, lng, time_zone, tz_offset, now=None):
    """Return the next (local date, UTC instant) at Brahma Muhurta start."""
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    now = now.astimezone(timezone.utc)
    try:
        zone = ZoneInfo(time_zone)
    except (ZoneInfoNotFoundError, TypeError):
        zone = timezone(timedelta(hours=float(tz_offset)))

    local_today = now.astimezone(zone).date()
    for day_offset in range(4):
        alarm_date = local_today + timedelta(days=day_offset)
        noon = datetime.combine(alarm_date, time(12), tzinfo=zone)
        offset = noon.utcoffset()
        local_offset = offset.total_seconds() / 3600 if offset else float(tz_offset)
        sunrise, sunset = compute_sunrise_sunset(alarm_date, lat, lng, local_offset)
        brahma = compute_muhurta_timings(sunrise, sunset, alarm_date.weekday())["brahma_muhurta"]
        hour, minute = (int(part) for part in brahma["start"].split(":"))
        local_alarm = datetime.combine(alarm_date, time(hour, minute), tzinfo=zone)
        alarm_at = local_alarm.astimezone(timezone.utc)
        if alarm_at > now:
            return alarm_date, alarm_at
    raise RuntimeError("Could not calculate the next Brahma Muhurta alarm")