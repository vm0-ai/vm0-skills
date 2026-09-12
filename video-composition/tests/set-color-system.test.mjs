import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const pack = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(pack, "scripts/set-color-system.mjs");

test("changes one project-level color name without changing scene content", t => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "palette-color-switch-"));
  t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  fs.mkdirSync(path.join(project, "compositions/frames"), { recursive: true });
  fs.mkdirSync(path.join(project, "compositions/official"), { recursive: true });
  fs.writeFileSync(path.join(project, "index.html"), '<div id="root" data-color-system="navy-cobalt"><p>host content</p></div>\n');
  fs.writeFileSync(path.join(project, "compositions/frames/one.html"), '<main id="root" data-color-system="navy-cobalt"><h1>keep this copy</h1></main>\n');
  fs.writeFileSync(path.join(project, "compositions/frames/two.html"), '<main id="root"><h1>keep this too</h1></main>\n');
  fs.writeFileSync(path.join(project, "compositions/official/block.html"), '<main id="root"><script>const theme = { scheme: "light" };</script></main>\n');

  const result = spawnSync(process.execPath, [script, "--project", project, "--color-system", "black-gold"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(fs.readFileSync(path.join(project, "index.html"), "utf8"), /data-color-system="black-gold"/);
  assert.match(fs.readFileSync(path.join(project, "compositions/frames/one.html"), "utf8"), /data-color-system="black-gold"[\s\S]*keep this copy/);
  assert.match(fs.readFileSync(path.join(project, "compositions/frames/two.html"), "utf8"), /data-color-system="black-gold"[\s\S]*keep this too/);
  assert.match(fs.readFileSync(path.join(project, "compositions/official/block.html"), "utf8"), /data-color-system="black-gold"[\s\S]*scheme: "dark"/);
  const receipt = JSON.parse(fs.readFileSync(path.join(project, ".style-reference/video-composition/COLOR-SYSTEM.json"), "utf8"));
  assert.equal(receipt.name, "black-gold");
  assert.equal(receipt.appliedTo, "all-scenes");
});

test("normalizes legacy collection names to canonical names", t => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "palette-color-alias-"));
  t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  fs.writeFileSync(path.join(project, "index.html"), '<div id="root" data-color-system="navy-cobalt"></div>\n');
  const result = spawnSync(process.execPath, [script, "--project", project, "--color-system", "white-blue"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(fs.readFileSync(path.join(project, "index.html"), "utf8"), /data-color-system="monumental-minimal"/);
});

test("supports every built-in collection and preserves light or dark component schemes", t => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "palette-built-in-colors-"));
  t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  fs.mkdirSync(path.join(project, "compositions/official"), { recursive: true });
  fs.writeFileSync(path.join(project, "index.html"), '<div id="root" data-color-system="navy-cobalt"></div>\n');
  fs.writeFileSync(path.join(project, "compositions/official/block.html"), '<main id="root"><script>const theme = { scheme: "dark" };</script></main>\n');
  const schemes = {
    "navy-cobalt": "dark",
    "monumental-minimal": "light",
    "black-gold": "dark",
    "obsidian-champagne": "dark",
    "petrol-brass": "dark",
    "parchment-oxblood": "light",
    "porcelain-carbon": "light",
  };
  for (const [name, scheme] of Object.entries(schemes)) {
    const result = spawnSync(process.execPath, [script, "--project", project, "--color-system", name], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(fs.readFileSync(path.join(project, "index.html"), "utf8"), new RegExp(`data-color-system="${name}"`));
    assert.match(fs.readFileSync(path.join(project, "compositions/official/block.html"), "utf8"), new RegExp(`scheme: "${scheme}"`));
  }
});
