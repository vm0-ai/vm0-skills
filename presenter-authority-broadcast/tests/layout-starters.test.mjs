import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "assets/layouts/source");
const adapterRoot = path.join(root, "assets/layouts/adapters");
const router = fs.readFileSync(path.join(root, "references/ROUTER.md"), "utf8");
const ids = [...router.matchAll(/^\| `([a-z]+\/[a-z0-9-]+)` \|.*$/gm)].map(match => match[1]);

test("all forty Router layouts have executable starters and motion contracts", () => {
  assert.equal(ids.length, 40);
  for (const id of ids) {
    const stem = id.replace("/", "--");
    const html = fs.readFileSync(path.join(sourceRoot, `${stem}.html`), "utf8");
    const motion = JSON.parse(fs.readFileSync(path.join(sourceRoot, `${stem}.motion.json`), "utf8"));
    assert.match(html, new RegExp(`data-layout-id="${id.replace("/", "\\/")}"`));
    assert.match(html, /AUTHORITY_CONTENT_SLOT_BEGIN/);
    assert.match(html, /<main id="root"/);
    assert.match(html, /data-authority-content-slot="official"/);
    assert.match(html, /assets\/runtime\/gsap\.min\.js/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
    assert.doesNotMatch(html, /data-registry-item="(?:comparison-split|avatar-cloud|mk-placeholder-grid|mk-specs-list)"/);
    const adapterMatch = html.match(/data-composition-src="compositions\/authority-adapters\/([^"/]+\.html)"/);
    if (adapterMatch) {
      const adapter = fs.readFileSync(path.join(adapterRoot, adapterMatch[1]), "utf8");
      assert.match(adapter, /data-authority-content-ready="true"/);
      assert.match(adapter, /assets\/runtime\/authority-layout-adapter\.css/);
      assert.match(adapter, /window\.__timelines\[stage\.dataset\.timelineKey\]/);
      assert.doesNotMatch(adapter, /<script[^>]+src="assets\/runtime\/authority-layout-adapter\.js"/);
      assert.ok((adapter.match(/"role":"content"/g) || []).length >= 4);
      assert.doesNotMatch(adapter, /placeholder|skeleton|baw-default|browser chrome/i);
    }
    assert.ok(motion.duration > 0);
    assert.ok(motion.assertions.length > 0);
  }
});

test("the repaired adapter set covers all capacity gaps", () => {
  const adapters = fs.readdirSync(adapterRoot).filter(name => /^(?:orientation|text|data|comparison|time|system|media)--.*\.html$/.test(name));
  assert.equal(adapters.length, 25);
});

test("short-prone gallery starters retain explanatory working density", () => {
  for (const id of [
    "orientation/authority-cover", "orientation/section-pivot",
    "text/claim-support", "text/bullet-hierarchy", "text/three-fact-columns",
    "data/kpi-row", "data/kpi-grid", "system/layered-system",
  ]) {
    const html = fs.readFileSync(path.join(sourceRoot, `${id.replace("/", "--")}.html`), "utf8");
    const encoded = html.match(/data-variable-values='([^']+)'/)?.[1];
    assert.ok(encoded, `${id} should expose default values`);
    const values = JSON.parse(encoded.replaceAll("&#39;", "'"));
    const words = Object.values(values).filter(value => typeof value === "string").join(" ").match(/[A-Za-z0-9%]+/g) || [];
    assert.ok(words.length >= 8, `${id} should not teach an unrealistically sparse state`);
  }
});
