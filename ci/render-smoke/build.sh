#!/bin/sh
# Technical smoke test only. Does not contain or replace a real film.
set -eu
cd "$(dirname "$0")/../.."
D=ci/render-smoke
mkdir -p "$D/out"

node core/render/video.mjs "$D" --fps 24 --workers 2 --size 540x960 --out "$D/out/picture.mp4"
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "sine=frequency=220:sample_rate=48000:duration=3" -af "volume=0.06" "$D/out/audio.wav"
sh core/render/mux.sh "$D/out/picture.mp4" "$D/out/audio.wav" "$D/out/smoke.mp4" 24 0
