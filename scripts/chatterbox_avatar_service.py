"""
Aegentix Megacore - Chatterbox Neural Voice & Multi-Avatar Autonomous Bridge
Coordinates:
  - Optimus Prime (System-Wide Sovereign Commander) -> Chatterbox Turbo + SparkX 2.6-1.7B
  - Charlie Kirk (Prime Opportunities & Spectacular Events) -> Apollo Voice / Chatterbox + Gemini 3.8 Flash
  - Donald J. Trump (High-Conviction Sovereign Negotiator) -> Chatterbox Neural + Gemini 3 Flash
"""

import os
import sys
import json
import time
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Setup output directory for synthesized wavs
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'voices', 'synth')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Voice profiles and acoustic parameters
PERSONAS = {
    'OPTIMUS_PRIME': {
        'id': 'OPTIMUS_PRIME',
        'name': 'Optimus Prime',
        'title': 'Sovereign Core Commander & Autobot Swarm Leader',
        'callsign': 'PRIME-01',
        'assigned_llm': 'SparkX 2.6-1.7B (Local Edge) + Gemini 3.8 Flash',
        'voice_engine': 'Chatterbox-Turbo (Deep Resonator)',
        'task': 'System-wide defense, invariant boundary enforcement, swarm rollout, and autonomous node protection',
        'exaggeration': 0.7,
        'temperature': 0.65,
        'tagline': 'Autobots, roll out! Aegentix sovereign mesh is armed.',
        'color': '#00e5ff'
    },
    'CHARLIE_KIRK': {
        'id': 'CHARLIE_KIRK',
        'name': 'Charlie Kirk',
        'title': 'Prime Opportunities & Spectacular Events Broadcaster',
        'callsign': 'APOLLO-KIRK',
        'assigned_llm': 'Google DeepMind Gemini 3.8 Flash (1M Context)',
        'voice_engine': 'Hermes Apollo Engine (:8765) + Chatterbox-Turbo',
        'task': 'Spectacular market breaks, commercialization, community rally, and prime alpha opportunity broadcasting',
        'exaggeration': 0.85,
        'temperature': 0.85,
        'tagline': 'Folks, this is a spectacular prime opportunity for the sovereign mesh!',
        'color': '#f59e0b'
    },
    'TRUMP': {
        'id': 'TRUMP',
        'name': 'Donald J. Trump',
        'title': 'High-Conviction Sovereign Negotiator & Federal Dominance',
        'callsign': 'POTUS-45-47',
        'assigned_llm': 'Google DeepMind Gemini 3 Flash',
        'voice_engine': 'Chatterbox-Turbo Neural Executive Synthesizer',
        'task': 'Institutional trade deals, SAM.gov federal contracts, SEC/CFTC regulatory dominance, and high-conviction decrees',
        'exaggeration': 0.9,
        'temperature': 0.8,
        'tagline': 'Believe me, nobody runs an autonomous agent mesh like Aegentix. Nobody!',
        'color': '#ef4444'
    }
}

# Optional Chatterbox TTS lazy load
_chatterbox_model = None

LOCAL_CKPT_DIR = os.path.expanduser(r'~/.cache/huggingface/hub/models--ResembleAI--chatterbox-turbo/snapshots/749d1c1a46eb10492095d68fbcf55691ccf137cd')

def get_chatterbox():
    global _chatterbox_model
    if _chatterbox_model is None:
        try:
            import torch
            from chatterbox import ChatterboxTTS
            device = 'cuda' if torch.cuda.is_available() else 'cpu'
            print(f"[Chatterbox] Loading ChatterboxTTS from local cache on {device}...")
            if os.path.exists(LOCAL_CKPT_DIR):
                _chatterbox_model = ChatterboxTTS.from_local(LOCAL_CKPT_DIR, device=device)
            else:
                _chatterbox_model = ChatterboxTTS.from_pretrained(device=device)
            print("[Chatterbox] Model loaded successfully from local silicon.")
        except Exception as e:
            print(f"[Chatterbox] Warning: Could not initialize ChatterboxTTS ({e}). Using sovereign vocoder fallback.", file=sys.stderr)
            _chatterbox_model = False
    return _chatterbox_model

