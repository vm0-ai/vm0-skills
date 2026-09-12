#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = fs.readFileSync(path.join(root, "references", "LAYOUT-CATALOG.md"), "utf8");
const expectedIds = [...catalog.matchAll(/^### ([a-z]+\/[a-z0-9-]+)$/gm)].map(match => match[1]);
const allowedColorSystems = [
  "navy-cobalt",
  "monumental-minimal",
  "black-gold",
  "obsidian-champagne",
  "petrol-brass",
  "parchment-oxblood",
  "porcelain-carbon",
];

function usage(code = 0) {
  console.log("Usage: node scripts/render-layout-previews.mjs --project <validated-hyperframes-project> [--color-systems <comma-separated-built-in-names>] [--python <python-with-pillow>]");
  console.log("The project must contain 40 scene elements with data-layout-id, data-start, and data-duration.");
  process.exit(code);
}

function run(command, args, cwd, label) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", stdio: "inherit" });
  if (result.error || result.status !== 0) throw new Error(`${label} failed.`);
}

function projectColorSystem(project, html) {
  const receipt = path.join(project, ".style-reference/video-composition/COLOR-SYSTEM.json");
  if (fs.existsSync(receipt)) {
    try {
      const name = JSON.parse(fs.readFileSync(receipt, "utf8")).name;
      if (allowedColorSystems.includes(name)) return name;
    } catch {}
  }
  return html.match(/\bdata-color-system="([^"]+)"/)?.[1] || "navy-cobalt";
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) usage(0);
const projectIndex = args.indexOf("--project");
const projectArg = projectIndex >= 0 ? args[projectIndex + 1] : null;
const systemsIndex = args.indexOf("--color-systems");
const pythonIndex = args.indexOf("--python");
const python = pythonIndex >= 0 ? args[pythonIndex + 1] : "python3";
const colorSystems = systemsIndex >= 0
  ? (args[systemsIndex + 1] || "").split(",").map(value => value.trim()).filter(Boolean)
  : allowedColorSystems;
if (!projectArg || !colorSystems.length || !python) usage(1);
const invalidSystems = colorSystems.filter(name => !allowedColorSystems.includes(name));
if (invalidSystems.length) throw new Error(`Unknown color system(s): ${invalidSystems.join(", ")}`);

const project = path.resolve(projectArg);
const indexPath = path.join(project, "index.html");
if (!fs.existsSync(indexPath) || !fs.existsSync(path.join(project, "hyperframes.json"))) {
  throw new Error("Expected an existing HyperFrames project containing index.html and hyperframes.json.");
}

const html = fs.readFileSync(indexPath, "utf8");
const originalColorSystem = projectColorSystem(project, html);
// Read scene timing from the host and layout identity from each generated frame.
// Keep quoted values intact while finding the real end of an opening tag.
const frameHostTag = /<(?:[^<>"']|"[^"]*"|'[^']*')*data-composition-src="compositions\/frames\/([^"]+\.html)"(?:[^<>"']|"[^"]*"|'[^']*')*>/g;
const scenes = [...html.matchAll(frameHostTag)].map(match => {
  const tag = match[0];
  const frame = fs.readFileSync(path.join(project, "compositions", "frames", match[1]), "utf8");
  const id = frame.match(/\bdata-layout-id="([^"]+)"/)?.[1];
  if (!id || !frame.includes("data-registry-item=")) throw new Error(`Frame ${match[1]} lacks layout or Registry metadata.`);
  const readNumber = name => Number(tag.match(new RegExp(`${name}="([^"]+)"`))?.[1]);
  return { id, start: readNumber("data-start"), duration: readNumber("data-duration") };
});
const byId = new Map(scenes.map(scene => [scene.id, scene]));
const missing = expectedIds.filter(id => !byId.has(id));
if (missing.length || scenes.length !== 40) {
  throw new Error(`Expected the exact 40-recipe proof sequence. Missing: ${missing.join(", ") || "none"}`);
}
for (const scene of scenes) {
  if (!Number.isFinite(scene.start) || !Number.isFinite(scene.duration) || scene.duration <= 0) {
    throw new Error(`Invalid timing attributes for ${scene.id}`);
  }
}

const captures = expectedIds.map(id => {
  const scene = byId.get(id);
  return {
    id,
    time: Math.round((scene.start + Math.min(scene.duration * 0.78, scene.duration - 0.35)) * 100) / 100,
  };
}).sort((a, b) => a.time - b.time);
const times = captures.map(capture => capture.time);
const setColorSystem = path.join(root, "scripts", "set-color-system.mjs");
const contactSheet = path.join(root, "scripts", "build-layout-contact-sheet.py");

try {
  for (const colorSystem of colorSystems) {
    run(process.execPath, [setColorSystem, "--project", project, "--color-system", colorSystem], project, `${colorSystem} token application`);
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), `vc-layout-proofs-${colorSystem}-`));
    try {
      run("npx", ["hyperframes", "snapshot", "--at", times.join(","), "--no-end", "--output", temp], project, `${colorSystem} HyperFrames snapshots`);
      const rendered = fs.readdirSync(temp).filter(name => name.endsWith(".png")).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      if (rendered.length !== expectedIds.length) {
        throw new Error(`${colorSystem}: expected ${expectedIds.length} snapshots, received ${rendered.length}.`);
      }
      const preview = path.join(root, "assets", "layouts", "preview", colorSystem);
      fs.mkdirSync(preview, { recursive: true });
      for (let index = 0; index < captures.length; index += 1) {
        const stem = captures[index].id.replace("/", "--");
        const output = path.join(preview, `${stem}.png`);
        fs.copyFileSync(path.join(temp, rendered[index]), output);
        if (colorSystem === "navy-cobalt") {
          fs.copyFileSync(output, path.join(root, "assets", "layouts", "preview", `${stem}.png`));
        }
      }
    } finally {
      fs.rmSync(temp, { recursive: true, force: true });
    }
    run(python, [contactSheet, "--color-system", colorSystem], root, `${colorSystem} contact sheet`);
    console.log(`OK ${colorSystem}: ${expectedIds.length} official HyperFrames render proofs.`);
  }
} finally {
  run(process.execPath, [setColorSystem, "--project", project, "--color-system", originalColorSystem], project, "restore project token selection");
}
