"""Backup script — exports the deity_names MongoDB collection to a versioned JSON file.

Run: cd /app/backend && python backup_deity_names.py
Output: /app/backend/backups/deity_names_YYYYMMDD_HHMMSS.json

Also creates deity_names_latest.json for easy diffing.
Re-import: python backup_deity_names.py --restore <file>
"""
import asyncio
import json
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "backups"
OUT.mkdir(parents=True, exist_ok=True)


async def export_all():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]
    docs = []
    async for d in db.deity_names.find({}, {"_id": 0}):
        docs.append(d)
    client.close()

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    ts_path = OUT / f"deity_names_{stamp}.json"
    latest_path = OUT / "deity_names_latest.json"
    payload = {
        "exported_at": datetime.now().isoformat(),
        "count": len(docs),
        "deities": docs,
    }
    ts_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    latest_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    size_kb = ts_path.stat().st_size / 1024
    total_a = sum(len(d.get("ashtottara") or []) for d in docs)
    total_s = sum(len(d.get("sahasranama") or []) for d in docs)
    print(f"Exported {len(docs)} deity(s) — {total_a} ashtottara + {total_s} sahasranama names")
    print(f"  {ts_path} ({size_kb:.1f} KB)")
    print(f"  {latest_path}")


async def restore(path: str):
    p = Path(path)
    if not p.exists():
        print(f"File not found: {p}"); sys.exit(1)
    data = json.loads(p.read_text())
    docs = data.get("deities", data if isinstance(data, list) else [])
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]
    inserted = 0
    for d in docs:
        did = d.get("deity_id")
        if not did: continue
        await db.deity_names.update_one({"deity_id": did}, {"$set": d}, upsert=True)
        inserted += 1
    client.close()
    print(f"Restored {inserted} deity(s) from {p}")


async def main():
    if len(sys.argv) > 2 and sys.argv[1] == "--restore":
        await restore(sys.argv[2])
    else:
        await export_all()


if __name__ == "__main__":
    asyncio.run(main())
