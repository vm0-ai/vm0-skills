#!/usr/bin/env python3
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
LAYOUT_ROOT = ROOT / "assets" / "layouts"
GROUPS = [
    ("Orientation and closure", ["orientation/headline-cover","orientation/briefing-map","orientation/section-pivot","orientation/public-action-close"]),
    ("Text and evidence", ["text/claim-support","text/two-column-argument","text/three-fact-columns","text/bullet-hierarchy","text/action-checklist","text/source-quote","text/document-excerpt"]),
    ("Metrics and charts", ["data/single-stat","data/kpi-row","data/kpi-grid","data/data-table","data/ranked-bars","data/time-series","data/share-ring","data/scenario-range"]),
    ("Comparison and decision", ["comparison/balanced-split","comparison/before-after","comparison/benefit-risk","comparison/option-matrix","comparison/threshold-decision"]),
    ("Time and process", ["time/ordered-steps","time/milestone-timeline","time/phased-roadmap","time/rollout-lanes","time/handoff-flow","time/deadline-countdown"]),
    ("Systems and relationships", ["system/layered-system","system/decision-flow","system/hub-spoke","system/dependency-network"]),
    ("Geography and media", ["media/regional-map","media/flow-map","media/media-left","media/media-right","media/evidence-hero","media/evidence-grid"]),
]
PALETTES = {
    "navy-cobalt": {"canvas": "#0B111C", "header": "#16243B", "text": "#F3F6FA", "label": "#182943", "label_text": "#D9E3EF"},
    "monumental-minimal": {"canvas": "#E8EEF7", "header": "#FFFFFF", "text": "#16243B", "label": "#DCE4F0", "label_text": "#16243B"},
    "black-gold": {"canvas": "#090806", "header": "#17140D", "text": "#E5C467", "label": "#241E10", "label_text": "#E5C467"},
    "obsidian-champagne": {"canvas": "#07090C", "header": "#171B20", "text": "#F1EEE7", "label": "#22282E", "label_text": "#D7D4CD"},
    "petrol-brass": {"canvas": "#061B1D", "header": "#133438", "text": "#EFEAE0", "label": "#1C4548", "label_text": "#D2D7D2"},
    "parchment-oxblood": {"canvas": "#D8D0C4", "header": "#EDE7DC", "text": "#1C1B1A", "label": "#D0C2B0", "label_text": "#1C1B1A"},
    "porcelain-carbon": {"canvas": "#D9DCDA", "header": "#F0F1EE", "text": "#1B2227", "label": "#CCD2CF", "label_text": "#1B2227"},
}
COLS = 5
TILE = (360, 203)
LABEL_H = 42
HEADER_H = 58
LEFT = 34
TOP = 34
GAP_X = 18
GAP_Y = 18

parser = argparse.ArgumentParser()
parser.add_argument("--color-system", choices=PALETTES, default="navy-cobalt")
args = parser.parse_args()
colors = PALETTES[args.color_system]

def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()

rows = sum((len(ids) + COLS - 1) // COLS for _, ids in GROUPS)
width = LEFT * 2 + COLS * TILE[0] + (COLS - 1) * GAP_X
height = TOP * 2 + len(GROUPS) * HEADER_H + rows * (TILE[1] + LABEL_H) + (rows - len(GROUPS)) * GAP_Y
canvas = Image.new("RGB", (width, height), colors["canvas"])
draw = ImageDraw.Draw(canvas)
family_font = font(25, True)
label_font = font(15, True)
preview_root = LAYOUT_ROOT / "preview" / args.color_system
y = TOP
for family, ids in GROUPS:
    draw.rectangle((LEFT, y, width - LEFT, y + HEADER_H - 10), fill=colors["header"])
    draw.text((LEFT + 18, y + 10), family.upper(), font=family_font, fill=colors["text"])
    y += HEADER_H
    family_rows = (len(ids) + COLS - 1) // COLS
    for index, layout_id in enumerate(ids):
        row, col = divmod(index, COLS)
        x = LEFT + col * (TILE[0] + GAP_X)
        tile_y = y + row * (TILE[1] + LABEL_H + GAP_Y)
        filename = layout_id.replace("/", "--") + ".png"
        with Image.open(preview_root / filename) as source:
            tile = source.convert("RGB").resize(TILE, Image.Resampling.LANCZOS)
        canvas.paste(tile, (x, tile_y))
        draw.rectangle((x, tile_y + TILE[1], x + TILE[0], tile_y + TILE[1] + LABEL_H), fill=colors["label"])
        draw.text((x + 11, tile_y + TILE[1] + 11), layout_id, font=label_font, fill=colors["label_text"])
    y += family_rows * (TILE[1] + LABEL_H) + max(0, family_rows - 1) * GAP_Y

output = LAYOUT_ROOT / f"contact-sheet-{args.color_system}.jpg"
canvas.save(output, quality=92, optimize=True)
if args.color_system == "navy-cobalt":
    canvas.save(LAYOUT_ROOT / "contact-sheet.jpg", quality=92, optimize=True)
print(output)
