#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
D=films/portal-printer
mkdir -p "$D/out/raw" "$D/voices"
sh styles/scifi-toon/demo/tools/fonts.sh
if [ ! -s brand/blackstar/v5/video/corner-watermark-white-512.png ]; then
  .venv/bin/python -m pip install --quiet pillow shapely cairosvg
  .venv/bin/python brand/blackstar/bootstrap.py
fi
.venv/bin/python core/tts/tts.py "$D/lines.json" "$D/out/raw"
.venv/bin/python "$D/voice.py"
.venv/bin/python core/tts/asr_check.py "$D/lines.json" "$D/voices" --lang en --model base.en
.venv/bin/python "$D/music.py"
.venv/bin/python "$D/mix.py"
node "$D/srt.mjs"
node core/render/video.mjs "$D" --q 'mode=film' --fps 24 --workers 3 --size 1080x1920 --out "$D/out/picture.mp4"
sh core/render/mux.sh "$D/out/picture.mp4" "$D/out/mix.wav" "$D/out/portal-printer.mp4" 24 0
.venv/bin/python "$D/verify.py"
