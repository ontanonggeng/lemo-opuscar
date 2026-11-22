# BLACKSTAR — The Undo Button

An original 44-second vertical US-English animated sci-fi sitcom Short, created by code in Lemo-Opuscar's Sci-Fi Sitcom Toon style.

**Cast:** Rae and LOOP (new BLACKSTAR characters). **Speech engine:** offline Kokoro; no ElevenLabs dependency. **Brand:** approved BLACKSTAR v5. **Publishing:** disabled.

## Production files
- [TREATMENT.md](./TREATMENT.md) — selected story, causal rules and performance objectives.
- [PRODUCTION_BRIEF.md](./PRODUCTION_BRIEF.md) — current production contract and QA gates.
- [SCREENPLAY.md](./SCREENPLAY.md) — timed editorial coverage and complete dialogue.
- [SCENES.json](./SCENES.json) — nine shot windows totaling exactly 44s.
- [lines.json](./lines.json) — ten original English dialogue lines, Kokoro cast and audio starts.
- [scene.js](./scene.js) + [index.html](./index.html) — original native vector animation and captions.
- [assemble.py](./assemble.py) — lossless WAV line placement, sound design and performance envelopes.
- [build.sh](./build.sh) — voice, picture, mux pipeline.
- [verify.py](./verify.py) — FFprobe media checks and storyboard contact sheet.
- [YOUTUBE_METADATA.md](./YOUTUBE_METADATA.md) — metadata proposal, not a publishing request.

## Reproduction
`sh plugin/skills/lemo-opuscar/scripts/setup.sh deps voice`
`python brand/blackstar/bootstrap.py`
`sh films/the-undo-button/build.sh`

Use the GitHub Actions workflow [blackstar-undo-render.yml](../../.github/workflows/blackstar-undo-render.yml) for cloud rendering and artifact delivery.

**Status:** Audio and media checks are automated. Artistic and speech verification must be completed on the final actual MP4 before public release.
