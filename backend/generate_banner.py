"""One-time script — generate a catchy banner background image using Gemini Nano Banana."""
import asyncio, base64, os
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "static" / "banners"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.getenv("EMERGENT_LLM_KEY")

PROMPT = (
    "Ultra-wide horizontal banner (aspect ratio 4:1) for a Hindu devotional app called Devine Intelligence. "
    "Ornate cinematic scene: sacred South Indian temple silhouette at golden dawn, glowing diya oil lamps "
    "arranged in patterns, subtle Om symbols and mandala kolam patterns woven into the background, "
    "flowing marigold garlands, mystical golden mist with warm sunlight rays, subtle Sanskrit script embossed faintly, "
    "rich royal gold, saffron, deep kumkum-red and sandalwood cream tones, painterly-photorealistic quality, "
    "no text, no watermarks, panoramic composition suitable as a website header banner."
)

async def main():
    chat = LlmChat(api_key=API_KEY, session_id="header-banner-v1",
                   system_message="You are a devotional Hindu iconography artist.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    _, images = await chat.send_message_multimodal_response(UserMessage(text=PROMPT))
    if images:
        data = base64.b64decode(images[0]["data"])
        p = OUT / "header.png"
        p.write_bytes(data)
        print(f"OK — {p} ({len(data)} bytes)")
    else:
        print("No image returned.")

if __name__ == "__main__":
    asyncio.run(main())