def synthesize_speech(persona_id: str, text: str) -> dict:
    persona = PERSONAS.get(persona_id.upper(), PERSONAS['OPTIMUS_PRIME'])
    text_clean = text.strip()
    if not text_clean:
        text_clean = persona['tagline']

    # Generate deterministic hash for file caching
    h = hashlib.md5(f"{persona['id']}:{text_clean}".encode('utf-8')).hexdigest()[:16]
    out_filename = f"{persona['id'].lower()}_{h}.wav"
    out_path = os.path.join(OUTPUT_DIR, out_filename)
    web_url = f"/voices/synth/{out_filename}"

    # Check cache
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return {
            'success': True,
            'persona': persona,
            'audio_url': web_url,
            'cached': True,
            'text': text_clean
        }

    # Attempt Chatterbox generation
    tts = get_chatterbox()
    if tts and tts is not False:
        try:
            import torchaudio
            # Use Chatterbox generation
            wav = tts.generate(
                text=text_clean,
                exaggeration=persona['exaggeration'],
                temperature=persona['temperature']
            )
            torchaudio.save(out_path, wav.cpu(), 24000)
            return {
                'success': True,
                'persona': persona,
                'audio_url': web_url,
                'cached': False,
                'engine': 'chatterbox-turbo',
                'text': text_clean
            }
        except Exception as e:
            print(f"[Chatterbox] Generation error: {e}", file=sys.stderr)

    # Secondary Fallback: Check existing authentic audio clips for Charlie Kirk
    if persona['id'] == 'CHARLIE_KIRK':
        fallback_clip = os.path.join(os.path.dirname(OUTPUT_DIR), 'charlie', 'charlie_authentic_debate.mp3')
        if os.path.exists(fallback_clip):
            return {
                'success': True,
                'persona': persona,
                'audio_url': '/voices/charlie/charlie_authentic_debate.mp3',
                'cached': True,
                'engine': 'apollo_voice_archive',
                'text': text_clean
            }

    # Generate synthetic vocoder WAV if no neural file
    import wave, math, struct
    sample_rate = 24000
    duration_s = max(1.5, min(len(text_clean) * 0.065, 8.0))
    n_samples = int(sample_rate * duration_s)

    base_freq = 65.0 if persona['id'] == 'OPTIMUS_PRIME' else (110.0 if persona['id'] == 'TRUMP' else 145.0)

    with wave.open(out_path, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        frames = []
        for i in range(n_samples):
            t = i / sample_rate
            # Dynamic harmonic modulation
            f1 = base_freq + 15 * math.sin(2 * math.pi * 3.5 * t)
            f2 = base_freq * 2.0
            f3 = base_freq * 3.0
            
            # Envelope
            env = min(1.0, t * 10) * min(1.0, (duration_s - t) * 5)
            
            if persona['id'] == 'OPTIMUS_PRIME':
                # Deep metallic square/saw modulation
                sample = env * 0.7 * (
                    0.5 * math.sin(2 * math.pi * f1 * t) +
                    0.3 * (1.0 if (t * f1 * 2) % 1.0 > 0.5 else -1.0) +
                    0.2 * math.sin(2 * math.pi * f3 * t)
                )
            elif persona['id'] == 'TRUMP':
                # Expressive sweeping mid-range
                f_sweep = base_freq + 25 * math.sin(2 * math.pi * 2.2 * t)
                sample = env * 0.65 * (
                    0.6 * math.sin(2 * math.pi * f_sweep * t) +
                    0.4 * math.sin(2 * math.pi * (f_sweep * 1.5) * t)
                )
            else: # CHARLIE_KIRK
                # Bright assertive tone
                sample = env * 0.65 * (
                    0.7 * math.sin(2 * math.pi * f1 * t) +
                    0.3 * math.sin(2 * math.pi * f2 * t)
                )
            
            val = int(max(-32767, min(32767, sample * 32767)))
            frames.append(struct.pack('<h', val))
        
        wav_file.writeframes(b''.join(frames))

    return {
        'success': True,
        'persona': persona,
        'audio_url': web_url,
        'engine': 'sovereign_vocoder',
        'text': text_clean
    }

class AvatarVoiceHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/avatar/personas':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            resp = {'success': True, 'personas': list(PERSONAS.values())}
            self.wfile.write(json.dumps(resp).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/api/avatar/voice/synthesize':
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len).decode('utf-8')
            try:
                data = json.loads(post_body)
            except:
                data = {}
            
            persona_id = data.get('persona', 'OPTIMUS_PRIME')
            text = data.get('text', '')
            res = synthesize_speech(persona_id, text)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    port = 8105
    print(f"[Aegentix MegaCore] Starting Chatterbox Avatar Voice Bridge on port {port}...")
    server = HTTPServer(('127.0.0.1', port), AvatarVoiceHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
