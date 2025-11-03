from synth.beat import synthesize_beat
from synth.vocal import generate_vocal
from synth.visual import render_visual
from trucks.design import design_truck
import hashlib

def _deterministic_seed(*parts):
    data = "".join(str(p) for p in parts).encode("utf-8")
    return int.from_bytes(hashlib.sha256(data).digest()[:8], "big")

def generate_music(wallet_id, genre, mood, language):
    seed = _deterministic_seed(wallet_id, genre, mood, language)
    beat = synthesize_beat(seed, genre)
    vocal = generate_vocal(seed, language)
    visual = render_visual(seed, mood)
    truck = design_truck(seed, genre)
    return { "beat": beat, "vocal": vocal, "visual": visual, "truck": truck }
