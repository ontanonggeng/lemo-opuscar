# Dark Knock-Knock Jokes — BLACKSTAR V2

An original US-English sci-fi sitcom short, built in code with the **Lemo-Opuscar Sci-Fi Sitcom Toon** rendering grammar. An overworked tenant confronts a deadpan sentient security door about increasingly punitive knock-knock jokes.

## Production specification

| Item | Specification |
| --- | --- |
| Cast | NIX (anxious tenant), DORIS (sentient apartment-door security AI) |
| Frame | 9:16 portrait, 720 × 1280 |
| Animation | 24 fps video; three boiling outline drawings and character acting sampled at 12 fps |
| Artwork | Original articulated 2D characters, hard-edged cel shadows, mechanical hallway environment, practical props |
| Voice | 31 separate full-line ElevenLabs v4 MP3s saved under `voice-v2/` |
| Sync | Whole-clip placement without ASR-based trimming; speech amplitude sampled at 12 fps drives lip motion |
| Sound | Quiet room tone, original generated knocking effects, natural dialogue dynamics |
| Brand | Owner-approved BLACKSTAR v5 Eclipse Cut; `corner-watermark-white-512.png` on every normal shot; unaltered official end card |
| Subtitles | 31 SRT cues and on-screen speaker labels |
| Render | GitHub Actions; FFmpeg / Chromium / Lemo-Opuscar |
| Publish | Never automatic |

## Film sources

- `dialogue.json` — the original 31-line script, in story order.
- `voice-v2/01.mp3` ... `31.mp3` — complete approved independent ElevenLabs outputs, **never cropped using V1 transcription time offsets**.
- `assemble.py` — whole-clip audio mix, timed cues, SRT, 12-fps amplitude envelope.
- `scene.js` — 2D production drawings and acting built with `styles/scifi-toon/demo/toon.js`.
- `build.sh` — FFmpeg/H.264 final render command.
- `.github/workflows/dark-knock-knock-v2-qa.yml` — ten scene-art QA frames.
- `.github/workflows/dark-knock-knock-v2-render.yml` — complete cloud film render and automated media integrity gates.

The first V1 render is **superseded**. Its long source tracks were cut using externally obtained timestamps; the mistaken word boundary caused missing syllables, for example cutting `Your` from `Your conscience.`. V2 eliminates the destructive cuts. The independent `Your conscience.` clip was additionally checked with ElevenLabs transcription and returned the full phrase.

## Creative QA requirements

A successful GitHub Actions run is not proof of artistic quality. Inspect the actual final MP4 and a broad sampling of frames for facial anatomy, shot continuity, hand shape, correct watermark position, subtitle legibility, stable character proportions and any stray text. Listen to the whole soundtrack: automated sample integrity does **not** prove every TTS generation pronounced the complete text.

If rendering fails, do not silently substitute the V1 output, publish a partial clip or describe it as a finished V2 master.

## Licensing and provenance

The animation and characters are original to this film. The Lemo-Opuscar code library and style documentation are governed by their respective upstream terms; separate brand assets come from the approved owner-supplied v5 BLACKSTAR kit. Do not revive any retired anime-derived BLACKSTAR marks.
