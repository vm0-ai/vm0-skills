import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  analyzeCoverage,
  buildCommand,
  classifyMotion,
  dedupeFindings,
  filterScenes,
  fingerprintState,
  incrementalPreviewSelection,
  parseComposition,
  parseJsonEnvelope,
  preflightProject,
  resolveHyperframesPackage,
  sourceFingerprint,
} from "../scripts/review-project.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/review-project.mjs");
const fixture = `<!doctype html>
<div id="root" data-composition-id="host" data-start="0" data-duration="20">
  <div id="scene-a" data-composition-id="a" data-composition-src="compositions/a.html" data-start="0" data-duration="4"></div>
  <div id="scene-b" data-composition-id="b" data-composition-src="compositions/b.html" data-start="4" data-duration="5"></div>
  <div id="scene-c" data-composition-id="c" data-composition-src="compositions/c.html" data-start="9" data-duration="11"></div>
</div>`;

function validProjectFixture() {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "review-project-"));
  fs.mkdirSync(path.join(project, "compositions"), { recursive: true });
  fs.writeFileSync(path.join(project, "index.html"), fixture);
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  fs.writeFileSync(path.join(project, "index.motion.json"), JSON.stringify({ duration: 20, assertions: [{ kind: "appearsBy", selector: "#scene-a", bySec: 1 }] }));
  for (const [id, duration] of [["a", 4], ["b", 5], ["c", 11]]) {
    fs.writeFileSync(path.join(project, `compositions/${id}.html`), `<div data-composition-id="${id}"></div><script>window.__timelines["${id}"] = tl;</script>`);
    fs.writeFileSync(path.join(project, `compositions/${id}.motion.json`), JSON.stringify({ duration, assertions: [{ kind: "appearsBy", selector: "#root", bySec: 1 }] }));
  }
  return project;
}

test("derives exact midpoints from uneven scene durations", () => {
  const parsed = parseComposition(fixture);
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.host.duration, 20);
  assert.deepEqual(parsed.scenes.map(scene => scene.midpoint), [2, 6.5, 14.5]);
});

test("filters by DOM id, composition id, source, or source stem", () => {
  const scenes = parseComposition(fixture).scenes;
  const result = filterScenes(scenes, ["scene-a", "b", "compositions/c.html"]);
  assert.deepEqual(result.scenes.map(scene => scene.id), ["scene-a", "scene-b", "scene-c"]);
  assert.deepEqual(filterScenes(scenes, ["missing"]).missing, ["missing"]);
});

test("rejects negative, zero, and host-overflow timing", () => {
  const invalid = parseComposition(`<div data-composition-id="host" data-duration="10">
    <div id="negative" data-composition-id="negative" data-composition-src="a.html" data-start="-1" data-duration="2"></div>
    <div id="zero" data-composition-id="zero" data-composition-src="b.html" data-start="2" data-duration="0"></div>
    <div id="overflow" data-composition-id="overflow" data-composition-src="c.html" data-start="8" data-duration="4"></div>
  </div>`);
  assert.equal(invalid.errors.length, 3);
  assert.match(invalid.errors.join("\n"), /negative/);
  assert.match(invalid.errors.join("\n"), /positive/);
  assert.match(invalid.errors.join("\n"), /exceeds host end/);
});

test("deduplicates repeated warnings and retains occurrences", () => {
  const finding = {
    code: "console_warning",
    severity: "warning",
    message: "same warning",
    selector: "#root",
    sourceFile: "index.html",
  };
  const findings = dedupeFindings({
    runtime: { findings: [{ ...finding, time: 0 }, { ...finding, time: 3 }] },
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].occurrences, 2);
  assert.deepEqual(findings[0].times, [0, 3]);
});

test("reports uncovered scenes and dropped transition samples", () => {
  const scenes = parseComposition(fixture).scenes;
  const coverage = analyzeCoverage(scenes, {
    layout: { samples: [2, 14.5], transitionSamplesDropped: 7 },
  });
  assert.deepEqual(coverage.uncoveredScenes, ["scene-b"]);
  assert.equal(coverage.transitionSamplesDropped, 7);
});

test("marks existing sidecars as unverified when HyperFrames motion is disabled", () => {
  assert.equal(classifyMotion(["compositions/a.motion.json"], { motion: { enabled: false } }), "unverified");
  assert.equal(classifyMotion([], { motion: { enabled: false } }), "not-declared");
  assert.equal(classifyMotion(["compositions/a.motion.json"], { motion: { enabled: true, ok: true } }), "verified");
});

test("parses JSON after HyperFrames informational output", () => {
  assert.deepEqual(parseJsonEnvelope("[INFO] ready\n{\n  \"ok\": true\n}\n"), { ok: true });
});

test("builds one linting preflight and browser commands without redundant standalone lint", () => {
  const scenes = parseComposition(fixture).scenes;
  const preflight = buildCommand("preflight", "/project", "/output", scenes);
  const preview = buildCommand("preview", "/project", "/output", scenes);
  const release = buildCommand("release", "/project", "/output", scenes);
  const staticCommand = buildCommand("static", "/project", "/output", scenes);
  assert.ok(!preview.args.includes("--no-contrast"));
  assert.ok(!release.args.includes("--no-contrast"));
  assert.ok(staticCommand.args.includes("--no-end"));
  assert.ok(preflight.args.includes("lint"));
  assert.ok([preview, release, staticCommand].every(command => !command.args.includes("lint")));
});

