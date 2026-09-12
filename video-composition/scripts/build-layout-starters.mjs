#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(skillRoot, "../..");
const sourcePath = path.resolve(process.argv[2] || path.join(workspaceRoot, "video-composition-layouts/index.html"));
const outputRoot = path.join(skillRoot, "assets/layouts/source");
const routerPath = path.join(skillRoot, "references/ROUTER.md");

if (!fs.existsSync(sourcePath)) throw new Error(`Missing rendered 40-layout source: ${sourcePath}`);

const source = fs.readFileSync(sourcePath, "utf8");
const router = fs.readFileSync(routerPath, "utf8");
const rows = new Map([...router.matchAll(/^\| `([a-z]+\/[a-z0-9-]+)` \|.*$/gm)].map(match => [match[1], match[0]]));
const pattern = /<section id="scene-([^"]+)"[\s\S]*?data-layout-id="([^"]+)"[\s\S]*?<\/section>\s*(<div[\s\S]*?<\/div>)/g;
const matches = [...source.matchAll(pattern)];

if (matches.length !== 40) throw new Error(`Expected 40 rendered layouts, found ${matches.length}.`);
fs.mkdirSync(outputRoot, { recursive: true });
for (const filename of fs.readdirSync(outputRoot)) {
  if (/^[a-z]+(?:-|--)[a-z0-9-]+\.(?:html|motion\.json)$/.test(filename)) fs.rmSync(path.join(outputRoot, filename));
}

for (const match of matches) {
  const [, donorStem, layoutId, rawMount] = match;
  const stem = layoutId.replace("/", "--");
  const row = rows.get(layoutId);
  if (!row) throw new Error(`Router row is missing for ${layoutId}.`);
  const cells = row.split("|").map(value => value.trim());
  const registryCode = cells[4].match(/^(C|B|M)\b/)?.[1];
  const presenterPolicy = cells[6] || "optional";
  const duration = Number(rawMount.match(/data-duration="([^"]+)"/)?.[1]);
  const registryItem = rawMount.match(/data-registry-item="([^"]+)"/)?.[1];
  const presenterSide = match[0].match(/presenter-(left|right)/)?.[1] || "right";
  if (!registryCode || !Number.isFinite(duration) || !registryItem) throw new Error(`Incomplete rendered contract for ${layoutId}.`);

  let mount = rawMount
    .replace(/id="mount-[^"]+"/, 'id="vc-official-mount" data-vc-content-slot="official"')
    .replace(/data-start="[^"]+"/, 'data-start="0"');
  if (layoutId === "text/source-quote") mount = mount.replace('"accent":"blue"', '"accent":"violet"');
  const compositionId = `vc-layout-${donorStem}`;
  const html = `<!doctype html>
<!-- Executable layout starter. Edit only the marked official content slot. -->
<html lang="en" data-layout-id="${layoutId}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="assets/runtime/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/video-composition/stage.css" />
    <link rel="stylesheet" href="assets/video-composition/content-font.css" />
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: var(--palette-field); }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: var(--palette-field); }
      .official-mount { position: absolute; inset: 0; z-index: 1; width: 1920px; height: 1080px; overflow: hidden; --bg: var(--stage-bg); --fg: var(--stage-ink); --surface: var(--stage-panel); --border: var(--stage-support); --muted: var(--stage-muted); --brand: var(--stage-accent); --accent: var(--stage-accent); --accent-2: var(--stage-signal); --font-display: var(--stage-font-display); --font-body: var(--stage-font-body); --font-mono: var(--stage-font-mono); }
      #root[data-presenter="on"][data-presenter-side="right"] .official-mount { left: 0; right: auto; width: 1340px; }
      #root[data-presenter="on"][data-presenter-side="left"] .official-mount { left: auto; right: 0; width: 1340px; }
      .presenter-slot { position: absolute; z-index: 2; bottom: 0; ${presenterSide}: 36px; width: 520px; height: 900px; display: grid; align-items: end; justify-items: center; pointer-events: none; }
      .presenter-slot .presenter-media { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; }
    </style>
  </head>
  <body>
    <main id="root" class="vc-frame vc-layout-root" data-composition-id="${compositionId}" data-duration="${duration}" data-width="1920" data-height="1080" data-presenter="off" data-presenter-side="${presenterSide}" data-presenter-policy="${presenterPolicy}" data-registry-code="${registryCode}" data-registry-item="${registryItem}">
      <!-- CONTENT_SLOT_BEGIN: keep the official mount; replace its variable values or edit its scene-specific official source. -->
${mount.split("\n").map(line => `      ${line}`).join("\n")}
      <!-- CONTENT_SLOT_END -->
      <!-- PRESENTER_SLOT_BEGIN -->
      <aside class="presenter-slot" data-vc-presenter-slot="${presenterSide}" data-presenter-media="static"><img class="presenter-media" src="assets/video-composition/presenters/p1.png" alt="" /></aside>
      <!-- PRESENTER_SLOT_END -->
    </main>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["${compositionId}"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
  const motion = {
    duration,
    assertions: [{ kind: "appearsBy", selector: "#vc-official-mount", bySec: Number(Math.min(1, duration * 0.25).toFixed(3)) }],
  };
  fs.writeFileSync(path.join(outputRoot, `${stem}.html`), html);
  fs.writeFileSync(path.join(outputRoot, `${stem}.motion.json`), `${JSON.stringify(motion, null, 2)}\n`);
}

console.log(`Built ${matches.length} executable layout starters in ${outputRoot}`);
