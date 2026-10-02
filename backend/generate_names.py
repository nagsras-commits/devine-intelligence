"""
Generate authentic 108 Ashtottara + 1008 Sahasranama names for all 34 deities
using Claude Sonnet 4.5 (highest text quality) via Emergent LLM Key.

Each deity gets stored in MongoDB (collection: `deity_names`) with:
  { deity_id, ashtottara: [ {sa, iast, te, meaning}, ... ], sahasranama: [ ... ] }

Run: cd /app/backend && python generate_names.py            # all 34
     python generate_names.py ganesha                        # just one
     python generate_names.py --list                         # show status

Idempotent — re-running skips deities that already have data.
"""
import asyncio
import json
import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("EMERGENT_LLM_KEY")
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

# Full list of 34 deities and their honorific names for the prompt
DEITIES = {
    "ganesha": "Ganesha (Gaṇapati / Vināyaka)",
    "shiva": "Śiva (Mahādeva / Mahāyogī)",
    "vishnu": "Viṣṇu (Nārāyaṇa / Hari)",
    "krishna": "Kṛṣṇa (Vāsudeva / Govinda)",
    "rama": "Rāma (Maryādā Puruṣottama / Rāghava)",
    "hanuman": "Hanumān (Bajaraṅga / Anjaneya)",
    "lakshmi": "Mahālakṣmī",
    "saraswati": "Sarasvatī (Vāgdevī / Śāradā)",
    "durga": "Durgā (Ambikā / Bhavānī)",
    "subrahmanya": "Subrahmaṇya (Muruga / Kārtikeya / Skanda)",
    "surya": "Sūrya (Āditya / Bhāskara)",
    "ayyappa": "Ayyappa (Manikaṇṭha / Dharmaśāstā)",
    "venkateswara": "Veṅkaṭeśvara (Bālājī / Śrīnivāsa)",
    "padmavathi": "Padmāvatī (Alarmelmaṅga)",
    "narasimha": "Narasiṁha",
    "varaha": "Varāha",
    "varahi": "Vārāhī",
    "dattatreya": "Dattātreya",
    "lalitha": "Lalitā Tripura Sundarī (Śrīvidyā)",
    "kali": "Kālī (Kālikā / Mahākālī)",
    "navagraha": "Navagraha (nine planets — collectively; names of each of Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, Ketu)",
    "kubera": "Kubera (Vaiśravaṇa / Dhaneśa)",
    "gayatri": "Gāyatrī (Vedamātā / Sāvitrī)",
    "parvathi": "Pārvatī (Umā / Gaurī)",
    "raghavendra": "Śrī Guru Rāghavendra Svāmi (Rāyaru of Mantrālaya)",
    "annapurna": "Annapūrṇā (Annadā)",
    "chamundeshwari": "Cāmuṇḍeśvarī",
    "mahalakshmi_kolhapur": "Kolhāpura Mahālakṣmī (Ambābāī)",
    "ganga": "Gaṅgā (Bhāgīrathī / Jāhnavī)",
    "bhairava": "Kālabhairava (Baṭuka Bhairava)",
    "dhanvantari": "Dhanvantari (divine physician)",
    "santoshi": "Santoṣī Mā",
    "vishwakarma": "Viśvakarmā (divine architect)",
    "veerabrahmendra": "Śrī Potuluri Vīrabrahmendra Svāmi (Andhra saint / Kalajnana prophet)",
}


def build_prompt(deity_key: str, deity_name: str, kind: str, batch: int = 0, total_batches: int = 1) -> str:
    if kind == "ashtottara":
        return f"""Generate an authentic Aṣṭottara Śatanāmāvali (108 names) for {deity_name}.

Rules:
- Follow authentic Sanskrit shastra / Purāṇic tradition. Use names actually found in classical stotras.
- Return EXACTLY 108 distinct names.
- For each name output four fields: `sa` (Sanskrit Devanāgarī), `iast` (IAST roman), `te` (Telugu script), `meaning` (short English meaning ≤ 90 chars).
- No preface, no closing text — output ONLY valid JSON.

Output JSON shape:
{{ "names": [ {{ "n": 1, "sa": "गणेशाय", "iast": "Gaṇeśāya", "te": "గణేశాయ", "meaning": "To the Lord of the Ganas" }}, ... ] }}

Deity: {deity_name}
"""
    # sahasranama in batches of 168 to fit within max_tokens
    per = 168
    start = batch * per + 1
    end = min(1008, (batch + 1) * per)
    return f"""Generate names {start} through {end} of the traditional Sahasranāmāvali (1008 total) for {deity_name}.

This is batch {batch + 1} of {total_batches}. Continue the canonical sequence — do not repeat names from earlier batches.

Rules:
- Follow authentic Sanskrit shastra tradition (e.g., Vishnu-sahasranāma from Mahābhārata, Lalitā-sahasranāma from Brahmāṇḍa-purāṇa, etc.).
- Return EXACTLY {end - start + 1} distinct names numbered {start} through {end}.
- Fields per name: `sa` (Devanāgarī), `iast` (IAST), `te` (Telugu), `meaning` (short English ≤ 80 chars).
- Output ONLY valid JSON — no commentary.

Output JSON:
{{ "names": [ {{ "n": {start}, "sa": "...", "iast": "...", "te": "...", "meaning": "..." }}, ... ] }}

Deity: {deity_name}
"""


