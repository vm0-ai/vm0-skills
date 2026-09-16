#!/usr/bin/env python3
"""Build a refined okou camera plan from a screen recording + .clicks.json sidecar.

Replaces the exploratory measure/design loop with one deterministic pass:
  measure (overlay artifacts, UI gaps) -> cluster clicks into beats -> solve each
  beat's rect against hard constraints -> schedule moves -> emit plan + report.

Usage: autoplan.py <recording.mp4> <recording.clicks.json> <out-plan.json>
"""
import json
import subprocess
import sys

# Renderer flags a click whose margin to the frame edge is too small. Empirically
# bracketed between 112 and 125 output px, so aim well clear of it.
MARGIN_OUT_PX = 155        # target margin; the renderer's own gate sits near 125
MARGIN_RELAXED = 134      # used only for beats pinned against a frame edge
BEAT_GAP_MS = 2600        # clicks farther apart than this start a new beat
MAX_ZOOM = 2.4            # comfortable tightest push-in
HARD_ZOOM = 3.2           # allowed only when an edge-adjacent click needs it
MIN_ZOOM = 1.45           # a beat that cannot hold this much zoom is split instead
SCENE_DELTA = 9.0         # mean per-block grey change that counts as a new screen
ARRIVE_LEAD_MS = 260      # a move must land this long before its first click
SETTLE_MS = 330           # and may not start until this long after the previous click
MOVE_MS = 700
WHITE = 242               # >= this is background for density profiles


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-show_entries", "format=duration",
         "-of", "json", path], capture_output=True, check=True).stdout
    d = json.loads(out)
    s = d["streams"][0]
    return int(s["width"]), int(s["height"]), float(d["format"]["duration"]) * 1000.0


def gray(path, ms, w, h):
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{ms/1000.0:.3f}", "-i", path, "-frames:v", "1",
         "-vf", "format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    return out[:w * h] if len(out) >= w * h else None


