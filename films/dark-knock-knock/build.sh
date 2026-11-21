#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
D=films/dark-knock-knock
python3 "$D/assemble.py"
node core/render/video.mjs "$D" --fps 24 --workers 2 --size 540x960 --out "$D/out/picture.mp4"
sh core/render/mux.sh "$D/out/picture.mp4" "$D/out/mix.wav" "$D/out/dark-knock-knock.mp4" 24 0
ffprobe -hide_banner -v error -show_entries format=duration -of default=nw=1 "$D/out/dark-knock-knock.mp4"
