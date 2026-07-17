#!/usr/bin/env python3
"""element-map.py map  <png>                  — list every text row + element with positions
   element-map.py diff <mine.png> <golden.png> — match elements, flag position/alignment diffs

The POSITION layer the band/color differs lacked. Detects elements via connected components
(scipy.ndimage), groups glyphs into rows then into elements, and reports each element's
normalized position AND its vertical alignment within its row. That last metric is what
catches the symbol-on-wrong-side / symbol-too-high class (e.g. "ETH" sitting at the top of
the number instead of its baseline) — a shift entirely inside one color band that band/color
diffing cannot see. No OCR needed; matches rows by vertical order, elements left-to-right.
"""
import sys, json
import numpy as np
from PIL import Image
from scipy import ndimage

def trim(im, tol=14):
    a = np.asarray(im.convert('RGB')).astype(int); bg = a[1, 1]
    m = np.abs(a - bg).sum(2) > tol; ys, xs = np.where(m)
    return im if len(xs) == 0 else im.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1))

def element_map(path):
    im = trim(Image.open(path).convert('RGB'))
    a = np.asarray(im).astype(int); h, w = a.shape[:2]
    lum = a.mean(2)
    # foreground = differs from its ROW's median (handles multiple bg bands: modal vs black panel)
    rowmed = np.median(lum, axis=1, keepdims=True)
    mask = np.abs(lum - rowmed) > 40
    # connect glyph strokes within an element: dilate horizontally a little, vertically tiny
    closed = ndimage.binary_dilation(mask, np.ones((3, 7)))
    lbl, n = ndimage.label(closed)
    comps = []
    for sl in ndimage.find_objects(lbl):
        if sl is None: continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if (x1-x0) < 3 or (y1-y0) < 4: continue          # drop noise
        comps.append([x0, y0, x1, y1])
    # group components into ROWS by vertical overlap
    comps.sort(key=lambda c: (c[1]+c[3])/2)
    rows = []
    for c in comps:
        cy = (c[1]+c[3])/2
        for r in rows:
            if r['y0'] <= cy <= r['y1']:                  # vertical center falls in an existing row
                r['c'].append(c); r['y0'] = min(r['y0'], c[1]); r['y1'] = max(r['y1'], c[3]); break
        else:
            rows.append({'y0': c[1], 'y1': c[3], 'c': [c]})
    # within each row, merge horizontally-near components OF SIMILAR HEIGHT into elements
    out = []
    for r in sorted(rows, key=lambda r: r['y0']):
        cs = sorted(r['c'], key=lambda c: c[0])
        elems = []
        for c in cs:
            ch = c[3]-c[1]
            if elems:
                p = elems[-1]; ph = p[3]-p[1]
                gap = c[0]-p[2]
                if gap < max(10, ch*0.6) and abs(ch-ph) < max(ph, ch)*0.45:   # near + similar height
                    p[0]=min(p[0],c[0]); p[1]=min(p[1],c[1]); p[2]=max(p[2],c[2]); p[3]=max(p[3],c[3]); continue
            elems.append(list(c))
        ry0 = min(e[1] for e in elems); ry1 = max(e[3] for e in elems); rh = ry1-ry0 or 1
        out.append({
            "row_y": [ry0, ry1], "h": ry1-ry0,
            "elements": [{
                "x_frac": round((e[0]+e[2])/2/w, 3),          # horizontal position (0..1 of width)
                "w": e[2]-e[0], "h": e[3]-e[1],
                "valign": round(((e[1]+e[3])/2 - ry0)/rh, 2),  # vcenter within row: 0=top,1=bottom
            } for e in sorted(elems, key=lambda e: e[0])]
        })
    return {"size": [w, h], "rows": out}

def diff(mine, golden):
    pm, pg = element_map(mine), element_map(golden)
    print(f"MINE {pm['size']}  ({len(pm['rows'])} rows)   vs   GOLDEN {pg['size']}  ({len(pg['rows'])} rows)\n")
    Hm, Hg = pm['size'][1], pg['size'][1]
    used = set()
    for rm in pm['rows']:
        cm = (rm['row_y'][0]+rm['row_y'][1])/2/Hm
        # nearest golden row by normalized vertical center
        cand = [(abs((rg['row_y'][0]+rg['row_y'][1])/2/Hg - cm), i) for i, rg in enumerate(pg['rows'])]
        cand.sort(); gi = cand[0][1] if cand else None
        rg = pg['rows'][gi] if gi is not None else None
        print(f"row @{cm*100:4.0f}%  ({len(rm['elements'])} elem) vs ({len(rg['elements']) if rg else 0})")
        if not rg: continue
        for k, em in enumerate(rm['elements']):
            if k >= len(rg['elements']):
                print(f"    el{k}: MINE x{em['x_frac']} valign{em['valign']}  | GOLDEN: missing  <-- EXTRA"); continue
            eg = rg['elements'][k]
            flags = []
            if abs(em['valign']-eg['valign']) > 0.12: flags.append(f"VALIGN {em['valign']} vs {eg['valign']}")
            if abs(em['x_frac']-eg['x_frac']) > 0.05: flags.append(f"X {em['x_frac']} vs {eg['x_frac']}")
            print(f"    el{k}: valign {em['valign']}/{eg['valign']}  x {em['x_frac']}/{eg['x_frac']}  "
                  f"{'  <-- '+', '.join(flags) if flags else 'ok'}")

if __name__ == '__main__':
    if sys.argv[1] == 'map': print(json.dumps(element_map(sys.argv[2]), indent=1))
    else: diff(sys.argv[2], sys.argv[3])
