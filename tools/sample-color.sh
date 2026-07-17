#!/usr/bin/env bash
# sample-color.sh <png> <x> <y> [w] [h]
#
# Reports the CORE color of text/icon in a region by scanning rows and returning the
# lightest row's average (skips the dark background between glyph strokes). Use to compare
# a prototype render against a live-app screenshot — the ONLY trustworthy color check.
#
# Why: the source color TOKEN is the declared intent, not what renders. They diverge
# (account-name title token = directColor1/white, but it RENDERS directColor4/#A8 gray;
# search icon token = baseColor1 gray, renders directColor1/white when focused). Never
# claim a color "matches" from reading the QML token — sample the pixels of both renders.

set -uo pipefail
png="${1:?usage: sample-color.sh <png> <x> <y> [w=140] [h=30]}"
x="${2:?need x}"; y="${3:?need y}"; w="${4:-140}"; h="${5:-30}"

python3 - "$png" "$x" "$y" "$w" "$h" <<'PY'
import sys
from PIL import Image
png,x,y,w,h = sys.argv[1], *map(int, sys.argv[2:6])
im=Image.open(png).convert('RGB')
best=None
for yy in range(y, y+h):
    row=[im.getpixel((xx,yy)) for xx in range(x, x+w)]
    bright=sorted(row,key=lambda p:sum(p),reverse=True)[:max(1,len(row)//8)]
    r=sum(p[0] for p in bright)//len(bright); g=sum(p[1] for p in bright)//len(bright); b=sum(p[2] for p in bright)//len(bright)
    s=r+g+b
    if best is None or s>best[0]: best=(s,yy,r,g,b)
_,yy,r,g,b=best
print(f"core color @ row {yy}: #{r:02X}{g:02X}{b:02X}  (rgb {r},{g},{b})")
PY
