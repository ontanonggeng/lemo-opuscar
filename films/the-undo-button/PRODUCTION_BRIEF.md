# BLACKSTAR Production Assignment — The Undo Button

Produce a new, original BLACKSTAR animated Short in Lemo-Opuscar's **Sci-Fi Sitcom Toon** (`scifi-toon`) style. **GitHub is the production source of truth and rendering destination.** Do not use paths on the owner's Windows computer to build the cloud render.

- **Repository:** https://github.com/ontanonggeng/lemo-opuscar
- **Work branch:** `blackstar/short-the-undo-button`
- **Film directory:** `films/the-undo-button/`
- **Approved brand source:** `brand/blackstar/v5/`, with `corner-watermark-white-512.png`
- **Native format:** 1080×1920, 9:16, 24 fps, H.264/AAC
- **Target:** 40–45 seconds
- **Spoken/public language:** natural US English
- **Voice production:** ElevenLabs; restore exact Ellis and Pact voice assignments from Episode 01 **before generation**, and preserve full original line files in GitHub
- **Cast:** Ellis and Pact, with original recurring-character visual continuity; no Nix/Doris stand-ins

## Story
Ellis uses a remote to undo a spilled coffee, but tries undoing his embarrassing text to his boss and inadvertently undoes the job that gave him the boss. A correction rewinds the whole morning. He orders the remote to undo his day's dumbest purchase, inadvertently erasing the remote from the timeline. The original spilled coffee returns, along with an unexpected reply from his boss.

Follow `TREATMENT.md`, `SCREENPLAY.md`, and `SCENES.json`, rather than a demo's plot.

## Lessons from Ask Studio
Previous Short "My AI Canceled Saturday": 1,165 views, 341 engaged views, 28.62% stayed-to-watch, average view duration 12 seconds on a ~63-second upload. Treat as preliminary. Hook must be readable without a previous episode by 0:02, reveal first unintended consequence by ~0:08 and payoff before 0:15. Escalate purposefully, avoid arbitrary zooms/SFX. Trim weak exposition, not character-driven silence.

## Production order
1. Read `AGENTS.md`, `DIRECTOR.md`, `TECHNIQUE.md`, `styles/scifi-toon/STYLE.md`, the film treatment, approved v5 brand guide, and previous BLACKSTAR source assets. Reconcile actual Ellis/Pact identity and voices; **do not assume unavailable assets exist**.
2. Build original 2D character acting and environmental scenes using the native style's drawing grammar, preserving model identity.
3. Generate individual ElevenLabs lines, validate speech completeness and pronunciation, persist approved MP3s to the project before URLs expire. No destructive ASR-derived trimming.
4. Build native vertical timing and captions; deliver real animated performance with cohesive prop interactions and camera grammar, not static slides.
5. Run GitHub Actions to render, validate H.264/AAC output, resolution, FPS, caption timing, and nonempty audio; upload MP4/SRT, sample frames, and QA metadata as workflow artifacts.
6. Inspect actual rendered frames and listen to the full audio. Correct any visual or vocal defects and re-render. Never claim artistic QA on CI green alone.

## Acceptance criteria
- Native 1080x1920, 40–45s, 24fps, US English.
- Immediate reverse-spill visual hook; intelligible story without long-form context.
- First escalation readable before 15s; coherent rewind behavior; strong last-shot reaction.
- Stable Ellis/Pact canonical appearance and voices.
- Official BLACKSTAR v5 watermark at a safe location, no retired anime-derived logos.
- Complete synchronized captions; all words spoken; FFprobe verification; no black/blank or placeholder scene frames.
- Deliver code, reusable assets, full-quality MP4, YouTube Shorts title/description, source audio, SRT and visual/audio QA artifacts.
- **Do not publish** or alter YouTube accounts or existing content.
