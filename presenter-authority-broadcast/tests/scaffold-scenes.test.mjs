import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/scaffold-scenes.mjs");
const finalizer = path.join(root, "scripts/finalize-timing.mjs");

function blankProject() {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "authority-scaffold-"));
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  fs.writeFileSync(path.join(project, "index.html"), '<div data-composition-id="main"><!-- Add your clips here. Example: --></div>\n');
  fs.mkdirSync(path.join(project, "compositions"), { recursive: true });
  for (const name of [
    "authority-scene.html",
    "authority-scene.motion.json",
    "authority-presenter-scene.html",
    "authority-presenter-scene.motion.json",
  ]) {
    fs.copyFileSync(path.join(root, "assets/starter/compositions", name), path.join(project, "compositions", name));
  }
  const layoutRoot = path.join(project, ".style-reference/authority-broadcast/layouts/source");
  fs.mkdirSync(layoutRoot, { recursive: true });
  for (const stem of ["orientation--authority-cover", "data--kpi-grid", "orientation--public-action-close", "text--two-column-argument"]) {
    for (const extension of ["html", "motion.json"]) {
      fs.copyFileSync(path.join(root, "assets/layouts/source", `${stem}.${extension}`), path.join(layoutRoot, `${stem}.${extension}`));
    }
  }
  const componentRoot = path.join(project, "compositions/components");
  fs.mkdirSync(componentRoot, { recursive: true });
  for (const name of ["titlecard-lockup", "grid-card-assemble", "cta-close"]) {
    fs.copyFileSync(
      path.join(root, "../../../authority-broadcast-layouts/compositions/components", `${name}.html`),
      path.join(componentRoot, `${name}.html`),
    );
  }
  const adapterRoot = path.join(project, "compositions/authority-adapters");
  fs.mkdirSync(adapterRoot, { recursive: true });
  for (const name of ["text--two-column-argument.html", "orientation--public-action-close.html"]) {
    fs.copyFileSync(path.join(root, "assets/layouts/adapters", name), path.join(adapterRoot, name));
  }
  return project;
}

test("creates a variable-length scene contract from executable layout starters", () => {
  const project = blankProject();
  const run = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--host-id", "policy-report",
    "--presenter", "on",
    "--color-system", "black-gold",
    "--presenter-scenes", "cover,close",
    "--scenes", "cover:7,evidence:9,close:6",
    "--layout-map", "cover=orientation/authority-cover,evidence=data/kpi-grid,close=orientation/public-action-close",
    "--language", "zh-CN",
  ], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);

  const index = fs.readFileSync(path.join(project, "index.html"), "utf8");
  assert.match(index, /data-composition-id="policy-report"/);
  assert.match(index, /data-duration="22"/);
  assert.match(index, /id="scene-evidence"/);
  assert.match(index, /data-start="16" data-duration="6"/);

  const cover = fs.readFileSync(path.join(project, "compositions/frames/cover.html"), "utf8");
  const evidence = fs.readFileSync(path.join(project, "compositions/frames/evidence.html"), "utf8");
  assert.match(cover, /data-presenter="on"/);
  assert.match(cover, /data-color-system="black-gold"/);
  assert.match(index, /data-color-system="black-gold"/);
  assert.match(cover, /window\.__timelines\["policy-report-cover"\]/);
  assert.match(cover, /AUTHORITY_CONTENT_SLOT_BEGIN/);
  assert.match(cover, /data-registry-item="titlecard-lockup"/);
  assert.match(cover, /"default":"A CLEAR PUBLIC ACTION"/);
  assert.doesNotMatch(cover, /data-composition-src="compositions\/components\/titlecard-lockup.html"/);
  assert.match(cover, /class="[^"\n]*clip[^"\n]*"[^>]*data-start="0"[^>]*data-duration="7"/);
  assert.doesNotMatch(cover, /class="[^"\n]*clip[^"\n]*"[^>]*data-start="0"[^>]*data-duration="4"/);
  assert.match(evidence, /data-presenter="off"/);
  assert.match(evidence, /<main id="root"/);
  assert.doesNotMatch(evidence, /PRESENTER_SLOT_BEGIN/);

  const motion = JSON.parse(fs.readFileSync(path.join(project, "index.motion.json"), "utf8"));
  assert.equal(motion.duration, 22);
  assert.equal(motion.assertions.length, 3);
});

test("refuses to replace an authored host without explicit force", () => {
  const project = blankProject();
  fs.writeFileSync(path.join(project, "index.html"), '<div data-composition-id="main"><div data-composition-src="custom.html"></div></div>\n');
  const run = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--presenter", "off",
    "--scenes", "cover:6",
  ], { encoding: "utf8" });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /not the untouched blank HyperFrames scaffold/);
});

test("extends the full-window clip inside a content-ready adapter", () => {
  const project = blankProject();
  const run = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--host-id", "adapter-duration",
    "--presenter", "off",
    "--scenes", "compare:8",
    "--layout-map", "compare=text/two-column-argument",
  ], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const frame = fs.readFileSync(path.join(project, "compositions/frames/compare.html"), "utf8");
  assert.match(frame, /data-authority-adapter-stage[^>]*data-duration="8"/);
  assert.doesNotMatch(frame, /data-authority-adapter-stage[^>]*data-duration="4"/);
});

test("authors provisional scenes early and finalizes timing without rebuilding content", () => {
  const project = blankProject();
  const scaffold = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--host-id", "draft-report",
    "--presenter", "off",
    "--scenes", "cover:auto,evidence:auto",
    "--layout-map", "cover=orientation/authority-cover,evidence=data/kpi-grid",
  ], { encoding: "utf8" });
  assert.equal(scaffold.status, 0, scaffold.stderr);

  const indexBefore = fs.readFileSync(path.join(project, "index.html"), "utf8");
  assert.match(indexBefore, /data-authority-timing="provisional"/);
  assert.match(indexBefore, /data-duration="12"/);

  const coverPath = path.join(project, "compositions/frames/cover.html");
  const authored = fs.readFileSync(coverPath, "utf8").replace("A CLEAR PUBLIC ACTION", "AUTHORED CONTENT SURVIVES");
  fs.writeFileSync(coverPath, authored);

  const finalize = spawnSync(process.execPath, [
    finalizer,
    "--project", project,
    "--scenes", "cover:7.42,evidence:9.18",
  ], { encoding: "utf8" });
  assert.equal(finalize.status, 0, finalize.stderr);

  const indexAfter = fs.readFileSync(path.join(project, "index.html"), "utf8");
  assert.match(indexAfter, /data-authority-timing="final"/);
  assert.match(indexAfter, /data-duration="16.6"/);
  assert.match(indexAfter, /id="scene-evidence"[^>]*data-start="7.42" data-duration="9.18"/);

  const coverAfter = fs.readFileSync(coverPath, "utf8");
  assert.match(coverAfter, /AUTHORED CONTENT SURVIVES/);
  assert.match(coverAfter, /data-duration="7.42"/);
  assert.equal(JSON.parse(fs.readFileSync(coverPath.replace(/\.html$/, ".motion.json"), "utf8")).duration, 7.42);
  assert.equal(JSON.parse(fs.readFileSync(path.join(project, "index.motion.json"), "utf8")).duration, 16.6);
});
