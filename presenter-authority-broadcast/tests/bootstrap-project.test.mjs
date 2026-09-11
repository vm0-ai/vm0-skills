import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/bootstrap-project.mjs");

test("one bootstrap call stages, installs, and scaffolds selected executable layouts", () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "authority-bootstrap-"));
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  fs.writeFileSync(path.join(project, "index.html"), '<div data-composition-id="main"><!-- Add your clips here. Example: --></div>\n');
  const fakeBin = fs.mkdtempSync(path.join(os.tmpdir(), "authority-bootstrap-bin-"));
  const fakeNpx = path.join(fakeBin, process.platform === "win32" ? "npx.cmd" : "npx");
  fs.writeFileSync(fakeNpx, process.platform === "win32"
    ? "@echo {\"ok\":true,\"name\":\"%3\",\"type\":\"hyperframes:component\",\"written\":[],\"preserved\":[],\"installed\":[\"%3\"],\"snippet\":\"official\",\"variablesApplied\":[],\"warnings\":[]}\r\n"
    : `#!/bin/sh
mkdir -p compositions/components
cp "${path.join(root, "../../../authority-broadcast-layouts/compositions/components")}/$3.html" "compositions/components/$3.html"
printf '{"ok":true,"name":"%s","type":"hyperframes:component","written":["compositions/components/%s.html"],"preserved":[],"installed":["%s"],"snippet":"official","variablesApplied":[],"warnings":[]}\\n' "$3" "$3" "$3"
`);
  fs.chmodSync(fakeNpx, 0o755);

  const run = spawnSync(process.execPath, [
    script,
    "--project", project,
    "--host-id", "fast-report",
    "--presenter", "off",
    "--language", "en",
    "--scenes", "cover:6,evidence:8",
    "--layout-map", "cover=orientation/authority-cover,evidence=data/kpi-grid",
  ], { encoding: "utf8", env: { ...process.env, PATH: `${fakeBin}${path.delimiter}${process.env.PATH}` } });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Authority bootstrap complete/);
  const cover = fs.readFileSync(path.join(project, "compositions/frames/cover.html"), "utf8");
  const evidence = fs.readFileSync(path.join(project, "compositions/frames/evidence.html"), "utf8");
  assert.match(cover, /data-layout-id="orientation\/authority-cover"/);
  assert.match(evidence, /data-layout-id="data\/kpi-grid"/);
  assert.match(cover, /data-composition-id="fast-report-cover"/);
  assert.match(cover, /AUTHORITY_CONTENT_SLOT_BEGIN/);
  assert.ok(fs.existsSync(path.join(project, ".style-reference/authority-broadcast/REGISTRY-INSTALLS.json")));
  assert.ok(fs.existsSync(path.join(project, "scripts/authority-finalize-timing.mjs")));
});

test("prepare-only overlaps media generation without guessing scene durations", () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "authority-prepare-"));
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  const blank = '<div data-composition-id="main"><!-- Add your clips here. Example: --></div>\n';
  fs.writeFileSync(path.join(project, "index.html"), blank);
  const fakeBin = fs.mkdtempSync(path.join(os.tmpdir(), "authority-prepare-bin-"));
  const fakeNpx = path.join(fakeBin, process.platform === "win32" ? "npx.cmd" : "npx");
  fs.writeFileSync(fakeNpx, process.platform === "win32"
    ? "@echo {\"ok\":true,\"name\":\"%3\",\"type\":\"hyperframes:component\",\"written\":[],\"preserved\":[],\"installed\":[\"%3\"],\"snippet\":\"official\",\"variablesApplied\":[],\"warnings\":[]}\r\n"
    : `#!/bin/sh
mkdir -p compositions/components
cp "${path.join(root, "../../../authority-broadcast-layouts/compositions/components")}/$3.html" "compositions/components/$3.html"
printf '{"ok":true,"name":"%s","type":"hyperframes:component","written":["compositions/components/%s.html"],"preserved":[],"installed":["%s"],"snippet":"official","variablesApplied":[],"warnings":[]}\\n' "$3" "$3" "$3"
`);
  fs.chmodSync(fakeNpx, 0o755);

  const run = spawnSync(process.execPath, [
    script,
    "--prepare-only",
    "--project", project,
    "--presenter", "on",
    "--media-mode", "talking-avatar",
    "--language", "en",
    "--layout-map", "cover=orientation/authority-cover",
  ], { encoding: "utf8", env: { ...process.env, PATH: `${fakeBin}${path.delimiter}${process.env.PATH}` } });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /media-parallel preparation complete/);
  assert.equal(fs.readFileSync(path.join(project, "index.html"), "utf8"), blank);
  assert.ok(fs.existsSync(path.join(project, "scripts/authority-scaffold-scenes.mjs")));
  assert.ok(fs.existsSync(path.join(project, "scripts/authority-finalize-timing.mjs")));
  assert.ok(fs.existsSync(path.join(project, "compositions/components/titlecard-lockup.html")));
  assert.ok(fs.existsSync(path.join(project, ".style-reference/authority-broadcast/VOICE-AVATAR.md")));
  assert.ok(!fs.existsSync(path.join(project, "compositions/frames")));
});
