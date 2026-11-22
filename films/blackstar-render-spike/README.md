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

## Determinism regression
Run 44986879493 failed on the first portrait decoded-JPEG comparison. The scene now resets Canvas state and explicitly fills the entire opaque framebuffer before drawing. QA preserves the strict JPEG check and adds SHA-256 comparisons of raw Canvas RGBA bytes in the same and fresh browser, including reverse-order playback. Both checks must pass. Root cause is a hypothesis until the retry demonstrates the fix.

## Second regression (run 44987115587)
All four decoded JPEG comparisons passed after explicitly clearing the framebuffer. Raw Canvas RGBA comparisons failed (same page 2/4, new browser 0/4). The next revision requests an opaque, sRGB, readback-oriented Canvas 2D context before calling the native toon initializer, so the same policy applies to stills, video, and diagnostic readback. This is a targeted hypothesis about adaptive rasterization, not a confirmed root cause. Both exact comparisons remain mandatory. Context attributes are logged for diagnosis.
