# BLACKSTAR Phase 06 — isolated renderer spike

This is a deliberately small pre-POC, not the full 24-second dialogue scene. It exercises the existing native toon engine, two aspect ratios, reusable provisional rig functions, a deterministic 6-second timeline, brand watermark decoding from the previously committed v5 archive, full media decoding and measured render throughput.

## Run
From the repository root, install the documented Lemo-Opuscar core dependencies (Node 20+, Python 3.11+, FFmpeg 7+). Then:

```sh
sh films/blackstar-render-spike/build.sh
```

The existing Film render workflow can also be manually dispatched on this branch using project_dir=films/blackstar-render-spike, voice_tier=false, music_tier=false.

Outputs in out/: portrait.mp4, landscape.mp4, contact JPEGs, benchmark.json and diagnostic WAV. No uploading or posting to social platforms. No credentials required.

## Scope
Automated: repeated-frame decoded-pixel hash against out-of-order capture, native dimensions, H.264, yuv420p, exact 24 fps, 144 video frames, AAC audio, full decode, duration tolerance, and archive watermark SHA-256 recorded. Render timing measures only the picture capture/encode command, not hands-on production. Manual: verify character appearance, composition, contact and brand placement by viewing the assets. Pending: approved production models, verified new brand ZIP, actual dialogue, ASR, lip-sync, caption QA, long-form benchmark, publishing buffer. No automatic checks are claimed to be passed before a successful run.
