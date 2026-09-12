import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(html|css|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// src="…", href="…", url(…) — local paths only
const PATTERNS = [/(?:src|href)\s*=\s*"([^"]+)"/g, /url\(\s*["']?([^"')]+)["']?\s*\)/g];

test("every local asset reference resolves to a file that exists", () => {
  const missing = [];
  for (const file of walk(path.join(root, "assets"))) {
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of PATTERNS) {
      for (const [, raw] of text.matchAll(pattern)) {
        if (/^(https?:|data:|mailto:|#|\/\/)/.test(raw)) continue;
        if (raw.includes("${") || raw.includes("{{")) continue; // runtime-built path
        // Starters and adapters also address the generated project's own tree -
        // compositions/… and assets/<package-id>/… are created by bootstrap, so they
        // are authored here and only exist once a project has been staged.
        if (raw.startsWith("compositions/") || raw.startsWith("assets/video-composition/")) continue;
        const clean = raw.split(/[?#]/)[0];
        // Starters and adapters are authored to be mounted at a project root, so a
        // path may be relative to the file or to the package root. Either resolving.
        // A file that bootstrap stages resolves its paths from where it lands, so try
        // beside the file, at the package root, and under assets/.
        const bases = [path.dirname(file), root, path.join(root, "assets")];
        if (!bases.some(base => fs.existsSync(path.resolve(base, clean)))) {
          missing.push(`${path.relative(root, file)} -> ${raw}`);
        }
      }
    }
  }
  assert.deepEqual(missing, [], `dangling asset references:\n${missing.join("\n")}`);
});
