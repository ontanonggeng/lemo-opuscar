#!/bin/sh
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=$(cd "$HERE/../.." && pwd)
cd "$LIB"
sh "$HERE/tools/fonts.sh"
mkdir -p "$HERE/out/raw" "$HERE/voices"
.venv/bin/python core/tts/tts.py "$HERE/lines.json" "$HERE/out/raw"
.venv/bin/python "$HERE/voice.py"
.venv/bin/python "$HERE/asr.py"
.venv/bin/python "$HERE/mix.py"
node "$HERE/srt.mjs"
node core/render/video.mjs "$HERE" --fps 24 --workers 3 --size 1080x1920 --out "$HERE/out/picture.mp4"
sh core/render/mux.sh "$HERE/out/picture.mp4" "$HERE/out/mix.wav" "$HERE/out/one-clean-fork.mp4" 24 0
