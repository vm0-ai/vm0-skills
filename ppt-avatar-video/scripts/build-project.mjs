#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function fail(message) {
  process.stderr.write(`build-project: ${message}\n`);
  process.exit(1);
}

function parseFlag(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function finiteNumber(value, label, { min = -Infinity, max = Infinity } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    fail(`${label} must be a finite number between ${min} and ${max}`);
  }
  return number;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatSeconds(value) {
  return Number(value.toFixed(6)).toString();
}

const manifestArg = parseFlag("--manifest");
const outArg = parseFlag("--out");
if (!manifestArg || !outArg) {
  fail(
    "usage: build-project.mjs --manifest composition-input.json --out PROJECT_DIR",
  );
}

const manifestPath = path.resolve(manifestArg);
const outDir = path.resolve(outArg);
if (!existsSync(manifestPath)) fail(`manifest not found: ${manifestArg}`);

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  fail(`invalid manifest JSON: ${error.message}`);
}

const id = String(manifest.id || "deck-video");
if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(id)) {
  fail("id must be a lowercase kebab-case identifier of at most 63 characters");
}

const width = finiteNumber(manifest.width ?? 1920, "width", {
  min: 16,
  max: 7680,
});
const height = finiteNumber(manifest.height ?? 1080, "height", {
  min: 16,
  max: 7680,
});
const fps = finiteNumber(manifest.fps ?? 30, "fps", { min: 1, max: 240 });
const background = String(manifest.background || "#000000");
const hyperframesVersion = String(manifest.hyperframesVersion || "0.8.26");

if (!Array.isArray(manifest.slides) || manifest.slides.length === 0) {
  fail("slides must be a non-empty array");
}

mkdirSync(outDir, { recursive: true });
const outPrefix = `${outDir}${path.sep}`;

function validateAsset(relativePath, label) {
  if (
    typeof relativePath !== "string" ||
    !relativePath ||
    path.isAbsolute(relativePath)
  ) {
    fail(`${label} must be a project-relative path`);
  }
  const absolute = path.resolve(outDir, relativePath);
  if (!absolute.startsWith(outPrefix) || !existsSync(absolute)) {
    fail(`${label} is missing or outside the project: ${relativePath}`);
  }
  return relativePath.split(path.sep).join("/");
}

const slides = manifest.slides.map((slide, index) => ({
  path: validateAsset(slide.path, `slides[${index}].path`),
  duration: finiteNumber(slide.duration, `slides[${index}].duration`, {
    min: 0.1,
    max: 3600,
  }),
}));

const presenter = manifest.presenter;
if (!presenter || typeof presenter !== "object") fail("presenter is required");

const presenterPath = validateAsset(presenter.path, "presenter.path");
const audioPath = validateAsset(
  presenter.audioPath || presenter.path,
  "presenter.audioPath",
);
const sourceWidth = finiteNumber(
  presenter.sourceWidth,
  "presenter.sourceWidth",
  { min: 1 },
);
const sourceHeight = finiteNumber(
  presenter.sourceHeight,
  "presenter.sourceHeight",
  { min: 1 },
);
const bbox = presenter.bbox || {};
const bboxX = finiteNumber(bbox.x, "presenter.bbox.x", { min: 0 });
const bboxY = finiteNumber(bbox.y, "presenter.bbox.y", { min: 0 });
const bboxWidth = finiteNumber(bbox.width, "presenter.bbox.width", { min: 1 });
const bboxHeight = finiteNumber(bbox.height, "presenter.bbox.height", {
  min: 1,
});
if (bboxX + bboxWidth > sourceWidth || bboxY + bboxHeight > sourceHeight) {
  fail("presenter.bbox exceeds the source video dimensions");
}

const visibleWidthFraction = finiteNumber(
  presenter.visibleWidthFraction ?? 0.14,
  "presenter.visibleWidthFraction",
  { min: 0.01, max: 1 },
);
const anchor = String(presenter.anchor || "bottom-right");
if (!new Set(["bottom-right", "bottom-left"]).has(anchor)) {
  fail("presenter.anchor must be bottom-right or bottom-left");
}

const totalDuration = slides.reduce((sum, slide) => sum + slide.duration, 0);
const targetVisibleWidth = width * visibleWidthFraction;
const scale = targetVisibleWidth / bboxWidth;
const renderedWidth = sourceWidth * scale;
const renderedHeight = sourceHeight * scale;
const bottomOffset = -(sourceHeight - bboxY - bboxHeight) * scale;
const horizontalRule =
  anchor === "bottom-right"
    ? `right: ${formatSeconds(-(sourceWidth - bboxX - bboxWidth) * scale)}px;`
    : `left: ${formatSeconds(-bboxX * scale)}px;`;
