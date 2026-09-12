import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/stage-authoring-kit.mjs");

function projectFixture() {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "vc-stage-"));
  fs.writeFileSync(path.join(project, "index.html"), '<div data-composition-id="host" data-duration="6"></div>\n');
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  return project;
}

function stage(project, ...args) {
  return spawnSync(process.execPath, [
    script,
    "--project", project,
    "--layouts", "data/single-stat",
    "--archetypes", "national-brief",
    "--force",
    ...args,
  ], { encoding: "utf8" });
}

test("presenter off stages selected references without presenter files", () => {
  const project = projectFixture();
  const hostBefore = fs.readFileSync(path.join(project, "index.html"), "utf8");
  const run = stage(project, "--presenter", "off");
  assert.equal(run.status, 0, run.stderr);
  assert.ok(fs.existsSync(path.join(project, "scripts/review-project.mjs")));
  assert.ok(fs.existsSync(path.join(project, "scripts/scaffold-scenes.mjs")));
  assert.ok(fs.existsSync(path.join(project, "scripts/finalize-timing.mjs")));
  assert.ok(fs.existsSync(path.join(project, "scripts/set-color-system.mjs")));
  const colors = JSON.parse(fs.readFileSync(path.join(project, ".style-reference/video-composition/COLOR-SYSTEM.json"), "utf8"));
  assert.equal(colors.name, "navy-cobalt");
  assert.equal(colors.scope, "project");
  assert.ok(fs.existsSync(path.join(project, ".style-reference/video-composition/layouts/source/data--single-stat.html")));
  assert.ok(fs.existsSync(path.join(project, ".style-reference/video-composition/layouts/source/data--single-stat.motion.json")));
  assert.ok(!fs.existsSync(path.join(project, "assets/video-composition/presenters/p1.png")));
  assert.ok(!fs.existsSync(path.join(project, "compositions/vc-presenter-scene.html")));
  const selection = fs.readFileSync(path.join(project, ".style-reference/video-composition/SELECTION.md"), "utf8");
  assert.match(selection, /data\/single-stat/);
  assert.doesNotMatch(selection, /data\/time-series/);
  assert.ok(selection.trim().split(/\s+/).length < 350);
  assert.equal(fs.readFileSync(path.join(project, "index.html"), "utf8"), hostBefore);
});

test("presenter on stages reusable presenter media and starter", () => {
  const project = projectFixture();
  const run = stage(project, "--presenter", "on");
  assert.equal(run.status, 0, run.stderr);
  assert.ok(fs.existsSync(path.join(project, "assets/video-composition/presenters/p1.png")));
  assert.ok(fs.existsSync(path.join(project, "compositions/vc-presenter-scene.html")));
  assert.ok(fs.existsSync(path.join(project, ".style-reference/video-composition/PRESENTER-ADAPTATION.md")));
});

