# GitHub-hosted film rendering

This repository includes an optional, manually triggered GitHub Actions workflow for rendering code-driven Lemo-Opuscar film projects. No automatic publishing is performed.

## First run

1. Merge the workflow pull request into main.
2. In Actions, open **Film render**, select **Run workflow**.
3. Leave project_dir as **ci/render-smoke** with both optional package tiers off.
4. After a successful job, download **lemo-render-<run-id>** under Artifacts.

The smoke test produces a three-second original 540 x 960 animation with synthetic audio. It only checks the browser renderer, FFmpeg muxer, and artifact delivery. It is not a creative film and does not use BLACKSTAR assets.

## Render a real film

Add a self-contained project under films/<slug>/ with an index.html, a build.sh and all required artwork, fonts, voice assets and source code. The build script must produce an MP4 inside the same project directory. Select **films/<slug>** as project_dir. Enable voice_tier if the script needs the library's Kokoro TTS or Whisper; enable music_tier if it needs the optional music packages.

The runner provisions Node.js 22, Python 3.12, Chromium headless shell, FFmpeg 7.1, and the library core dependencies. The runner also sets LEMO_ANGLE=swiftshader, which uses a software WebGL backend when no GPU is available. Render time may be considerably slower than on a dedicated GPU. Additional project-specific packages must be installed by its build.sh.

The workflow accepts only ci/render-smoke or one-level film folders under films/. It checks for a fresh nonempty MP4 and a valid video stream. Outputs are stored as downloadable artifacts for seven days. It does not make visual or editorial quality claims.

## Credentials, assets and usage limits

Do not commit API keys, credentials, private client assets or licensed audio. Use repository Actions Secrets for legitimate integrations, but note that this workflow deliberately does not pass any secrets to builds. If narration is generated externally through ElevenLabs, add the finished audio as an approved project asset or implement a separately reviewed secrets-enabled workflow.

Custom styles (such as Inkglow Toon) and BLACKSTAR brand assets from local Windows paths are not present in a fresh GitHub checkout. They must be added or supplied as permitted assets before a film depending on them can build.

This is a development and testing runner, not an unrestricted video-render farm. Review GitHub's GitHub-hosted runner usage policy and billing conditions before scaling up. Manual dispatch is intentional to prevent every source edit from consuming compute time.

The existing gallery deployment workflow remains separate and unchanged.
