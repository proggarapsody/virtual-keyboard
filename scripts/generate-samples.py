"""Render original, deterministic PCM samples. No third-party recordings."""
import math, random, struct, wave
from pathlib import Path
out = Path(__file__).resolve().parents[1] / 'public' / 'sounds'
out.mkdir(parents=True, exist_ok=True)
for index, name in enumerate(['mechanical', 'release', 'soft', 'tone']):
    rng = random.Random(84 + index)
    frames = []
    for i in range(5292):
        t = i / 44100
        noise = rng.uniform(-1, 1)
        if name == 'mechanical': value = (noise * .55 + math.sin(t*math.tau*190)*.4) * math.exp(-t*70)
        elif name == 'release': value = noise*.4 * math.exp(-t*100)
        elif name == 'soft': value = (noise*.12 + math.sin(t*math.tau*340)*.4) * math.exp(-t*65)
        else: value = math.sin(t*math.tau*640)*.4 * math.exp(-t*35)
        frames.append(struct.pack('<h', int(value*24000)))
    with wave.open(str(out / f'{name}.wav'), 'wb') as f:
        f.setparams((1, 2, 44100, len(frames), 'NONE', 'not compressed')); f.writeframes(b''.join(frames))