test("one install flag deduplicates and installs every mapped Registry item", () => {
  const project = projectFixture();
  const fakeBin = fs.mkdtempSync(path.join(os.tmpdir(), "vc-npx-"));
  const log = path.join(fakeBin, "calls.log");
  const fakeNpx = path.join(fakeBin, process.platform === "win32" ? "npx.cmd" : "npx");
  fs.writeFileSync(fakeNpx, process.platform === "win32"
    ? "@echo %3>>%FAKE_NPX_LOG%\r\n@echo {\"ok\":true,\"name\":\"%3\",\"type\":\"hyperframes:component\",\"written\":[],\"preserved\":[],\"installed\":[\"%3\"],\"snippet\":\"merge installed template\",\"variablesApplied\":[],\"warnings\":[]}\r\n"
    : "#!/bin/sh\nprintf '%s\\n' \"$3\" >> \"$FAKE_NPX_LOG\"\nprintf '{\"ok\":true,\"name\":\"%s\",\"type\":\"hyperframes:component\",\"written\":[],\"preserved\":[],\"installed\":[\"%s\"],\"snippet\":\"merge installed template\",\"variablesApplied\":[],\"warnings\":[]}\\n' \"$3\" \"$3\"\n");
  fs.chmodSync(fakeNpx, 0o755);

  const run = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--presenter", "off",
    "--layouts", "text/claim-support,text/bullet-hierarchy,time/ordered-steps",
    "--install",
    "--force",
  ], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`, FAKE_NPX_LOG: log },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(fs.readFileSync(log, "utf8").trim().split("\n"), [
    "line-by-line-slide",
    "inline-highlight",
    "tracing-beam",
    "grid-card-assemble",
  ]);
  assert.match(run.stdout, /Registry items ready: line-by-line-slide, inline-highlight, tracing-beam, grid-card-assemble/);
  const receipt = JSON.parse(fs.readFileSync(path.join(project, ".style-reference/video-composition/REGISTRY-INSTALLS.json"), "utf8"));
  assert.deepEqual(receipt.layouts.map(layout => layout.routerCode), ["M", "M", "M"]);
  assert.deepEqual(receipt.items.map(item => item.name), ["line-by-line-slide", "inline-highlight", "tracing-beam", "grid-card-assemble"]);
  assert.ok(receipt.items.every(item => item.integration === "scene-fusion-with-baked-starter-defaults"));
  const selection = fs.readFileSync(path.join(project, ".style-reference/video-composition/SELECTION.md"), "utf8");
  assert.match(selection, /REGISTRY-INSTALLS\.json/);
});

test("optional content font is copied and exposed through font tokens", () => {
  const project = projectFixture();
  const font = path.join(root, "assets/fonts/body.woff2");
  const run = stage(project, "--presenter", "off", "--content-font", font, "--clean-managed");
  assert.equal(run.status, 0, run.stderr);
  assert.ok(fs.existsSync(path.join(project, "assets/video-composition/fonts/content.woff2")));
  const css = fs.readFileSync(path.join(project, "assets/video-composition/content-font.css"), "utf8");
  assert.match(css, /VcContent/);
  assert.match(css, /--stage-font-display/);
});

test("first CJK staging requires one content font", () => {
  const project = projectFixture();
  const run = stage(project, "--presenter", "off", "--language", "zh-CN");
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /requires a licensed --content-font/);
});

test("an existing install receipt prevents repeated Registry network work", () => {
  const project = projectFixture();
  const target = "compositions/components/conic-progress-ring.html";
  const numberTarget = "compositions/components/number-pop-in.html";
  fs.mkdirSync(path.join(project, "compositions/components"), { recursive: true });
  fs.writeFileSync(path.join(project, target), "installed\n");
  fs.writeFileSync(path.join(project, numberTarget), "installed\n");
  fs.writeFileSync(path.join(project, "hyperframes.json"), JSON.stringify({ registryItems: [{ name: "conic-progress-ring", target }, { name: "number-pop-in", target: numberTarget }] }));
  const reference = path.join(project, ".style-reference/video-composition");
  fs.mkdirSync(reference, { recursive: true });
  fs.writeFileSync(path.join(reference, "REGISTRY-INSTALLS.json"), JSON.stringify({
    items: [
      { name: "conic-progress-ring", type: "hyperframes:component", integration: "scene-fusion-with-baked-starter-defaults", written: [target], installed: ["conic-progress-ring"] },
      { name: "number-pop-in", type: "hyperframes:component", integration: "scene-fusion-with-baked-starter-defaults", written: [numberTarget], installed: ["number-pop-in"] },
    ],
  }));
  const fakeBin = fs.mkdtempSync(path.join(os.tmpdir(), "vc-npx-reuse-"));
  const fakeNpx = path.join(fakeBin, process.platform === "win32" ? "npx.cmd" : "npx");
  fs.writeFileSync(fakeNpx, process.platform === "win32" ? "@exit /b 9\r\n" : "#!/bin/sh\nexit 9\n");
  fs.chmodSync(fakeNpx, 0o755);
  const run = spawnSync(process.execPath, [
    script, "--project", project, "--presenter", "off", "--layouts", "data/single-stat", "--install", "--clean-managed", "--force",
  ], { encoding: "utf8", env: { ...process.env, PATH: `${fakeBin}${path.delimiter}${process.env.PATH}` } });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Registry installs reused without network work: conic-progress-ring, number-pop-in/);
});

test("controlled cleanup removes only known managed files", () => {
  const project = projectFixture();
  const reference = path.join(project, ".style-reference/video-composition");
  fs.mkdirSync(path.join(reference, "layouts/preview"), { recursive: true });
  fs.writeFileSync(path.join(reference, "LAYOUT-CATALOG.md"), "old\n");
  fs.writeFileSync(path.join(reference, "layouts/preview/text--claim-support.png"), "old\n");
  fs.writeFileSync(path.join(reference, "notes.md"), "keep\n");
  fs.mkdirSync(path.join(project, "assets/video-composition/presenters"), { recursive: true });
  fs.writeFileSync(path.join(project, "assets/video-composition/presenters/p1.png"), "old\n");

  const run = stage(project, "--presenter", "off", "--clean-managed");
  assert.equal(run.status, 0, run.stderr);
  assert.ok(!fs.existsSync(path.join(reference, "LAYOUT-CATALOG.md")));
  assert.ok(!fs.existsSync(path.join(reference, "layouts/preview/text--claim-support.png")));
  assert.ok(!fs.existsSync(path.join(project, "assets/video-composition/presenters/p1.png")));
  assert.equal(fs.readFileSync(path.join(reference, "notes.md"), "utf8"), "keep\n");
});
