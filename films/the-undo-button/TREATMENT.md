# BLACKSTAR — The Undo Button

Status: production treatment. Target: 42–45 seconds, 1080×1920, 24 fps, US English, Lemo-Opuscar scifi-toon.

## Audience and creative brief
Original recurring-character BLACKSTAR sci-fi sitcom Short. Rae discovers a mistake-reversing remote; LOOP interprets mistakes too broadly. Standalone story for a US audience. Never alter or publish the already-uploaded Short "My AI Canceled Saturday."

## Prior performance context (Ask Studio, preliminary)
- Previous Short: 1,165 views, 341 engaged views, stayed to watch 28.62%, average view duration 12 seconds over approximately 63 seconds.
- Findings: weak out-of-context first line, the most compelling absurdity arrives late, and payoff follows at 44–55 seconds.
- Design hypotheses, **not** promises: a fully legible visual hook by 0:02; first accidental consequence by 0:08; first laugh by 0:15; a strong reversal by 0:38. No arbitrary sound-effect or zoom quota. Do not equate the swipe-rate statistic with exact first-2-second retention.

## Three original structures considered
**A. Rewind ladder:** coffee saved; an embarrassing message undone; job accidentally erased; attempting correction rewinds the entire day; the remote's acquisition is undone; the original text returns. Pros: causality and visual transformations; minimal exposition. Cons: requires clear on-screen timeline markers.
**B. Household repairs:** reverse a spill, broken mug, and microwave incident until the apartment is progressively unbuilt. Pros: prop comedy. Cons: less human personality and too expensive for 45 seconds.
**C. One-take paradox:** continuous medium shot, increasingly frantic dialogue, remote disappears. Pros: constrained animation. Cons: repeats the previous Short's static conversational pacing.

**Selected: A**, with only one major status reveal and one day rewind, then an efficient callback.

## Character and continuity lock
This Short introduces Rae and LOOP as original characters; do not reuse an existing series cast by default. Rae is a dry, overworked adult woman in a mustard jacket; LOOP is an unobtrusive, triangular desktop assistant. Production uses offline Kokoro voices: Rae `af_heart` and LOOP `am_michael`. No voice/API key dependency. Hand-authored 2D vector rigs must show credible anatomy, acting, and hand-to-prop contact.

## Story logic
The remote rolls back a *related cluster of events* rather than the single last physical motion. LOOP's analysis wrongly assigns the cluster, producing unintended consequences. A final instruction rolls back remote acquisition, so effects made by that remote are also undone. The original spilled coffee and awkward text return. Establish the retroactive nature visually.

## Timeline and staging
- **0:00–0:02** — Immediate close-up: coffee tips toward computer keyboard; Rae hits UNDO; droplets reverse into the mug.
- **0:02–0:07** — Rae reacts; LOOP describes the device in one dry line. Establish buttons and rule, no title intro.
- **0:07–0:15** — Rae reverses his embarrassing boss text. Phone says MESSAGE UNSENT, then EMPLOYMENT RECORD REMOVED. First payoff by 0:15.
- **0:15–0:25** — Rae tries to undo the collateral damage. Apartment jump-cuts to early morning, with his alarm ringing. LOOP notes the regression.
- **0:25–0:35** — Exasperated Rae commands the remote to undo its own acquisition. It disappears; earlier effects revert with one clear transformation.
- **0:35–0:43** — Original coffee spills again and the boss's new reply appears: "Love you too." Rae responds with a cold look.
- **0:43–0:45** — Finish on dry, short punchline and immediate hard cut. No closing CTA.

## Production constraints and quality gates
- Native portrait framing, original controlled line boil, adult-animation proportions, anatomically stable hand contact and props; not a collage of AI-generated stills.
- At most a few purposeful shots, with reaction close-ups and prop insert. Keep subtitle band clear, use official BLACKSTAR v5 corner-watermark.
- Kokoro dialogue clips must be checked by listening/transcription against approved screenplay. Never trim first syllables via guessed ASR timestamps.
- Use brand/blackstar/v5/video/corner-watermark-white-512.png after validating asset availability; add end card only if it does not bury the joke.
- Deliver scene code, audio sources, final captions, build script, actual MP4, frame contact sheet, QA notes, metadata and GitHub Actions artifact. A completed workflow alone is not artistic QA.
- Do not publish or schedule any YouTube content.

## Production status
Original Rae/LOOP scenes, Kokoro WAV pipeline, and GitHub Actions renderer are implemented. Art and speech quality acceptance requires inspection of the final rendered artifact.