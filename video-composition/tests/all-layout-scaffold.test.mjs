import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "../../..");
const router = fs.readFileSync(path.join(root, "references/ROUTER.md"), "utf8");
const ids = [...router.matchAll(/^\| `([a-z]+\/[a-z0-9-]+)` \|.*$/gm)].map(match => match[1]);

test("all forty starters scaffold against their installed official sources", t => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "vc-all-layouts-"));
  t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  fs.writeFileSync(path.join(project, "index.html"), '<div data-composition-id="main"><!-- Add your clips here. Example: --></div>\n');
  fs.cpSync(path.join(workspace, "video-composition-layouts/compositions"), path.join(project, "compositions"), { recursive: true });
  for (const name of ["vc-scene.html", "vc-scene.motion.json"]) {
    fs.copyFileSync(path.join(root, "assets/starter/compositions", name), path.join(project, "compositions", name));
  }
  fs.copyFileSync(path.join(root, "assets/layouts/adapters/vc-text-evidence.html"), path.join(project, "compositions/vc-text-evidence.html"));
  fs.cpSync(path.join(root, "assets/layouts/adapters"), path.join(project, "compositions/vc-adapters"), { recursive: true });
  const layoutRoot = path.join(project, ".style-reference/video-composition/layouts/source");
  fs.mkdirSync(path.dirname(layoutRoot), { recursive: true });
  fs.cpSync(path.join(root, "assets/layouts/source"), layoutRoot, { recursive: true });

  const scenes = ids.map((id, index) => `scene-${String(index + 1).padStart(2, "0")}:${JSON.parse(fs.readFileSync(path.join(layoutRoot, `${id.replace("/", "--")}.motion.json`), "utf8")).duration}`);
  const layouts = ids.map((id, index) => `scene-${String(index + 1).padStart(2, "0")}=${id}`);
  const run = spawnSync(process.execPath, [
    path.join(root, "scripts/scaffold-scenes.mjs"),
    "--project", project,
    "--host-id", "all-layouts",
    "--presenter", "off",
    "--language", "en",
    "--scenes", scenes.join(","),
    "--layout-map", layouts.join(","),
    "--force",
  ], { encoding: "utf8" });

  assert.equal(run.status, 0, run.stderr);
  assert.equal(fs.readdirSync(path.join(project, "compositions/frames")).filter(name => name.endsWith(".html")).length, 40);
  const frames = fs.readdirSync(path.join(project, "compositions/frames")).filter(name => name.endsWith(".html")).map(name => fs.readFileSync(path.join(project, "compositions/frames", name), "utf8"));
  assert.equal(frames.filter(html => html.includes("CONTENT_SLOT_BEGIN")).length, ids.filter(id => !router.split("\n").find(line => line.startsWith(`| \`${id}\` |`)).includes("| B `")).length);
  assert.ok(fs.readdirSync(path.join(project, "compositions/official")).some(name => name.endsWith(".html")));
  const dependencyFrame = fs.readFileSync(path.join(project, "compositions/frames/scene-34.html"), "utf8");
  const declaration = dependencyFrame.match(/data-composition-variables='([^']+)'/)?.[1];
  assert.doesNotThrow(() => JSON.parse(declaration));
  assert.equal((dependencyFrame.match(/CONTENT_SLOT_BEGIN/g) || []).length, 1);
  assert.equal((dependencyFrame.match(/CONTENT_SLOT_END/g) || []).length, 1);
});