async def generate_names(deity_key: str, deity_name: str, kind: str, max_retries: int = 3) -> List[Dict[str, str]]:
    """Ask Claude to author names — 108 in one shot, 1008 in 6 batches of 168."""
    target = 108 if kind == "ashtottara" else 1008
    batches = 1 if kind == "ashtottara" else 6
    per_batch = target // batches

    all_names: List[Dict[str, str]] = []

    for batch_idx in range(batches):
        got = None
        for attempt in range(1, max_retries + 1):
            try:
                chat = LlmChat(
                    api_key=API_KEY,
                    session_id=f"names-{deity_key}-{kind}-{batch_idx}-{attempt}",
                    system_message="You are an expert Sanskrit shastri and stotra authority. Output authentic, canonical traditional deity names only. Return strictly valid JSON — no commentary.",
                )
                chat.with_model("anthropic", "claude-sonnet-4-5-20250929").with_params(max_tokens=8192)
                reply = await chat.send_message(UserMessage(text=build_prompt(deity_key, deity_name, kind, batch_idx, batches)))

                m = re.search(r"\{[\s\S]*\"names\"[\s\S]*\}", reply)
                if not m:
                    print(f"    no JSON in batch {batch_idx+1} attempt {attempt}")
                    continue

                # Try to recover from mid-array truncation
                text = m.group(0)
                try:
                    data = json.loads(text)
                except json.JSONDecodeError:
                    # Trim to the last complete object then close
                    idx = text.rfind("},")
                    if idx > 0:
                        text_fixed = text[: idx + 1] + "]}"
                        try:
                            data = json.loads(text_fixed)
                            print(f"    recovered partial JSON in batch {batch_idx+1}")
                        except Exception:
                            print(f"    JSON un-recoverable in batch {batch_idx+1} attempt {attempt}")
                            continue
                    else:
                        continue

                names = data.get("names", [])
                if len(names) < int(per_batch * 0.85):
                    print(f"    got {len(names)}/{per_batch} in batch {batch_idx+1} attempt {attempt}")
                    if attempt < max_retries: continue
                got = names
                break
            except Exception as e:
                print(f"    ERR batch {batch_idx+1} attempt {attempt}: {e}")
                await asyncio.sleep(3)

        if got is None:
            print(f"    batch {batch_idx+1} FAILED — stopping this deity")
            break
        for n in got:
            all_names.append({
                "n": n.get("n", len(all_names) + 1),
                "sa": (n.get("sa") or "").strip(),
                "iast": (n.get("iast") or "").strip(),
                "te": (n.get("te") or "").strip(),
                "meaning": (n.get("meaning") or "").strip(),
            })

    # renumber
    for i, n in enumerate(all_names, 1):
        n["n"] = i
    return all_names


async def main():
    if not API_KEY:
        print("EMERGENT_LLM_KEY missing"); sys.exit(1)

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    coll = db["deity_names"]

    if len(sys.argv) > 1 and sys.argv[1] == "--list":
        async for doc in coll.find({}, {"_id": 0, "deity_id": 1, "ashtottara": 1, "sahasranama": 1}):
            a = len(doc.get("ashtottara") or [])
            s = len(doc.get("sahasranama") or [])
            print(f"  {doc['deity_id']}: {a} ashtottara / {s} sahasranama")
        client.close(); return

    only = None
    mode = "both"  # both | ashtottara | sahasranama
    args = sys.argv[1:]
    for a in args:
        if a in ("--ashtottara", "--108"): mode = "ashtottara"
        elif a in ("--sahasranama", "--1008"): mode = "sahasranama"
        elif a in DEITIES: only = a

    items = {only: DEITIES[only]} if only else DEITIES
    print(f"Generating {mode} for {len(items)} deity(s)\n")

    # Popular deities with authentic canonical Sahasranama texts
    POPULAR_1008 = {"ganesha","shiva","vishnu","krishna","rama","lakshmi","saraswati","durga","lalitha","hanuman","subrahmanya","venkateswara"}

    for i, (key, name) in enumerate(items.items(), 1):
        print(f"[{i}/{len(items)}] {key} — {name}")
        existing = await coll.find_one({"deity_id": key}, {"_id": 0}) or {}
        has_a = len(existing.get("ashtottara") or []) >= 95
        has_s = len(existing.get("sahasranama") or []) >= 900

        update = {}
        do_a = mode in ("both", "ashtottara") and not has_a
        do_s = mode in ("both", "sahasranama") and not has_s and key in POPULAR_1008

        if not do_a and not do_s:
            print("  SKIP"); continue

        if do_a:
            print("  generating 108…")
            a = await generate_names(key, name, "ashtottara")
            if a:
                update["ashtottara"] = a
                print(f"  OK ashtottara ({len(a)})")

        if do_s:
            print("  generating 1008…")
            s = await generate_names(key, name, "sahasranama")
            if s:
                update["sahasranama"] = s
                print(f"  OK sahasranama ({len(s)})")

        if update:
            update["deity_name"] = name
            await coll.update_one({"deity_id": key}, {"$set": update}, upsert=True)
            print("  saved to MongoDB")

    print("\nAll done.")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
