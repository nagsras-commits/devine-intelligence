"""
One-time script to generate high-quality traditional Hindu deity portrait images
using Gemini 3.1 Flash Image (Nano Banana) via Emergent LLM key.

Run: cd /app/backend && python generate_deity_images.py

Images are saved to /app/backend/static/deities/{deity_id}.png and served via FastAPI
at /api/static/deities/{deity_id}.png.
"""
import asyncio
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

OUT = ROOT / "static" / "deities"
OUT.mkdir(parents=True, exist_ok=True)

API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

# Style prompt applied to every deity for consistency
STYLE = (
    "Traditional Raja Ravi Varma oleograph style, richly detailed Indian devotional portrait, "
    "warm golden temple lighting, ornate jewellery, silk garments, halo of divine light, "
    "sacred iconography accurate to Hindu shastra, centered composition, portrait aspect ratio, "
    "highly detailed, museum-quality painting, no text, no watermarks."
)

# Deity-specific prompts (only the ones missing quality images)
DEITIES = {
    "venkateswara": "Lord Sri Venkateswara Balaji of Tirumala standing majestically, dark blue-black complexion, four arms holding conch, discus, gesture of refuge and boon, golden crown, white tilak Namam on forehead with red streak, decked with pearl and gold ornaments, garland of tulsi leaves.",
    "padmavathi": "Goddess Padmavathi Devi consort of Sri Venkateswara, seated on a pink lotus, four-armed holding lotuses, saffron-red silk saree with gold zari, crown with rubies, kind smile, aura of pink golden light.",
    "narasimha": "Lord Narasimha, half-man half-lion incarnation of Vishnu, fierce yet compassionate face with mane, seated in yogic posture with Prahlada by his side, four arms with conch and discus, golden aura, temple background.",
    "varaha": "Lord Varaha, boar-headed incarnation of Vishnu lifting the goddess Bhudevi (Earth) on his tusks from cosmic waters, blue-hued muscular body, four arms with divine weapons, ocean below, sunrise sky.",
    "varahi": "Goddess Varahi, boar-faced fierce mother goddess (Saptamatrika), seated on buffalo mount, four-armed with plough, pestle, and mudras, red silk, gold crown, night sky with stars.",
    "dattatreya": "Lord Dattatreya, three-headed divine sage combining Brahma-Vishnu-Shiva, six arms holding trident, damaru, kamandalu, mala, discus, conch, matted locks, saffron robes, accompanied by four dogs (Vedas) and cow, ashram forest background.",
    "lalitha": "Goddess Lalitha Tripura Sundari, vermillion-hued Divine Mother seated on Sri Chakra throne, four arms holding sugarcane bow, five flower arrows, noose, and goad, crimson silk, immense crown of rubies, three eyes, gentle smile, aura of red-gold.",
    "kali": "Goddess Kali, dark-blue fierce mother goddess with four arms holding severed head and sword, garland of skulls, standing on Shiva, red tongue extended, moon on forehead, cremation ground background, aura of blue fire.",
    "gayatri": "Goddess Gayatri Devi, five-headed Vedic goddess (pearl-white, coral-red, gold, sapphire-blue, and white faces), ten arms holding conch, discus, lotus, mace, book, mala, sacred water pot, seated on white lotus with a swan, radiant sunrise aura.",
    "kubera": "Lord Kubera, king of yakshas and treasure lord, plump friendly form seated on lotus, one hand holding mace, other holding pot overflowing with gold coins, golden ornaments, saffron-red robes, treasure chests around.",
    "chamundeshwari": "Goddess Chamundeshwari of Mysore, eight-armed fierce Devi seated on a lion, holding trident, sword, chakra, conch, bow, arrow, damaru, and severed demon head, red-gold silk, crown of jewels, aura of victory.",
    "mahalakshmi_kolhapur": "Goddess Mahalakshmi of Kolhapur (Ambabai), four-armed standing figure holding matulinga fruit, mace, shield, and paatra bowl, red-gold silk saree, ornate crown, sacred temple sanctum background with oil lamps.",
    "annapurna": "Goddess Annapurna, giver of food, seated on a golden throne holding a ladle and bowl of divine food (annam), red silk saree, gold jewelry, gentle motherly smile, Lord Shiva as a mendicant receiving food in the corner.",
    "ganga": "Goddess Ganga descending from heaven on Lord Shiva's matted locks, fair-skinned four-armed Devi on a crocodile (makara), holding a lotus and water pot, white-silver silk flowing like river, Himalayan mountains background.",
    "bhairava": "Lord Kala Bhairava, fierce guardian form of Shiva, dark complexion, four arms holding trident, damaru, sword and skull-cup, garland of skulls, dog vahana at his feet, wild matted hair, third eye blazing.",
    "dhanvantari": "Lord Dhanvantari, divine physician of the gods, four-armed emerald-green complexion, holding conch, discus, medicinal herb, and pot of amrita (nectar of immortality), yellow silk, aura of healing light.",
    "santoshi": "Goddess Santoshi Ma, giver of contentment, seated on a lotus, four-armed holding sword, trident, bowl of jaggery and roasted chickpea, benevolent smiling face, red saree with gold border, aura of soft pink light.",
    "navagraha": "Navagraha — the nine planetary deities arranged in a mandala: Surya on chariot, Chandra on deer, Mangala on ram, Budha on lion, Guru on elephant, Shukra on horse, Shani on crow, Rahu with serpent, Ketu with dragon tail, cosmic starry background.",
    "vishwakarma": "Lord Vishwakarma the divine architect of the universe, majestic four-armed elderly deity with white beard, holding measuring rod, water pot, book of shastras, and axe, seated on a lotus throne, tools of craftsmanship around him, golden aura.",
    "veerabrahmendra": "Sri Potuluri Veerabrahmendra Swamy of Kandimallayapalle, a revered Andhra Telugu saint and Kalajnana prophet, seated in padmasana meditation posture with palm leaf manuscript, saffron robe, rudraksha mala, long white beard, serene face, aura of divine wisdom, temple background.",
    "parvathi": "Goddess Parvathi, gracious consort of Lord Shiva, fair-golden complexion, seated on a lotus in Kailasa, four arms holding trident, lotus, boon-mudra, protection-mudra, red-and-gold silk saree, ornate jewellery, kind gentle smile, aura of divine motherhood, Nandi in background.",
    "raghavendra": "Sri Guru Raghavendra Swamy of Mantralayam, revered Madhwa saint, seated in padmasana meditation, saffron robe, tridandi staff, japa mala in hand, tilaka namam on forehead, radiant divine aura, Brindavana temple background, palm-leaf granthas around him.",
}


