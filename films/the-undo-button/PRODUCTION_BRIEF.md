# BLACKSTAR — The Undo Button | Production Brief

**Status:** Source implemented; GitHub Actions renders underway; artistic QA must be approved from actual output.
**Repository:** https://github.com/ontanonggeng/lemo-opuscar
**Branch:** `blackstar/short-the-undo-button`
**Project:** `films/the-undo-button/`
**Deliverable:** Original sci-fi sitcom animation, 44 seconds, 1080×1920, H.264/AAC, US English.

## Concept
Rae, a tired apartment worker, uses a reality-reversing remote to save spilled coffee and undo an embarrassing text. LOOP, her desktop assistant, promptly reports that the same mistake correction revoked her work account. Further rewinds regress her morning. She orders the remote to undo her dumbest purchase—deleting itself—and the original mess returns.

## Original series identity
Rae and LOOP are **new, standalone BLACKSTAR characters**, authorized by the owner for this Short. Rae is an original expressive adult with an asymmetrical dark hairstyle, warm brown skin and a mustard jacket; LOOP is a small triangular desktop appliance. Do not substitute Episode 01 characters, and do not mistake these for canonical Ellis/Pact designs.

## Rendering and voice
- **Engine:** Lemo-Opuscar Sci-Fi Sitcom Toon (`styles/scifi-toon/demo/toon.js`), hand-authored vector rigs, line boil, cel shading, native 9:16 staging.
- **Voice:** Offline Kokoro TTS; Rae `af_heart`; LOOP `am_michael`. No ElevenLabs usage or credits required.
- **Script:** `lines.json`; all ten lines rendered as complete WAVs, with duration-preserving placement; no destructive ASR clip trims.
- **Mixer:** `assemble.py` writes 48 kHz WAV, performance lip-sync, complete SRT and audio QA. Mux uses the repository's two-pass FFmpeg workflow.
- **Brand:** Reconstructed approved BLACKSTAR v5, corner watermark visible on all shots.

## Retention rationale
The owner's Ask Studio audit of the previous Short reported 28.62% stayed-to-watch and 12s AVD. The new Short starts on a reverse-spill visual, delivers its first unintended effect by approximately 8s, reveals a payoff before 15s, and ends on a brief ironic reaction. These are hypotheses to test, not guaranteed improvements.

## Build
The branch's `.github/workflows/blackstar-undo-render.yml` automatically builds on relevant production-file pushes, installs offline Kokoro, reconstructs v5 brand assets, performs code checks, renders 24fps native portrait animation, verifies H.264/AAC and duration, captures contact sheets, then uploads artifacts. No API credentials or paid speech credits.

## Quality gates
Media success and 12 sampled frames are **necessary but insufficient** for artistic acceptance. Review the full film, captions, facial performance, interaction between hand and prop, artwork quality, and spoken word completeness. Reject weak performance or placeholder-like staging and revise before declaring the master final.

**Never publish or schedule automatically.**
