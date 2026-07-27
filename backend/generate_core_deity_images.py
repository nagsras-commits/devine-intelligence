"""Generate stunning modern deity images for the 12 CORE deities.
Uses cinematic/hyper-realistic style — resembles temple murti photos rather than paintings.
"""
import asyncio, base64, os, sys
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "static" / "deities"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

STYLE = (
    "Ultra-high-resolution devotional portrait, hyper-realistic 8K photography-style temple murti, "
    "opulent gold and jewel-encrusted ornaments, silk-brocade garments in rich vermillion / peacock-blue / royal-purple, "
    "cinematic dramatic lighting with golden halo (prabhavali), sacred iconography accurate to Sanatana Dharma shastra, "
    "shot from a slightly low reverent angle, warm temple sanctum background with brass oil lamps softly out of focus, "
    "flowers marigold and rose garlands, exquisite ornate crown and jewellery, radiant divine aura, "
    "portrait aspect ratio, museum-quality, no text no watermarks."
)

DEITIES = {
    "ganesha": "Lord Ganesha with elephant head and human body, four arms holding modak, axe, lotus, and blessing mudra, plump joyful form, mouse (mooshika) vahana at feet, red silk dhoti with gold border, sacred thread across chest, big generous smile.",
    "shiva": "Lord Shiva as Nataraja / cosmic dancer in ananda tandava pose OR seated on Kailash tiger skin — matted jata locks with crescent moon and river Ganga cascading from head, third eye on forehead, blue throat (Nilakantha), snake garland around neck, trishula and damaru, rudraksha malas.",
    "vishnu": "Lord Vishnu the preserver, dark-blue complexion, four arms holding conch (Shankha), discus (Sudarshana Chakra), mace (Gada), lotus (Padma), reclining on Adisesha the cosmic serpent OR standing tall, yellow-gold silk dhoti, tulsi mala, Kaustubha jewel, kind serene expression.",
    "krishna": "Lord Krishna as young cowherd prince, dark-blue lustrous complexion, peacock feather crown, playing bansuri flute, yellow-gold silk pitambar, garland of vaijayanti flowers and tulsi, sweet smile, standing in tribhanga pose, cows in soft-focus vrindavan background.",
    "rama": "Lord Rama the Maryada Purushottama, blue-hued royal form standing with bow (Kodanda) and quiver of arrows, calm and majestic face, princely golden crown, silk dhoti in royal-yellow, kaustubha-adorned chest, subtle Ayodhya palace background.",
    "hanuman": "Lord Hanuman the mighty devotee, muscular saffron-orange complexion, powerful monkey warrior form kneeling before Sri Rama with folded hands, opening his chest to reveal Rama-Sita inside his heart, gada mace, saffron dhoti, mountain lifting scene in background.",
    "lakshmi": "Goddess Mahalakshmi, four-armed golden-hued Devi seated on a fully-bloomed pink lotus, two hands showering gold coins (dhana-varsha), other two holding lotuses, elephants pouring water on her from above (Gajalakshmi), crimson-red silk saree with gold zari, ruby-emerald ornate crown, kind smile.",
    "saraswati": "Goddess Saraswati, fair-complexioned Devi in white silk saree, seated on a white lotus, playing veena, holding book of Vedas and rudraksha mala in other hands, white swan (hamsa) beside her, radiant halo, aura of pure knowledge.",
    "durga": "Goddess Durga the warrior mother, eight-to-ten armed radiant Devi on a lion / tiger, holding trident, sword, discus, conch, bow, arrow, mace, damaru, and gesture of protection, defeating Mahishasura the buffalo demon, red-crimson silk saree with gold, crown of victorious jewels, three eyes.",
    "subrahmanya": "Lord Subrahmanya / Muruga / Karthikeya, youthful handsome six-headed Shanmukha OR single-headed spear-wielding form, riding peacock (mayil) vahana, holding vel (spear) in right hand, other hand in blessing mudra, gold ornaments, saffron-orange silk, sacred snake around waist.",
    "surya": "Lord Surya the Sun God, golden-hued radiant deva seated on chariot drawn by seven horses driven by Aruna, four arms holding two lotuses and mudras of blessing, seven-flame halo behind head, red silk garment with gold border, gems flashing, sunrise sky.",
    "ayyappa": "Lord Ayyappa / Manikanta / Hariharaputra of Sabarimala, youthful seated dhyana-mudra yogic form on a mountain top, one leg bent under the other tied by a yoga-band (yogapatta), saffron dhoti and shoulder cloth, tulsi mala around neck, bow beside him, third eye subtly on forehead, calm compassionate face.",
}


async def generate(deity_id: str, prompt_text: str, max_retries: int = 3) -> bool:
    out_path = OUT / f"{deity_id}.png"
    if out_path.exists() and out_path.stat().st_size > 5000 and os.getenv("FORCE") != "1":
        print(f"  SKIP {deity_id}")
        return True
    full = f"{prompt_text}\n\nStyle: {STYLE}"
    for attempt in range(1, max_retries + 1):
        try:
            chat = LlmChat(api_key=API_KEY, session_id=f"core-{deity_id}-{attempt}",
                           system_message="You are a devotional Hindu iconography artist.")
            chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
            _t, images = await chat.send_message_multimodal_response(UserMessage(text=full))
            if not images:
                print(f"  FAIL {deity_id} attempt {attempt}: no image")
                await asyncio.sleep(3); continue
            data = base64.b64decode(images[0]["data"])
            out_path.write_bytes(data)
            print(f"  OK   {deity_id} ({len(data)} bytes) attempt={attempt}")
            return True
        except Exception as e:
            print(f"  ERR  {deity_id} attempt {attempt}: {e}")
            await asyncio.sleep(4)
    return False

async def main():
    if not API_KEY:
        print("EMERGENT_LLM_KEY not found"); sys.exit(1)
    only = sys.argv[1] if len(sys.argv) > 1 else None
    items = {only: DEITIES[only]} if only and only in DEITIES else DEITIES
    print(f"Generating {len(items)} CORE deity images -> {OUT}\n")
    ok = 0
    for i, (d, p) in enumerate(items.items(), 1):
        print(f"[{i}/{len(items)}] {d}")
        if await generate(d, p): ok += 1
        await asyncio.sleep(1)
    print(f"\nDone. {ok}/{len(items)} succeeded.")

if __name__ == "__main__":
    asyncio.run(main())
