"""Generate stunning cinematic hero banners for each page of the Devine Intelligence app."""
import asyncio, base64, os, sys
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "static" / "banners"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.getenv("EMERGENT_LLM_KEY")

# Common style — cinematic wide banner, temple-devotional aesthetic
STYLE = (
    "Ultra-wide cinematic banner (16:5 aspect ratio), hyper-realistic 8K devotional photograph, "
    "warm golden-hour lighting with sun rays / diya glow, rich royal gold saffron kumkum cream tones, "
    "painterly-photorealistic quality, subtle bokeh, no text no watermarks, panoramic composition, "
    "suitable as a webpage hero background."
)

# One banner per page/section
BANNERS = {
    "home": "Sunrise over a majestic South Indian temple complex — golden dome (vimana), rows of oil-lamp diyas glowing at dawn, marigold garlands, distant mountain silhouette wrapped in mist, sacred Om symbol subtly formed by clouds, sense of awakening and divine welcome.",
    "dinacharya": "A serene devotee performing Sandhya-vandanam at riverbank during Brahma-muhurta pre-dawn — golden sun rising over the Ganga, mist rising from the water, brass water pot (kamandalu), tulsi plant nearby, subtle silhouette of a temple in distance, atmosphere of peace and beginning of day.",
    "nitya_pooja": "A traditional Hindu home pooja mantap (altar) — brass idols of gods bathed in golden diya light, incense smoke curling upward, marigold flowers, sandalwood paste, kumkum on a silver plate, coconuts and betel leaves arranged for daily worship, cinematic warm glow.",
    "tulasi_pooja": "A courtyard tulsi vrindavan (sacred basil pot altar) at dawn, verdant tulsi plant glowing in golden sunlight, freshly lit diyas around it, red-and-gold silk cloth draped, kolam rangoli on the ground, marigold garland, kartika-masa festive atmosphere.",
    "japa": "A pair of hands holding a rudraksha mala performing japa, saffron-orange robe sleeves visible, background of a temple sanctum with warm brass lamps softly out of focus, floating Om syllable glowing in golden mist, meditative and mystical.",
    "rama_koti": "An open handwritten notebook filled with 'राम राम राम' calligraphy in beautiful devanagari script, golden ink glowing, a peacock quill pen resting on it, tulsi leaves nearby, saffron cloth background, diya softly glowing, atmosphere of devotion and sacred writing.",
    "deities": "A grand panorama of an ornate South Indian temple sanctum interior — multiple deity sculptures softly lit by brass diyas along a corridor of intricately carved stone pillars, marigold garlands hanging from above, golden aura, sense of divine majesty.",
    "panchangam": "An ancient palm-leaf almanac (panchangam) opened, showing Sanskrit tithi-nakshatra notations, brass sun-moon calendrical instruments (jantar-mantar style), astronomical star chart glowing above, background of a temple observatory at dusk with cosmos hint, golden atmosphere.",
    "festivals": "A joyous Hindu festival scene — a temple procession with a garlanded deity chariot, fireworks and marigold flowers being showered, devotees in colourful traditional attire, oil lamps lighting the night sky, splash of vibrant reds and yellows and golds, celebratory and cinematic.",
}


async def generate(banner_id: str, prompt_text: str, max_retries: int = 3) -> bool:
    out_path = OUT / f"{banner_id}.png"
    if out_path.exists() and out_path.stat().st_size > 5000 and os.getenv("FORCE") != "1":
        print(f"  SKIP {banner_id}")
        return True
    full = f"{prompt_text}\n\nStyle: {STYLE}"
    for attempt in range(1, max_retries + 1):
        try:
            chat = LlmChat(api_key=API_KEY, session_id=f"banner-{banner_id}-{attempt}",
                           system_message="You are a cinematic devotional photography artist.")
            chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
            _t, images = await chat.send_message_multimodal_response(UserMessage(text=full))
            if not images:
                print(f"  FAIL {banner_id} attempt {attempt}"); await asyncio.sleep(3); continue
            data = base64.b64decode(images[0]["data"])
            out_path.write_bytes(data)
            print(f"  OK   {banner_id} ({len(data)} bytes) attempt={attempt}")
            return True
        except Exception as e:
            print(f"  ERR  {banner_id}: {e}")
            await asyncio.sleep(4)
    return False

async def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    items = {only: BANNERS[only]} if only and only in BANNERS else BANNERS
    print(f"Generating {len(items)} page banners -> {OUT}\n")
    ok = 0
    for i, (b, p) in enumerate(items.items(), 1):
        print(f"[{i}/{len(items)}] {b}")
        if await generate(b, p): ok += 1
        await asyncio.sleep(1)
    print(f"\nDone. {ok}/{len(items)}")

if __name__ == "__main__":
    asyncio.run(main())
