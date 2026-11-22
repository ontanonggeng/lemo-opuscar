#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
D=films/the-undo-button
mkdir -p "$D/out/raw"
.venv/bin/python core/tts/tts.py "$D/lines.json" "$D/out/raw"
.venv/bin/python "$D/assemble.py"
node core/render/video.mjs "$D" --fps 24 --workers 3 --size 1080x1920 --out "$D/out/picture.mp4"
sh core/render/mux.sh "$D/out/picture.mp4" "$D/out/mix.wav" "$D/out/the-undo-button.mp4" 24 0
ffprobe -v error -show_entries format=duration -of default=nw=1 "$D/out/the-undo-button.mp4"
