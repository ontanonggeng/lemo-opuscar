#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
python3 films/blackstar-render-spike/build.py
