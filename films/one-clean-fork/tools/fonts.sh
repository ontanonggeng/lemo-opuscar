#!/bin/sh
set -eu
D=$(cd "$(dirname "$0")/.." && pwd)/fonts
mkdir -p "$D"
get(){ [ -s "$D/$1" ] && return 0; curl -fsSL --retry 2 -o "$D/$1.part" "$2"; mv "$D/$1.part" "$D/$1"; }
get baloo2.woff2 "https://fonts.gstatic.com/s/baloo2/v23/wXKrE3kTposypRyd51jcAM4olXc.woff2"
get vt323.woff2 "https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2isfFJXUdVNF.woff2"
