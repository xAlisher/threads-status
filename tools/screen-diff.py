#!/usr/bin/env python3
"""screen-diff.py <mine.png> <golden.png> <out_composite.png>

Proactive review gate: stitch my prototype render beside a golden (live-app crop or
Storybook page), scaled to a common height, so layout/position/presence/text-format
diffs are obvious at a glance — the bug classes that pure color-sampling misses
(symbol shoved to the wrong side, a button that should be absent, "$" vs "USD").

Run this on EVERY screen before asking for review. If the composite shows a difference,
it's a finding to fix now, not after the user points at it.
"""
import sys
from PIL import Image, ImageDraw

def trim(im, bg_tol=12):
    """Crop to the content bounding box (drop flat margins)."""
    g = im.convert('RGB')
    px = g.load(); w, h = g.size
    bg = g.getpixel((1, 1))
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            p = px[x, y]
            if abs(p[0]-bg[0])+abs(p[1]-bg[1])+abs(p[2]-bg[2]) > bg_tol:
                minx = min(minx, x); miny = min(miny, y)
                maxx = max(maxx, x); maxy = max(maxy, y)
    if minx >= maxx: return im
    return im.crop((minx, miny, maxx+1, maxy+1))

def main():
    mine, golden, out = sys.argv[1], sys.argv[2], sys.argv[3]
    a = trim(Image.open(mine).convert('RGB'))
    b = trim(Image.open(golden).convert('RGB'))
    H = 760
    a = a.resize((round(a.width*H/a.height), H), Image.LANCZOS)
    b = b.resize((round(b.width*H/b.height), H), Image.LANCZOS)
    gap, label = 30, 26
    canvas = Image.new('RGB', (a.width+b.width+gap, H+label), (30, 30, 30))
    canvas.paste(a, (0, label)); canvas.paste(b, (a.width+gap, label))
    d = ImageDraw.Draw(canvas)
    d.text((4, 6), "MINE", fill=(255, 210, 90))
    d.text((a.width+gap+4, 6), "GOLDEN (truth)", fill=(120, 220, 120))
    canvas.save(out)
    print(f"composite -> {out}  (mine {a.width}px | golden {b.width}px @ {H}h)")

if __name__ == '__main__':
    main()
