# BLACKSTAR — One Clean Fork

Original 48-second vertical sci-fi sitcom Short built from code in the repository's `scifi-toon` grammar.

- **Cast:** Nora and Cal, plus the non-verbal Forkling.
- **Premise:** one clean fork becomes an absurd household matter-duplication disaster.
- **Style:** thick boiling outlines, flat fills, hard-edged cel shadows, big eyes/tiny pupils, elastic mouths, acting on twos, camera/props on ones, deadpan-vs-panic comedy.
- **Voice:** offline Kokoro (`af_nicole` / `am_eric`), with exact faster-whisper ASR gate.
- **Format:** 1080×1920, 24fps, ~48s, H.264/AAC.
- **Publishing:** disabled.

## Build
```sh
sh plugin/skills/lemo-opuscar/scripts/setup.sh deps voice
python brand/blackstar/bootstrap.py
sh films/one-clean-fork/build.sh
```

GitHub Actions is the intended render environment. The workflow also creates a 20-frame story contact sheet and four 0.2-second action strips for physical-animation QA.

Do not treat CI green as artistic approval. Review the actual MP4 and QA images before release.