async def generate(deity_id: str, prompt_text: str, max_retries: int = 3) -> bool:
    """Generate one deity image and save it. Returns True on success."""
    out_path = OUT / f"{deity_id}.png"
    if out_path.exists() and out_path.stat().st_size > 5000:
        print(f"  SKIP {deity_id} — already exists ({out_path.stat().st_size} bytes)")
        return True

    full_prompt = f"{prompt_text}\n\nStyle: {STYLE}"

    for attempt in range(1, max_retries + 1):
        try:
            chat = LlmChat(
                api_key=API_KEY,
                session_id=f"deity-{deity_id}-{attempt}",
                system_message="You are a devotional Hindu iconography artist.",
            )
            chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
            msg = UserMessage(text=full_prompt)
            _text, images = await chat.send_message_multimodal_response(msg)
            if not images:
                print(f"  FAIL {deity_id} attempt {attempt}: no image returned")
                await asyncio.sleep(3)
                continue
            img = images[0]
            data = base64.b64decode(img["data"])
            out_path.write_bytes(data)
            print(f"  OK   {deity_id} ({len(data)} bytes) attempt={attempt}")
            return True
        except Exception as e:
            print(f"  ERR  {deity_id} attempt {attempt}: {e}")
            await asyncio.sleep(4)
    return False


async def main():
    if not API_KEY:
        print("EMERGENT_LLM_KEY not found in env")
        sys.exit(1)

    # Allow filtering via CLI arg for one deity at a time
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if only == "list":
        for d in DEITIES:
            p = OUT / f"{d}.png"
            print(f"  {d}: {'✓ ' + str(p.stat().st_size) + ' bytes' if p.exists() else '✗ missing'}")
        return

    items = {only: DEITIES[only]} if only and only in DEITIES else DEITIES
    print(f"Generating {len(items)} deity images to {OUT}\n")

    successes = 0
    for i, (deity_id, prompt) in enumerate(items.items(), 1):
        print(f"[{i}/{len(items)}] {deity_id}")
        ok = await generate(deity_id, prompt)
        if ok:
            successes += 1
        await asyncio.sleep(1)  # small gap between requests

    print(f"\nDone. {successes}/{len(items)} succeeded.")


if __name__ == "__main__":
    asyncio.run(main())
