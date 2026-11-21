#!/usr/bin/env python3
"""BLACKSTAR V2 — assemble complete, individual ElevenLabs cues without destructive trims.

One prompt = one complete MP3. Unlike V1, no ASR-derived source offsets are used.
This cannot clip a word when its alignment timestamp is inaccurate.
"""
from __future__ import annotations
import hashlib
import json
import math
import pathlib
import subprocess
import wave

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "out"
VOICES = ROOT / "voice-v2"
OUT.mkdir(parents=True, exist_ok=True)
SR = 48_000

def probe_duration(path: pathlib.Path) -> float:
    data = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        text=True
    ).strip()
    return float(data)

lines = json.loads((ROOT / "dialogue.json").read_text(encoding="utf-8"))
assert len(lines) == 31
assert [e["id"] for e in lines] == list(range(1, 32))
voice_data = []
events = []
pos = 0.40

for cue in lines:
    idx = cue["id"]
    file = VOICES / f"{idx:02}.mp3"
    if not file.is_file() or file.stat().st_size < 1000:
        raise SystemExit(f"Missing original ElevenLabs cue: {file}")
    duration = probe_duration(file)
    if not 0.40 < duration < 12.0:
        raise SystemExit(f"Implausible cue duration {idx}: {duration}")
    # All decoded samples are included, even the first/last silent encoder frames.
    raw = subprocess.check_output([
        "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
        "-i", str(file), "-f", "f32le", "-ar", str(SR), "-ac", "1", "-"
    ])
    samples = np.frombuffer(raw, dtype="<f4").copy()
    actual = len(samples) / SR
    if len(samples) < int(.35 * SR):
        raise SystemExit(f"Decoded cue {idx} unexpectedly short")
    # Do not time-stretch or truncate the file. Only adjust whole-clip gain.
    rms = float(np.sqrt(np.mean(samples.astype(np.float64) ** 2) + 1e-12))
    gain = min(1.8, .11 / max(rms, .045))
    samples *= gain
    spoken_start = round(pos, 3)
    spoken_end = round(pos + actual, 3)
    events.append({
        "id": idx,
        "speaker": cue["speaker"],
        "text": cue["text"],
        "start": spoken_start,
        "end": spoken_end,
        "duration": round(actual, 4),
        "voiceFile": file.name
    })
    voice_data.append((spoken_start, samples))
    # A short controlled pause; longer holds after dark punchlines.
    is_reveal = any(k in cue["text"] for k in (
        "years.", "terms you skipped", "evicted", "previous tenant",
        "never see me again"
    ))
    pause = max(.11, min(.28, float(cue.get("pause", .16))))
    if is_reveal:
        pause += .18
    pos += actual + pause

brand_start = round(pos + .30, 3)
duration = round(brand_start + 2.50, 3)
if not 58 <= duration <= 90:
    raise SystemExit(f"Unexpected V2 film duration: {duration:.2f}s")
mix = np.zeros(math.ceil((duration + .02) * SR), dtype=np.float32)
for start, audio in voice_data:
    i = int(round(start * SR))
    mix[i:i + len(audio)] += audio

# Synthesized production-only foley, deliberately quieter than dialogue.
def thump(at, *, amplitude=.065, tone=135):
    begin = round(at * SR)
    n = min(int(.14 * SR), len(mix) - begin)
    if begin < 0 or n <= 0:
        return
    time = np.arange(n, dtype=np.float32) / SR
    kick = amplitude * np.exp(-time * 37) * (
        np.sin(time * 2 * np.pi * tone) + .28 * np.sin(time * 2 * np.pi * tone * 2.4)
    )
    mix[begin:begin+n] += kick.astype(np.float32)

for e in events:
    if e["speaker"] == "D" and e["text"] == "Knock knock.":
        thump(e["start"] + .25, amplitude=.038, tone=160)
        thump(e["start"] + .59, amplitude=.044, tone=140)
    if e["text"].startswith("Wait. What's knocking"):
        for dt in (.8, 1.23, 1.70):
            thump(e["start"] + dt, amplitude=.033, tone=91)

# Soft ship ventilation only while the characters are on-screen.
ambient_len = round(brand_start * SR)
hum_t = np.arange(ambient_len, dtype=np.float32) / SR
mix[:ambient_len] += .0009 * np.sin(2 * np.pi * 72 * hum_t)

peak = max(1e-6, float(np.max(np.abs(mix))))
if peak > .92:
    mix *= .92 / peak
with wave.open(str(OUT / "mix.wav"), "wb") as out:
    out.setnchannels(1)
    out.setsampwidth(2)
    out.setframerate(SR)
    out.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())

timeline = {"duration": duration, "brandStart": brand_start, "lines": events, "version": 2}
(OUT / "timeline.json").write_text(json.dumps(timeline, indent=2) + "\n", encoding="utf-8")

def stamp(secs):
    ms = round(secs * 1000)
    return f"{ms//3600000:02d}:{(ms//60000)%60:02d}:{(ms//1000)%60:02d},{ms%1000:03d}"

srt = []
for i, event in enumerate(events, 1):
    srt.extend((str(i), f"{stamp(event['start'])} --> {stamp(event['end'])}",
                event["text"], ""))
(OUT / "dark-knock-knock.srt").write_text("\n".join(srt), encoding="utf-8")
qa = {
    "voiceSource": "31 independent complete ElevenLabs MP3 files",
    "destructiveTimeCuts": False,
    "usedOriginalFiles": 31,
    "cues": [
        {
            "id": e["id"], "text": e["text"], "file": e["voiceFile"],
            "duration": e["duration"],
            "sha256": hashlib.sha256((VOICES/e["voiceFile"]).read_bytes()).hexdigest()
        } for e in events
    ],
    "limitations": "The mixer prevents boundary clipping. Transcript accuracy for every independent MP3 still requires speech recognition/listening QA."
}
(OUT/"voice-qa.json").write_text(json.dumps(qa,indent=2)+"\n")
print(f"BLACKSTAR V2 AUDIO PASS: {len(events)} entire speech files, duration={duration:.2f}s, endcard={brand_start:.2f}s")
