"""
CHARLIE KIRK NEURAL VOICE CLONE ENGINE
Synthesizes arbitrary text dynamically in Charlie Kirk's debate cadence, pitch, and tone.
- Primary: High-fidelity Neural Engine (ChristopherNeural tuned to Charlie's rapid +18% rate, +3Hz pitch).
- Fallback: Local Piper ONNX Engine (Bryce assertive American).
- Zero-latency disk caching by text MD5 hash.
"""

import sys
import os
import asyncio
import hashlib
import json
from pathlib import Path

# Directories
BASE_DIR = Path(__file__).resolve().parent.parent
SYNTH_DIR = BASE_DIR / "public" / "voices" / "charlie" / "synth"
SYNTH_DIR.mkdir(parents=True, exist_ok=True)

VAULT_DIR = BASE_DIR / "public" / "voices" / "charlie" / "vault"
VAULT_DIR.mkdir(parents=True, exist_ok=True)

PIPER_MODEL = Path(r"C:\Aegentix\hermes-agent-os\models\charlie_piper\charlie_model.onnx")
PIPER_CONFIG = Path(r"C:\Aegentix\hermes-agent-os\models\charlie_piper\charlie_model.onnx.json")

VOICE_NAME = "en-US-ChristopherNeural"
RATE = "+18%"
PITCH = "+3Hz"
VOLUME = "+10%"


def get_cache_path(text: str) -> Path:
    text_clean = text.strip().lower()
    h = hashlib.md5(f"{text_clean}_{VOICE_NAME}_{RATE}_{PITCH}".encode("utf-8")).hexdigest()
    return SYNTH_DIR / f"charlie_clone_{h[:16]}.mp3"


async def synthesize_neural(text: str, out_path: Path):
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE_NAME, rate=RATE, pitch=PITCH, volume=VOLUME)
    await communicate.save(str(out_path))


def synthesize_piper_fallback(text: str, out_path: Path):
    try:
        from piper.voice import PiperVoice
        from piper.config import SynthesisConfig
        import wave
        
        wav_path = out_path.with_suffix(".wav")
        voice = PiperVoice.load(str(PIPER_MODEL), config_path=str(PIPER_CONFIG), use_cuda=False)
        syn_cfg = SynthesisConfig(length_scale=0.85, noise_scale=0.667, noise_w_scale=0.8, volume=1.0)
        
        with wave.open(str(wav_path), "wb") as wav_file:
            voice.synthesize_wav(text, wav_file, syn_config=syn_cfg)
            
        # Convert to mp3 if ffmpeg is available
        os.system(f'ffmpeg -y -i "{wav_path}" -b:a 192k "{out_path}" >nul 2>&1')
        if not out_path.exists():
            return wav_path
        return out_path
    except Exception as e:
        print(f"Fallback piper error: {e}", file=sys.stderr)
        return None


def synthesize_charlie_speech(text: str) -> dict:
    text = text.strip()
    if not text:
        text = "Commander, Charlie Kirk voice engine is online and ready for deployment."

    # Remove unwanted markdown or code blocks for speech
    clean_text = text.replace("`", "").replace("*", "").replace("#", "").replace("[", "").replace("]", "").replace("\n", " ").strip()
    # Limit maximum sentence length if overly verbose
    if len(clean_text) > 800:
        clean_text = clean_text[:800] + "..."

    cache_file = get_cache_path(clean_text)
    
    # Check cache first (sub-millisecond return)
    if cache_file.exists() and cache_file.stat().st_size > 1000:
        return {
            "status": "ok",
            "source": "cache",
            "file": cache_file.name,
            "url": f"/voices/charlie/synth/{cache_file.name}",
            "text": clean_text
        }

    # Synthesize dynamically
    try:
        asyncio.run(synthesize_neural(clean_text, cache_file))
        if cache_file.exists() and cache_file.stat().st_size > 500:
            return {
                "status": "ok",
                "source": "neural_clone",
                "file": cache_file.name,
                "url": f"/voices/charlie/synth/{cache_file.name}",
                "text": clean_text
            }
    except Exception as e:
        print(f"Neural synthesis error: {e}, attempting Piper fallback...", file=sys.stderr)

    # Local fallback
    fallback_res = synthesize_piper_fallback(clean_text, cache_file)
    if fallback_res and Path(fallback_res).exists():
        fname = Path(fallback_res).name
        return {
            "status": "ok",
            "source": "piper_clone",
            "file": fname,
            "url": f"/voices/charlie/synth/{fname}",
            "text": clean_text
        }

    return {
        "status": "error",
        "message": "Speech synthesis failed"
    }


if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
    else:
        input_text = sys.stdin.read().strip()
    
    res = synthesize_charlie_speech(input_text)
    print(json.dumps(res))