test("preflight catches contract drift before HyperFrames starts", () => {
  const project = validProjectFixture();
  const parsed = parseComposition(fs.readFileSync(path.join(project, "index.html"), "utf8"));
  assert.equal(preflightProject(project, parsed).ok, true);
  fs.unlinkSync(path.join(project, "compositions/b.motion.json"));
  const failed = preflightProject(project, parsed);
  assert.equal(failed.ok, false);
  assert.match(failed.errors.join("\n"), /scene-b: missing motion sidecar/);
});

test("source fingerprint changes when authored composition changes", () => {
  const project = validProjectFixture();
  const before = sourceFingerprint(project);
  fs.appendFileSync(path.join(project, "compositions/a.html"), "<!-- revision -->\n");
  assert.notEqual(sourceFingerprint(project), before);
});

test("a repeated Preview automatically selects only changed scene dependencies", () => {
  const project = validProjectFixture();
  const parsed = parseComposition(fs.readFileSync(path.join(project, "index.html"), "utf8"));
  const previewRoot = path.join(project, ".hyperframes/review-project/preview");
  fs.mkdirSync(previewRoot, { recursive: true });
  fs.writeFileSync(path.join(previewRoot, "report.json"), JSON.stringify({
    ok: true,
    fingerprintState: fingerprintState(project, parsed),
    qaCoverage: { sceneIds: parsed.scenes.map(scene => scene.id) },
    composition: { selectedScenes: parsed.scenes },
  }));
  fs.appendFileSync(path.join(project, "compositions/b.html"), "<!-- changed -->\n");
  const selection = incrementalPreviewSelection(project, parsed);
  assert.equal(selection.mode, "incremental");
  assert.deepEqual(selection.scenes.map(scene => scene.id), ["scene-b"]);
});

test("CJK preflight requires an explicit resolved local content font", () => {
  const project = validProjectFixture();
  fs.appendFileSync(path.join(project, "compositions/a.html"), "<p>中文内容</p>\n");
  const parsed = parseComposition(fs.readFileSync(path.join(project, "index.html"), "utf8"));
  assert.equal(preflightProject(project, parsed).ok, false);

  const assetRoot = path.join(project, "assets/video-composition");
  fs.mkdirSync(path.join(assetRoot, "fonts"), { recursive: true });
  fs.writeFileSync(path.join(assetRoot, "fonts/content.woff2"), "font");
  fs.writeFileSync(path.join(assetRoot, "content-font.css"), '@font-face { font-family: "VcContent"; src: url("fonts/content.woff2") format("woff2"); }\n');
  assert.equal(preflightProject(project, parsed).ok, true);
});

test("honors a HyperFrames version pinned in project scripts", () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "vc-version-"));
  fs.writeFileSync(path.join(project, "package.json"), JSON.stringify({
    scripts: { check: "npx --yes hyperframes@0.8.26 check" },
  }));
  assert.equal(resolveHyperframesPackage(project), "hyperframes@0.8.26");
  const command = buildCommand("preview", project, "/output", parseComposition(fixture).scenes, resolveHyperframesPackage(project));
  assert.deepEqual(command.args.slice(0, 3), ["--yes", "hyperframes@0.8.26", "check"]);
});

test("CLI dry run writes a machine report without starting HyperFrames", () => {
  const project = validProjectFixture();
  const output = path.join(project, "review");
  const run = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--phase", "preview",
    "--dry-run",
    "--output", output,
  ], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const report = JSON.parse(fs.readFileSync(path.join(output, "report.json"), "utf8"));
  assert.equal(report.dryRun, true);
  assert.deepEqual(report.coverage.requestedTimes, [2, 6.5, 14.5]);
  assert.equal(report.command.exitCode, null);
  assert.equal(report.preflight.ok, true);
});

test("release reuses an unchanged successful full preview", () => {
  const project = validProjectFixture();
  const previewRoot = path.join(project, ".hyperframes/review-project/preview");
  fs.mkdirSync(previewRoot, { recursive: true });
  fs.writeFileSync(path.join(previewRoot, "report.json"), JSON.stringify({
    ok: true,
    sourceFingerprint: sourceFingerprint(project),
    fingerprintState: fingerprintState(project, parseComposition(fixture)),
    reusedPreview: false,
    composition: { selectedScenes: [{}, {}, {}] },
    qaCoverage: { sceneIds: ["scene-a", "scene-b", "scene-c"] },
    coverage: { requestedTimes: [2, 6.5, 14.5], sampledTimes: [2, 6.5, 14.5], uncoveredScenes: [], transitionSamplesDropped: 0 },
    motion: { status: "verified", sidecars: [] },
    findings: [],
    hyperframes: { ok: true },
  }));
  const run = spawnSync(process.execPath, [script, "--project", project, "--phase", "release"], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const report = JSON.parse(fs.readFileSync(path.join(project, ".hyperframes/review-project/release/report.json"), "utf8"));
  assert.equal(report.reusedPreview, true);
  assert.equal(report.command.exitCode, 0);
});
