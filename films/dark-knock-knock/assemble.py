#!/usr/bin/env python3
"""Use approved ElevenLabs dialogue to assemble a timed original short film soundtrack."""
import json, math, os, pathlib, subprocess, urllib.parse, urllib.request, wave
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
OUT = ROOT / "out"
ASSETS.mkdir(exist_ok=True)
OUT.mkdir(exist_ok=True)
SR = 48000
lines = json.loads((ROOT / "dialogue.json").read_text())
urls = json.loads((ROOT / "voice-sources.json").read_text())
def download(actor):
    p = ASSETS / ("doris.mp3" if actor == "D" else "nix.mp3")
    if p.exists() and p.stat().st_size > 10000:
        return p
    url = urls[actor]
    u = urllib.parse.urlparse(url)
    if u.scheme != "https" or u.hostname != "elevenlabsusercontent.com":
        raise RuntimeError("Only approved ElevenLabs CDN URLs accepted")
    req = urllib.request.Request(url, headers={"User-Agent": "BLACKSTAR-Renderer/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read(20_000_001)
    if not 10_000 < len(data) <= 20_000_000:
        raise RuntimeError("ElevenLabs download invalid size")
    p.write_bytes(data)
    return p

tracks = {}
for actor in ("D", "N"):
    fn = download(actor)
    raw = OUT / (actor + ".raw")
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(fn), "-ac", "1", "-ar", str(SR), "-f", "s16le", str(raw)], check=True)
    tracks[actor] = np.fromfile(raw, dtype=np.int16).astype(np.float32) / 32768.0
    if len(tracks[actor]) < SR * 10:
        raise RuntimeError("ElevenLabs source unexpectedly short: " + actor)

events, pos = [], 0.45
for cue in lines:
    actor = cue["speaker"]
    a, b = cue["srcStart"], cue["srcEnd"]
    start, end = int(a * SR), int(b * SR)
    assert 0 <= start < end <= len(tracks[actor]) + 5000, cue
    duration = (end - start) / SR
    events.append({**cue, "start": round(pos, 3), "end": round(pos + duration, 3)})
    pos += duration + cue["pause"]
brand_start = round(pos + 0.65, 3)
duration = round(brand_start + 2.4, 3)
if not 50 <= duration <= 78:
    raise RuntimeError(f"Duration outside expected short range: {duration:.2f}s")
count = math.ceil(duration * SR)
t = np.arange(count, dtype=np.float64) / SR
# A very quiet ship's air handling is audible until the brand end card.
mix = (0.0013 * np.sin(2 * math.pi * 69 * t)).astype(np.float32)
for cue in events:
    actor = cue["speaker"]
    src = tracks[actor]
    clip = src[int(cue["srcStart"] * SR):int(cue["srcEnd"] * SR)].copy()
    if clip.size == 0:
        raise RuntimeError("No dialogue samples: " + str(cue["id"]))
    # Smooth joins and match track energy without crushing expressive dynamics.
    rms = float(np.sqrt(np.mean(clip * clip) + 1e-10))
    gain = min(2.2, .088 / max(.018, rms))
    clip *= gain
    fade = min(len(clip)//2, int(.012 * SR))
    if fade:
        clip[:fade] *= np.linspace(0, 1, fade)
        clip[-fade:] *= np.linspace(1, 0, fade)
    dst = int(cue["start"] * SR)
    mix[dst:dst + len(clip)] += clip
    # Original, synthesized wooden-metal knock under each "Knock knock" call.
    if actor == "D" and cue["text"] == "Knock knock.":
        for off in (0.06, 0.39):
            idx = int((cue["start"] + off) * SR)
            n = min(int(.105*SR), count - idx)
            if n > 0:
                tt = np.arange(n)/SR
                knock = .075*np.exp(-tt*42)*(np.sin(2*np.pi*132*tt) + .40*np.sin(2*np.pi*311*tt))
                mix[idx:idx+n] += knock.astype(np.float32)
# The quiet knocking inside the wall leads into the final reversal.
wall = next(e for e in events if "inside the wall" in e["text"])
for off in (.3,.68,1.07):
    idx = int((wall["end"] + off) * SR)
    n = min(int(.12*SR), count-idx)
    if n > 0:
        tt=np.arange(n)/SR
        mix[idx:idx+n] += (.055*np.exp(-tt*35)*np.sin(2*np.pi*88*tt)).astype(np.float32)
mix *= min(1.0, .89/max(.89, float(np.max(np.abs(mix)))))
with wave.open(str(OUT / "mix.wav"),"wb") as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(SR)
    wav.writeframes((np.clip(mix,-1,1)*32767).astype("<i2").tobytes())
(OUT/"timeline.json").write_text(json.dumps({"duration":duration,"brandStart":brand_start,"lines":events},indent=2))
def srt_ts(x):
    ms = round(x * 1000)
    return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
srt = []
for i,e in enumerate(events,1):
    srt.extend([str(i), srt_ts(e["start"])+" --> "+srt_ts(e["end"]), e["text"],""])
(OUT/"dark-knock-knock.srt").write_text("\n".join(srt),encoding="utf-8")
print(f"Mixed {len(events)} synced dialogue clips from ElevenLabs; duration {duration}s; brand at {brand_start}s")