const clipTop = (bboxY / sourceHeight) * 100;
const clipRight = ((sourceWidth - bboxX - bboxWidth) / sourceWidth) * 100;
const clipBottom = ((sourceHeight - bboxY - bboxHeight) / sourceHeight) * 100;
const clipLeft = (bboxX / sourceWidth) * 100;

let cursor = 0;
const slideTags = slides
  .map((slide, index) => {
    const start = cursor;
    cursor += slide.duration;
    return `      <img id="slide-${String(index + 1).padStart(3, "0")}" class="clip slide" src="${escapeHtml(slide.path)}" alt="Slide ${index + 1}" data-start="${formatSeconds(start)}" data-duration="${formatSeconds(slide.duration)}" />`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${width}, height=${height}" />
    <title>${escapeHtml(id)}</title>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: ${escapeHtml(background)}; }
      #root { position: relative; width: ${width}px; height: ${height}px; overflow: hidden; isolation: isolate; background: ${escapeHtml(background)}; }
      .clip { position: absolute; }
      .slide { inset: 0; z-index: 1; width: ${width}px; height: ${height}px; object-fit: contain; background: ${escapeHtml(background)}; }
      .presenter-video {
        z-index: 20;
        ${horizontalRule}
        bottom: ${formatSeconds(bottomOffset)}px;
        width: ${formatSeconds(renderedWidth)}px;
        height: ${formatSeconds(renderedHeight)}px;
        clip-path: inset(${formatSeconds(clipTop)}% ${formatSeconds(clipRight)}% ${formatSeconds(clipBottom)}% ${formatSeconds(clipLeft)}%);
        pointer-events: none;
      }
      .presenter-audio { width: 0; height: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-no-timeline data-start="0" data-duration="${formatSeconds(totalDuration)}" data-width="${width}" data-height="${height}">
${slideTags}
      <video id="presenter-video" class="clip presenter-video" src="${escapeHtml(presenterPath)}" data-start="0" data-duration="${formatSeconds(totalDuration)}" data-track-index="20" data-layout-allow-overlap data-layout-allow-overflow muted playsinline preload="auto" aria-label="Presenter"></video>
      <audio id="presenter-audio" class="clip presenter-audio" src="${escapeHtml(audioPath)}" data-start="0" data-duration="${formatSeconds(totalDuration)}" data-track-index="30" data-volume="1" preload="auto"></audio>
    </div>
  </body>
</html>
`;

const packageJson = {
  name: id,
  private: true,
  type: "module",
  scripts: {
    dev: `npx --yes hyperframes@${hyperframesVersion} preview`,
    check: `npx --yes hyperframes@${hyperframesVersion} check`,
    render: `npx --yes hyperframes@${hyperframesVersion} render`,
    publish: `npx --yes hyperframes@${hyperframesVersion} publish`,
  },
};

const hyperframesJson = {
  $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
  paths: {
    blocks: "compositions",
    components: "compositions/components",
    assets: "assets",
  },
  media: { autoProxy: true },
  authoringSkill: "ppt-avatar-video",
  registryItems: [],
};

writeFileSync(path.join(outDir, "index.html"), html);
writeFileSync(
  path.join(outDir, "index.motion.json"),
  `${JSON.stringify(
    {
      duration: totalDuration,
      assertions: [{ kind: "appearsBy", selector: "#slide-001", bySec: 0.1 }],
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  path.join(outDir, "package.json"),
  `${JSON.stringify(packageJson, null, 2)}\n`,
);
writeFileSync(
  path.join(outDir, "hyperframes.json"),
  `${JSON.stringify(hyperframesJson, null, 2)}\n`,
);
writeFileSync(
  path.join(outDir, "meta.json"),
  `${JSON.stringify({ id, name: id, createdAt: new Date().toISOString() }, null, 2)}\n`,
);

process.stdout.write(
  `${JSON.stringify(
    {
      project: outDir,
      slides: slides.length,
      duration: totalDuration,
      fps,
      presenter: {
        anchor,
        visibleWidthFraction,
        targetVisibleWidth,
        scale,
        renderedWidth,
        renderedHeight,
      },
    },
    null,
    2,
  )}\n`,
);
