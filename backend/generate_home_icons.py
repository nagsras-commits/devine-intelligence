"""Generate beautiful devotional icon images for Home page tiles."""
import asyncio, base64, os, sys
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "static" / "icons"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.getenv("EMERGENT_LLM_KEY")

STYLE = (
    "Square 1:1 aspect ratio icon-thumbnail, cinematic photorealistic devotional Hindu art, "
    "warm golden temple lighting, rich saffron / kumkum / gold / cream palette, "
    "centered subject filling most of the frame with a soft glowing halo, "
    "shallow depth of field bokeh, no text, no watermarks, no borders."
)

ICONS = {
    "home": "A brass Om (ॐ) symbol on a bed of marigold petals with a lit brass diya beside it, warm dawn glow, sacred welcoming atmosphere.",
    "dinacharya": "A serene brass sun-rising icon at Brahma-muhurta — soft sunrise, a small brass kamandalu water pot, tulsi leaves, sacred beginning-of-day symbol.",
    "nitya_pooja": "A traditional Hindu pooja thali (plate) with lit camphor flame, marigold petals, kumkum, turmeric, coconut and betel leaves arranged on brass plate, top-down view.",
    "tulasi_pooja": "A verdant Tulasi (holy basil) plant in a traditional decorated Vrindavan pot with kolam patterns, small diyas at base, morning light.",
    "japa": "A hand holding a rudraksha japa mala with fingers counting a bead, saffron robe sleeve visible, brass diya softly out of focus behind, meditative.",
    "rama_koti": "An open notebook page filled with sacred 'राम राम राम' calligraphy in golden ink, quill pen resting on it, tulasi leaves nearby, sacred writing.",
    "deities": "A close-up of an ornate brass murti (deity idol) with intricate detailing, surrounded by marigold garlands and flickering brass diya lamps.",
    "panchangam": "An old palm-leaf almanac with Sanskrit calligraphy on parchment, brass astronomical instruments (small sundial), subtle star chart glow behind.",
    "festivals": "Colourful festival scene — clay diyas arranged in a rangoli pattern, marigold flowers scattered, sparklers, joyous celebratory glow, night atmosphere.",
    "profile": "A pair of folded hands (namaste mudra) with kumkum tilak visible, saffron shawl around shoulders, golden aura behind, devotional welcoming gesture.",
}


async def gen(key, prompt):
    out = OUT / f"{key}.png"
    if out.exists() and out.stat().st_size > 5000 and os.getenv("FORCE") != "1":
        print(f"  SKIP {key}"); return True
    full = f"{prompt}\n\nStyle: {STYLE}"
    for a in range(1, 4):
        try:
            chat = LlmChat(api_key=API_KEY, session_id=f"icon-{key}-{a}",
                           system_message="Create devotional icon images.")
            chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image","text"])
            _t, imgs = await chat.send_message_multimodal_response(UserMessage(text=full))
            if not imgs: await asyncio.sleep(3); continue
            data = base64.b64decode(imgs[0]["data"])
            out.write_bytes(data)
            print(f"  OK {key} ({len(data)} bytes)"); return True
        except Exception as e:
            print(f"  ERR {key}: {e}"); await asyncio.sleep(3)
    return False

async def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    items = {only: ICONS[only]} if only and only in ICONS else ICONS
    print(f"Generating {len(items)} icons to {OUT}")
    for i, (k, p) in enumerate(items.items(), 1):
        print(f"[{i}/{len(items)}] {k}")
        await gen(k, p)
        await asyncio.sleep(0.5)
    print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
