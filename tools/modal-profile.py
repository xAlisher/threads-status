#!/usr/bin/env python3
"""modal-profile.py profile <png>            — structural fingerprint of a modal
   modal-profile.py diff <mine.png> <golden.png>  — band-by-band discrepancy table

Compute-victory by measurement, not eyeballing. Trims to the modal, then scans rows to
produce a 1-D structural profile: contiguous horizontal BANDS (runs of one dominant color)
and TEXT rows (high horizontal variance). Comparing two profiles surfaces, mechanically:
  - a band that exists in one render but not the other (extra/missing element)
  - a band whose bg color differs (wrong fill/token)
  - vertical proportion shifts (an element taller/shorter than source)
This catches the layout/presence/color classes that source-reading alone misses.
"""
import sys, json
from PIL import Image
import numpy as np

def trim(im, tol=14):
    a = np.asarray(im.convert('RGB')).astype(int)
    bg = a[1, 1]
    mask = np.abs(a - bg).sum(2) > tol
    ys, xs = np.where(mask)
    if len(xs) == 0: return im
    return im.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1))

def profile(path):
    im = trim(Image.open(path).convert('RGB'))
    a = np.asarray(im).astype(int)
    h, w = a.shape[:2]
    rows = []
    for y in range(h):
        row = a[y]
        # dominant color = mean of the modal-ish majority (median is robust to text ink)
        med = np.median(row, axis=0).astype(int)
        # text presence = horizontal variance (glyph ink against bg)
        var = int(np.abs(row - med).sum(1).mean())
        rows.append((tuple(med), var))
    # collapse into bands of similar dominant color
    bands = []
    cy0, ccol = 0, rows[0][0]
    def close(a, b): return sum(abs(x-y) for x, y in zip(a, b)) < 24
    for y in range(1, h):
        if not close(rows[y][0], ccol):
            bands.append({"y0": cy0, "y1": y, "h": y-cy0,
                          "color": "#%02X%02X%02X" % ccol,
                          "text_rows": sum(1 for yy in range(cy0, y) if rows[yy][1] > 28)})
            cy0, ccol = y, rows[y][0]
    bands.append({"y0": cy0, "y1": h, "h": h-cy0, "color": "#%02X%02X%02X" % ccol,
                  "text_rows": sum(1 for yy in range(cy0, h) if rows[yy][1] > 28)})
    # keep only bands >= 4px tall (drop 1px AA seams) but report dividers separately
    sig = [b for b in bands if b["h"] >= 4]
    return {"size": [w, h], "bands": sig}

def diff(mine, golden):
    pm, pg = profile(mine), profile(golden)
    hm, hg = pm["size"][1], pg["size"][1]
    print(f"MINE {pm['size']}  vs  GOLDEN {pg['size']}   ({len(pm['bands'])} vs {len(pg['bands'])} bands)\n")
    print(f"{'band%':>6} | {'MINE color  h%  txt':<24} | {'GOLDEN color  h%  txt':<24} | flag")
    print("-"*78)
    # align by normalized vertical position (band center / total height)
    def center(b, H): return (b["y0"]+b["y1"])/2/H
    gi = 0
    for b in pm["bands"]:
        cm = center(b, hm)
        # nearest golden band by normalized center
        gb = min(pg["bands"], key=lambda x: abs(center(x, hg)-cm))
        cg = center(gb, hg)
        coldiff = sum(abs(int(b["color"][i:i+2],16)-int(gb["color"][i:i+2],16)) for i in (1,3,5))
        hmp, hgp = round(b["h"]/hm*100), round(gb["h"]/hg*100)
        flags = []
        if coldiff > 24: flags.append(f"COLOR Δ{coldiff}")
        if abs(cm-cg) > 0.06: flags.append("POS shift")
        if abs(hmp-hgp) > 4: flags.append(f"HEIGHT {hmp}vs{hgp}%")
        print(f"{cm*100:5.0f}% | {b['color']}  {hmp:>2}%  {b['text_rows']:>2}        | "
              f"{gb['color']}  {hgp:>2}%  {gb['text_rows']:>2}        | {', '.join(flags) or 'ok'}")

if __name__ == '__main__':
    if sys.argv[1] == 'profile':
        print(json.dumps(profile(sys.argv[2]), indent=1))
    else:
        diff(sys.argv[2], sys.argv[3])