def find_overlay(path, w, h, times):
    """Rows at the top/bottom that stay dark in every sampled frame = capture overlay
    (recording control bar). Returns (top_limit, bottom_limit) in source px."""
    frames = [f for f in (gray(path, t, w, h) for t in times) if f]
    if not frames:
        return 0, h
    band = max(6, h // 20)

    def dark_row(f, y):
        """A capture overlay shows as one long contiguous dark run, which separates
        cleanly from ordinary UI; a plain pixel count does not."""
        row = f[y * w:(y + 1) * w]
        best = cur = 0
        for x in range(w):
            cur = cur + 1 if row[x] < 110 else 0
            if cur > best:
                best = cur
        return best >= w * 0.08

    top = 0
    for y in range(band):
        if all(dark_row(f, y) for f in frames):
            top = y + 1
        else:
            break
    bot = h
    for y in range(h - 1, h - band, -1):
        if all(dark_row(f, y) for f in frames):
            bot = y
        else:
            break
    return (top + 2 if top else 0), (bot - 2 if bot < h else h)


def signature(frame, w, h, n=14):
    """Coarse block-average fingerprint, used to tell one screen from another."""
    out = []
    for by in range(n):
        y0, y1 = by * h // n, (by + 1) * h // n
        for bx in range(n):
            x0, x1 = bx * w // n, (bx + 1) * w // n
            sy, sx = max(1, (y1 - y0) // 5), max(1, (x1 - x0) // 5)
            vals = [frame[y * w + x] for y in range(y0, y1, sy) for x in range(x0, x1, sx)]
            out.append(sum(vals) / max(1, len(vals)))
    return out


def sigdist(a, b):
    return sum(abs(p - q) for p, q in zip(a, b)) / len(a)


def col_empty(frame, w, h, y0, y1, step=4):
    """Columns carrying no content between two rows. A frame edge placed here cannot
    bisect a word or a card — which is what makes a crop look deliberate."""
    y0, y1 = max(0, int(y0)), min(h, int(y1))
    ys = range(y0, y1, max(1, (y1 - y0) // 60) if y1 > y0 else 1)
    return [all(frame[y * w + x] >= WHITE for y in ys) for x in range(w)]


def edge_cost(occ, pos, w):
    """0 when the edge sits in empty space, rising with the distance to the nearest."""
    pos = int(round(pos))
    if pos <= 0 or pos >= w - 1:
        return 0
    if occ[pos]:
        return 0
    for d in range(1, 90):
        if (pos - d >= 0 and occ[pos - d]) or (pos + d < w and occ[pos + d]):
            return d
    return 120


def row_empty(frame, w, h, x0, x1):
    x0, x1 = max(0, int(x0)), min(w, int(x1))
    xs = range(x0, x1, max(1, (x1 - x0) // 60) if x1 > x0 else 1)
    return [all(frame[y * w + x] >= WHITE for x in xs) for y in range(h)]


def unit_box(frame, w, h, cx, cy, y_min, y_max, gap=26):
    """The UI block the click belongs to: expand outward until a band of empty space
    that wide is crossed. Framing this block is what makes a shot read as deliberate,
    where centring on the bare click point slices whatever sits beside it."""
    y0, y1 = int(max(y_min, cy - 150)), int(min(y_max, cy + 150))
    occ = col_empty(frame, w, h, y0, y1)
    left, run = 0, 0
    for x in range(int(cx), -1, -1):
        run = run + 1 if occ[x] else 0
        if run >= gap:
            left = x + gap
            break
    right, run = w, 0
    for x in range(int(cx), w):
        run = run + 1 if occ[x] else 0
        if run >= gap:
            right = x - gap
            break
    rocc = row_empty(frame, w, h, left, right)
    top, run = int(y_min), 0
    for y in range(int(cy), int(y_min) - 1, -1):
        run = run + 1 if rocc[y] else 0
        if run >= gap:
            top = y + gap
            break
    bottom, run = int(y_max), 0
    for y in range(int(cy), int(y_max)):
        run = run + 1 if rocc[y] else 0
        if run >= gap:
            bottom = y - gap
            break
    return left, top, right, bottom


def grown_unit(frame, w, h, cx, cy, y_min, y_max):
    """Widen the tolerated gap until the block is big enough to frame. A small control
    such as a send button is otherwise its own unit, which anchors the shot onto the
    button and crops the content the click is about."""
    box = None
    for gap in (26, 44, 70, 104):
        box = unit_box(frame, w, h, cx, cy, y_min, y_max, gap)
        if (box[2] - box[0]) >= 0.33 * w or (box[3] - box[1]) >= 0.33 * h:
            break
    return box


def solve(beat, w, h, y_min, y_max, frame=None):
    """Pick the framing that clears the margin gate on every click of the beat, stays
    out of the capture overlay, and puts both side edges in empty space."""
    xs = [c[1] for c in beat]
    ys = [c[2] for c in beat]
    widths = sorted({int(w / z) for z in (MAX_ZOOM, 2.15, 1.9, 1.7, MIN_ZOOM)})
    best, best_score = None, None
    for width in widths + [None]:
        if width is None:                      # nothing inside the cap worked
            if best is not None:
                break
            # A click pinned against an edge caps the reachable margin. Relaxing it a
            # little (still clear of the gate) restores the freedom to place edges,
            # which buys more than the extra pixels of margin did.
            relaxed = [r for r in (_place(beat, w, h, y_min, y_max, ww, frame, xs, ys,
                                          MARGIN_RELAXED) for ww in widths) if r]
            if relaxed:
                return min(relaxed, key=lambda r: r[1])[0]
            # Score this path too. Returning the first placement that fits leaves the
            # hardest beat — the one already pinned against an edge — as the only shot
            # whose edges were never optimised.
            widths2 = sorted({int(w / z) for z in (HARD_ZOOM, 3.0, 2.85, 2.7, 2.6, 2.5)},
                             reverse=True)
            cands = [r for r in (_place(beat, w, h, y_min, y_max, ww, frame, xs, ys)
                                 for ww in widths2) if r]
            return min(cands, key=lambda r: r[1])[0] if cands else None
        r = _place(beat, w, h, y_min, y_max, width, frame, xs, ys)
        if r and (best_score is None or r[1] < best_score):
            best, best_score = r[0], r[1]
    return best


def _place(beat, w, h, y_min, y_max, width, frame, xs, ys, margin=MARGIN_OUT_PX):
    height = width * h / w
    if height > (y_max - y_min):
        return None
    m = margin * width / w                     # margin expressed in source px
    x_lo = max(0.0, max(xs) + m - width)
    x_hi = min(float(w - width), min(xs) - m)
    y_lo = max(float(y_min), max(ys) + m - height)
    y_hi = min(y_max - height, min(ys) - m)
    if x_lo > x_hi or y_lo > y_hi:
        return None
    # anchor on the UI block(s) the clicks belong to, not on the bare click points
    if frame:
        boxes = [grown_unit(frame, w, h, c[1], c[2], y_min, y_max) for c in beat]
        ax = (min(b[0] for b in boxes) + max(b[2] for b in boxes)) / 2
        ay = (min(b[1] for b in boxes) + max(b[3] for b in boxes)) / 2
    else:
        ax, ay = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    best = None
    y_cands = {min(max(ay - height / 2, y_lo), y_hi), y_lo, y_hi}
    for y in y_cands:
        occ = col_empty(frame, w, h, y, y + height) if frame else None
        cands = {min(max(ax - width / 2, x_lo), x_hi), x_lo, x_hi}
        if occ:                                # walk the feasible band for clean edges
            step = max(4, int((x_hi - x_lo) / 60) or 4)
            cands |= {float(v) for v in range(int(x_lo), int(x_hi) + 1, step)}
        for x in cands:
            if not (x_lo - 0.5 <= x <= x_hi + 0.5):
                continue
            cost = 0 if not occ else edge_cost(occ, x, w) + edge_cost(occ, x + width, w)
            # staying on the anchor dominates; clean edges buy only small corrections
            cost += 1400 * (abs((x + width / 2) - ax) / width
                            + abs((y + height / 2) - ay) / height)
            cost += (w / width) * -2            # mild preference for more zoom
            if best is None or cost < best[1]:
                best = ({"x": round(x, 3), "y": round(y, 3), "width": float(width)}, cost)
    return best


def main():
    vid, side, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    w, h, dur = probe(vid)
    sc = json.load(open(side))
    clicks = sorted(({"t": c["tMs"], "x": c["frame"]["x"], "y": c["frame"]["y"]}
                     for c in sc["clicks"]), key=lambda c: c["t"])

    y_min, y_max = find_overlay(vid, w, h, [dur * 0.05, dur * 0.5, dur * 0.95])
    print(f"source {w}x{h} {dur:.0f}ms   usable y {y_min}..{y_max}", file=sys.stderr)

    # Group clicks into beats: close in time AND holdable by one framing that still
    # reads as a push-in. Clicks scattered across the screen would otherwise force a
    # near-full frame, which is the automatic plan's failure, not a fix for it.
    def holdable(group):
        pts = [(c["t"], c["x"], c["y"]) for c in group]
        r = solve(pts, w, h, y_min, y_max)
        return r is not None and w / r["width"] >= MIN_ZOOM

    # A framing may only be held across clicks that share a screen. The modal opening
    # between two clicks is a cut, however close together they are.
    sigs, sigs_frames = {}, {}
    for c in clicks:
        f = gray(vid, c["t"], w, h)
        sigs_frames[c["t"]] = f
        sigs[c["t"]] = signature(f, w, h) if f else None

    beats, cur = [], [clicks[0]]
    for c in clicks[1:]:
        a, b = sigs.get(cur[-1]["t"]), sigs.get(c["t"])
        same_screen = (a is None or b is None or sigdist(a, b) <= SCENE_DELTA)
        if c["t"] - cur[-1]["t"] <= BEAT_GAP_MS and same_screen and holdable(cur + [c]):
            cur.append(c)
        else:
            beats.append(cur)
            cur = [c]
    beats.append(cur)

    keys, report = [], []
    for i, b in enumerate(beats):
        pts = [(c["t"], c["x"], c["y"]) for c in b]
        mid = b[len(b) // 2]["t"]
        f = sigs_frames.get(mid) or gray(vid, mid, w, h)
        rect = solve(pts, w, h, y_min, y_max, f)
        if rect is None:                       # fall back to the whole usable area
            width = min(w, (y_max - y_min) * w / h)
            rect = {"x": round((w - width) / 2, 3), "y": float(y_min), "width": round(width, 3)}
        keys.append({"rect": rect, "clickMs": b[0]["t"], "lastClickMs": b[-1]["t"],
                     "beat": i + 1, "clicks": len(b)})
        report.append((i + 1, len(b), rect, pts))

    # schedule: land before the first click of the beat, start after the previous one settles
    out_keys = []
    usable_w = min(w, (y_max - y_min) * w / h)
    open_rect = {"x": round((w - usable_w) / 2, 3), "y": float(y_min), "width": round(usable_w, 3)}
    out_keys.append({"id": "k000", "startMs": 0, "durationMs": 1, "rect": open_rect,
                     "reason": f"open inside the usable area (capture overlay occupies y<{y_min})"})
    prev_click = 0
    for n, k in enumerate(keys, 1):
        arrive = k["clickMs"] - ARRIVE_LEAD_MS
        start = max(prev_click + SETTLE_MS, arrive - MOVE_MS, 1)
        move_ms = max(320, min(MOVE_MS, arrive - start))
        out_keys.append({"id": f"k{n:03d}", "startMs": int(start), "durationMs": int(move_ms),
                         "rect": k["rect"], "clickMs": k["clickMs"],
                         "reason": f"beat {k['beat']}: hold one framing across {k['clicks']} click(s)"})
        prev_click = k["lastClickMs"]
    close_start = min(dur - 1100, prev_click + 700)
    if close_start > out_keys[-1]["startMs"] + out_keys[-1]["durationMs"] + 200:
        out_keys.append({"id": "k999", "startMs": int(close_start), "durationMs": 800,
                         "rect": open_rect, "reason": "close on the establishing framing"})

    plan = {"version": 2, "algorithm": "click-camera-v2",
            "source": {"durationMs": int(dur), "width": w, "height": h, "frameRate": 30},
            "content": sc.get("recording", {}).get("content", {}).get("pixelRect",
                       {"x": 0, "y": 0, "width": w, "height": h}),
            "shots": [{"id": "shot-001", "startMs": 0, "endMs": int(dur),
                       "baseZoom": round(w / usable_w, 3), "keys": out_keys}]}
    json.dump(plan, open(out_path, "w"), indent=1)

    # verification report: every click's margin under the framing that is live when it fires
    print(f"\n{'click':>7} {'beat':>4} {'zoom':>5} {'min margin (out px)':>20}")
    worst = []
    for c in clicks:
        act = None
        for k in out_keys:
            if k["startMs"] + k["durationMs"] <= c["t"]:
                act = k
        r = act["rect"]
        ww = r["width"]
        hh = ww * h / w
        Z = w / ww
        m = min((c["x"] - r["x"]) * Z, (r["x"] + ww - c["x"]) * Z,
                (c["y"] - r["y"]) * Z, (r["y"] + hh - c["y"]) * Z)
        worst.append(m)
        print(f"{c['t']:>7} {act['id']:>4} {Z:5.2f} {m:20.0f}")
    print(f"\nkeys={len(out_keys)} beats={len(beats)} "
          f"weakest margin={min(worst):.0f}px (gate ~125) "
          f"below-gate={sum(1 for m in worst if m < 125)}", file=sys.stderr)


if __name__ == "__main__":
    main()
