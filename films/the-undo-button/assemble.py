#!/usr/bin/env python3
"""Assemble original, full-length offline Kokoro speech and deterministic foley."""
from __future__ import annotations
import json, pathlib
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "out"
SR = 48000
DURATION = 44.0
lines = json.loads((ROOT / "lines.json").read_text(encoding="utf-8"))
mix = np.zeros(int(DURATION * SR), dtype=np.float64)
rng = np.random.default_rng(92)

def overlay(audio, at, gain=1.0):
    start = round(at * SR)
    end = start + len(audio)
    if start < 0 or end > len(mix):
        raise ValueError(f"Audio cue outside 44s: {at}, {len(audio) / SR}")
    mix[start:end] += audio * gain

def foley(at, dur, kind, gain):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    if kind == "beep":
        env = np.exp(-tt * 24)
        y = (np.sin(2 * np.pi * 830 * tt) + .22 * np.sin(2 * np.pi * 1245 * tt)) * env
    elif kind == "rewind":
        env = np.sin(np.pi * np.arange(n) / max(1, n - 1)) ** 2
        y = np.sin(2 * np.pi * (210 + 460 * tt / max(dur, 1e-6)) * tt) * env
    elif kind == "spill":
        noise = rng.standard_normal(n)
        env = np.exp(-tt * 7.5)
        y = np.convolve(noise, np.ones(20) / 20, mode="same") * env
    elif kind == "pop":
        noise = rng.standard_normal(n)
        y = np.convolve(noise, np.ones(80) / 80, mode="same") * np.exp(-tt * 30)
    else:
        raise ValueError(kind)
    overlay(y, at, gain)

performance = []
last_end = 0
for cue in lines:
    path = OUT / "raw" / f"{cue['id']}.wav"
    if not path.exists():
        raise FileNotFoundError(f"Missing Kokoro line: {path}")
    y, sample_rate = sf.read(path)
    if y.ndim > 1:
        y = y.mean(axis=1)
    if len(y) < .18 * sample_rate or np.max(np.abs(y)) < .012:
        raise ValueError(f"Silent or suspiciously short TTS: {cue['id']}")
    if sample_rate != SR:
        from math import gcd
        g = gcd(int(sample_rate), SR)
        y = resample_poly(y, SR // g, int(sample_rate) // g)
    y = np.asarray(y, dtype=np.float64)
    start = cue["at"]
    dur = len(y) / SR
    if start < last_end - .04:
        raise ValueError(f"Dialogue overlap near {cue['id']}: {start:.2f} < {last_end:.2f}; adjust source timing or speed, never truncate words.")
    if start + dur > DURATION - .25:
        raise ValueError(f"Speech exceeds film: {cue['id']}")
    last_end = start + dur
    # TTS clips remain complete: only fade the first / last 8 ms to avoid clicks.
    fade_n = min(int(.008 * SR), len(y) // 3)
    env = np.ones(len(y))
    if fade_n:
        env[:fade_n] = np.linspace(0, 1, fade_n)
        env[-fade_n:] = np.linspace(1, 0, fade_n)
    peak = max(np.max(np.abs(y)), .05)
    y *= .62 / peak
    overlay(y * env, start, .82)
    steps = []
    for i in range(int(np.ceil(dur * 12))):
        lo = int(i * SR / 12)
        hi = min(len(y), int((i + 1) * SR / 12))
        seg = y[lo:hi]
        rms = float(np.sqrt(np.mean(seg * seg))) if len(seg) else 0.
        steps.append(round(min(1., rms / .19), 3))
    performance.append({
        "id": cue["id"], "who": cue["who"], "text": cue["text"], "start": start,
        "end": round(start + dur, 3), "duration": round(dur, 3), "mouth12fps": steps
    })

# A few physically motivated hits. No canned laughter or rhythmic SFX spam.
for at, dur, kind, gain in [
    (0.04, .48, "spill", .16), (.82, .14, "beep", .07),
    (8.05, .12, "beep", .09), (15.1, .37, "rewind", .07),
    (17.4, .32, "rewind", .10), (29.3, .12, "beep", .06),
    (33.1, .24, "pop", .15), (35.44, .50, "spill", .17),
    (36.3, .15, "beep", .06)
]:
    foley(at, dur, kind, gain)
# Quiet apartment room tone instead of a continuous music bed.
tt = np.arange(len(mix)) / SR
mix += .0024 * np.sin(2 * np.pi * 61.5 * tt)
mix += .0010 * np.sin(2 * np.pi * 123.0 * tt)
# Make a small headroom reservation; final mux performs two-pass normalization.
mix = np.tanh(mix * .93) * .91
OUT.mkdir(parents=True, exist_ok=True)
sf.write(OUT / "mix.wav", mix.astype(np.float32), SR, subtype="PCM_24")
(OUT / "performance.json").write_text(json.dumps({
    "duration": DURATION, "fps": 24, "lines": performance, "voices": {"RAE": "af_heart", "LOOP": "am_michael"},
    "source": "Kokoro offline full-length line files", "truncatedWords": False
}, indent=2) + "\n")
(OUT / "the-undo-button.srt").write_text("\n".join(
    f"{i + 1}\n{fmt(x['start'])} --> {fmt(min(x['end'] + .10, DURATION))}\n{x['text']}\n"
    for i, x in enumerate(performance)
) if False else "", encoding="utf-8")
def timestamp(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02d}:{(ms // 60000) % 60:02d}:{(ms // 1000) % 60:02d},{ms % 1000:03d}"
sub = []
for i, x in enumerate(performance):
    sub.extend([str(i + 1), f"{timestamp(x['start'])} --> {timestamp(min(x['end'] + .10, DURATION))}", x['text'], ""])
(OUT / "the-undo-button.srt").write_text("\n".join(sub), encoding="utf-8")
(OUT / "audio-qa.json").write_text(json.dumps({
    "tts_engine": "Kokoro (offline)", "line_count": len(performance),
    "all_full_files_mixed": True, "no_destructive_asr_cutting": True,
    "last_line_end": round(last_end, 3), "duration": DURATION,
    "speech_verified_by_human": False, "asr_verified": False
}, indent=2) + "\n")
print("AUDIO ASSEMBLED", len(performance), "full Kokoro lines; last end", round(last_end, 2))
