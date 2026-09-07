#!/usr/bin/env python3
"""Render a copy-specific kinetic collage motion guide with ffmpeg only."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
import unicodedata
from pathlib import Path


IVORY = "efe9da"
BLACK = "11100e"
WHITE = "f8f6ee"


def parse_args() -> argparse.Namespace:
    skill_dir = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", type=Path, default=skill_dir / "assets" / "motion-guide-base.mp4")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--opener", required=True)
    parser.add_argument("--pivot", required=True)
    parser.add_argument("--claim-one", required=True)
    parser.add_argument("--claim-two", required=True)
    parser.add_argument("--claim-three", required=True)
    parser.add_argument("--catalog", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--subtitle", default="")
    return parser.parse_args()


def validate_copy(label: str, value: str) -> None:
    if not value.strip():
        raise SystemExit(f"{label} must not be empty")
    if "\n" in value or "\r" in value:
        raise SystemExit(f"{label} must be one line")
    if len(value) > 40:
        raise SystemExit(f"{label} must be 40 characters or fewer")


def visual_units(value: str) -> float:
    units = 0.0
    for char in value:
        if char.isspace():
            units += 0.38
        elif unicodedata.east_asian_width(char) in {"W", "F"}:
            units += 1.0
        else:
            units += 0.62
    return max(units, 1.0)


def fitted_size(value: str, max_width: int, preferred: int, minimum: int = 24) -> int:
    estimated = int(max_width / (visual_units(value) * 0.76))
    return max(minimum, min(preferred, estimated))


def find_font(copy: str) -> str:
    needs_cjk = any(unicodedata.east_asian_width(char) in {"W", "F"} for char in copy)
    candidates = (
        [
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        ]
        if needs_cjk
        else [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
        ]
    )
    for candidate in candidates:
        if Path(candidate).is_file():
            return candidate
    if shutil.which("fc-match"):
        family = "Noto Sans CJK SC:style=Bold" if needs_cjk else "sans-serif:style=Bold"
        result = subprocess.run(
            ["fc-match", "-f", "%{file}", family],
            check=True,
            capture_output=True,
            text=True,
        )
        candidate = result.stdout.strip()
        if candidate and Path(candidate).is_file():
            return candidate
    raise SystemExit("No bold sans-serif font found")


def probe_dimensions(path: Path) -> tuple[int, int]:
    if not shutil.which("ffprobe"):
        raise SystemExit("ffprobe is required")
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    stream = json.loads(result.stdout)["streams"][0]
    return int(stream["width"]), int(stream["height"])


def fade_expression(start: float, end: float, ramp: float = 0.16) -> str:
    return (
        f"if(lt(t,{start + ramp:.3f}),(t-{start:.3f})/{ramp:.3f},"
        f"if(gt(t,{end - ramp:.3f}),({end:.3f}-t)/{ramp:.3f},1))"
    )


def drawtext_filter(
    textfile: Path,
    fontfile: str,
    size: int,
    y: int,
    start: float,
    end: float,
    *,
    color: str = BLACK,
    outline: bool = False,
    scale: float = 1.0,
) -> str:
    size = max(1, round(size * scale))
    y = round(y * scale)
    border_width = max(2, round(3 * scale))
    border = f":borderw={border_width}:bordercolor=0x{BLACK}" if outline else ""
    shadow_offset = max(1, round(2 * scale))
    shadow = "" if outline else f":shadowcolor=black@0.16:shadowx={shadow_offset}:shadowy={shadow_offset}"
    fill = IVORY if outline else color
    alpha = fade_expression(start, end)
    return (
        "drawtext="
        f"fontfile='{fontfile}':textfile='{textfile.as_posix()}':reload=0:"
        f"fontsize={size}:fontcolor=0x{fill}:x=(w-text_w)/2:y={y}:"
        f"alpha='{alpha}':enable='between(t,{start:.3f},{end:.3f})'"
        f"{border}{shadow}"
    )


def main() -> None:
    args = parse_args()
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is required")
    if not args.base.is_file():
        raise SystemExit(f"Motion base not found: {args.base}")

    fields = {
        "opener": args.opener,
        "pivot": args.pivot,
        "claim_one": args.claim_one,
        "claim_two": args.claim_two,
        "claim_three": args.claim_three,
        "catalog": args.catalog,
        "title": args.title,
        "subtitle": args.subtitle,
    }
    for label, value in fields.items():
        if label == "subtitle" and not value:
            continue
        validate_copy(label, value)

    fontfile = find_font(" ".join(fields.values()))
    _, base_height = probe_dimensions(args.base)
    render_scale = base_height / 768.0
    args.output.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="kinetic-copy-") as tmp:
        temp_dir = Path(tmp)
        files: dict[str, Path] = {}
        for label, value in fields.items():
            path = temp_dir / f"{label}.txt"
            path.write_text(value, encoding="utf-8")
            files[label] = path

        filters = [
            drawtext_filter(files["opener"], fontfile, fitted_size(args.opener, 720, 90), 312, 0.25, 0.98, outline=True, scale=render_scale),
            drawtext_filter(files["opener"], fontfile, fitted_size(args.opener, 720, 90), 312, 0.80, 2.08, scale=render_scale),
            drawtext_filter(files["pivot"], fontfile, fitted_size(args.pivot, 430, 96), 338, 1.70, 3.28, color=WHITE, scale=render_scale),
            drawtext_filter(files["claim_one"], fontfile, fitted_size(args.claim_one, 760, 80), 342, 2.95, 4.02, outline=True, scale=render_scale),
            drawtext_filter(files["claim_one"], fontfile, fitted_size(args.claim_one, 760, 80), 342, 3.68, 5.82, scale=render_scale),
            drawtext_filter(files["claim_two"], fontfile, fitted_size(args.claim_two, 640, 82), 350, 5.28, 6.18, outline=True, scale=render_scale),
            drawtext_filter(files["claim_two"], fontfile, fitted_size(args.claim_two, 640, 82), 350, 5.88, 7.02, scale=render_scale),
            drawtext_filter(files["claim_three"], fontfile, fitted_size(args.claim_three, 650, 78), 370, 6.52, 7.78, outline=True, scale=render_scale),
            drawtext_filter(files["claim_three"], fontfile, fitted_size(args.claim_three, 650, 78), 370, 7.42, 9.02, scale=render_scale),
            drawtext_filter(files["catalog"], fontfile, fitted_size(args.catalog, 690, 92), 358, 8.42, 9.72, outline=True, scale=render_scale),
            drawtext_filter(files["catalog"], fontfile, fitted_size(args.catalog, 690, 92), 358, 9.38, 11.14, scale=render_scale),
            drawtext_filter(files["title"], fontfile, fitted_size(args.title, 760, 104), 354, 10.42, 15.0, scale=render_scale),
        ]
        if args.subtitle:
            filters.append(
                drawtext_filter(files["subtitle"], fontfile, fitted_size(args.subtitle, 620, 34, 20), 466, 10.52, 15.0, scale=render_scale)
            )
        filters.append(
            drawtext_filter(files["catalog"], fontfile, fitted_size(args.catalog, 660, 118), 600, 10.62, 15.0, color="2b2a27", scale=render_scale)
        )

        command = [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(args.base),
            "-vf",
            ",".join(filters),
            "-map",
            "0:v:0",
            "-map",
            "0:a?",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "18",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "copy",
            "-movflags",
            "+faststart",
            str(args.output),
        ]
        subprocess.run(command, check=True)

    print(args.output.resolve())


if __name__ == "__main__":
    main()
