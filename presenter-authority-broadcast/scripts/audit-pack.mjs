#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const absolute = relative => path.join(root, relative);
const read = relative => fs.readFileSync(absolute(relative), "utf8");
const template = JSON.parse(read("template.json"));
const builtInColorSystems = template.colorSystemPolicy?.builtIn || [];
const archetypeIds = template.archetypes.map(item => item.id);
const archetypeSources = archetypeIds.map(id => `assets/frames/source/${id}.html`);
const archetypePreviews = archetypeIds.map(id => `assets/frames/preview/${id}.png`);
const archetypeCards = archetypeIds.map(id => `references/composition-archetypes/${id}.md`);
const layoutCatalogSource = read("references/LAYOUT-CATALOG.md");
const layoutIds = [...layoutCatalogSource.matchAll(/^### ([a-z]+\/[a-z0-9-]+)$/gm)].map(match => match[1]);
const layoutPreviews = layoutIds.map(id => `assets/layouts/preview/${id.replace("/", "--")}.png`);
const paletteLayoutPreviews = builtInColorSystems.flatMap(name => layoutIds.map(id => `assets/layouts/preview/${name}/${id.replace("/", "--")}.png`));
const paletteContactSheets = builtInColorSystems.map(name => `assets/layouts/contact-sheet-${name}.jpg`);
const layoutSources = layoutIds.flatMap(id => {
  const stem = id.replace("/", "--");
  return [`assets/layouts/source/${stem}.html`, `assets/layouts/source/${stem}.motion.json`];
});
const contentAdapterIds = layoutIds.filter(id => fs.existsSync(absolute(`assets/layouts/adapters/${id.replace("/", "--")}.html`)));
const contentAdapterSources = contentAdapterIds.map(id => `assets/layouts/adapters/${id.replace("/", "--")}.html`);
const required = [
  "SKILL.md", "template.json", "agents/openai.yaml",
  "references/AUTHORING.md",
  "references/ROUTER.md",
  "references/PRESENTER-ADAPTATION.md",
  "references/VOICE-AVATAR.md",
  "references/LAYOUT-CATALOG.md",
  "references/HYPERFRAMES-LAYOUT-MAP.md",
  "references/STYLE.md", "references/MOTION.md",
  "references/MOTION-CATALOG.md",
  "references/stress-content.json", "references/composition-archetypes/INDEX.md",
  "assets/style-master-a.png", "assets/style-master-b.png",
  "assets/frames/index.html", "assets/frames/frame.css", "assets/frames/gallery.css", "assets/frames/gallery.js",
  "assets/fonts/body.woff2", "assets/fonts/editorial.woff2", "assets/fonts/condensed.woff2", "assets/fonts/mono.woff2",
  "assets/presenters/p1.png", "assets/presenters/p2.png",
  "assets/runtime/authority.css", "assets/runtime/authority-layout-adapter.css", "assets/runtime/authority-layout-adapter.js", "assets/runtime/gsap.min.js",
  "assets/starter/compositions/authority-scene.html", "assets/starter/compositions/authority-scene.motion.json",
  "assets/starter/compositions/authority-presenter-scene.html", "assets/starter/compositions/authority-presenter-scene.motion.json", "assets/starter/demo-index.html",
  "assets/layouts/index.html", "assets/layouts/gallery.css", "assets/layouts/gallery.js", "assets/layouts/contact-sheet.jpg", "assets/layouts/adapters/authority-text-evidence.html",
  "scripts/bootstrap-project.mjs", "scripts/build-layout-adapters.mjs", "scripts/build-layout-starters.mjs", "scripts/stage-authoring-kit.mjs", "scripts/scaffold-scenes.mjs", "scripts/finalize-timing.mjs", "scripts/review-project.mjs", "scripts/render-layout-previews.mjs", "scripts/build-layout-contact-sheet.py",
  "tests/all-layout-scaffold.test.mjs", "tests/bootstrap-project.test.mjs", "tests/layout-starters.test.mjs", "tests/review-project.test.mjs", "tests/scaffold-scenes.test.mjs", "tests/stage-authoring-kit.test.mjs",
  ...archetypeSources, ...archetypePreviews, ...archetypeCards, ...layoutPreviews, ...paletteLayoutPreviews, ...paletteContactSheets, ...layoutSources, ...contentAdapterSources,
];
const retiredChineseMirrors = [
  "SKILL.zh-CN.md",
  "references/AUTHORING.zh-CN.md",
  "references/ROUTER.zh-CN.md",
  "references/PRESENTER-ADAPTATION.zh-CN.md",
  "references/LAYOUT-CATALOG.zh-CN.md",
  "references/HYPERFRAMES-LAYOUT-MAP.zh-CN.md",
  "references/MOTION.zh-CN.md",
  "references/MOTION-CATALOG.zh-CN.md",
];
const errors = [];

for (const relative of required) {
  if (!fs.existsSync(absolute(relative)) || !fs.statSync(absolute(relative)).size) errors.push(`missing or empty: ${relative}`);
}
for (const relative of retiredChineseMirrors) {
  if (fs.existsSync(absolute(relative))) errors.push(`retired Chinese mirror remains: ${relative}`);
}

function pngSize(relative) {
  const buffer = fs.readFileSync(absolute(relative));
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function hasHan(value) {
  return [...value].some(character => {
    const point = character.codePointAt(0);
    return point >= 0x3400 && point <= 0x9fff;
  });
}

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

if (!errors.length) {
  const skill = read("SKILL.md");
  const authoring = read("references/AUTHORING.md");
  const router = read("references/ROUTER.md");
  const presenterAdaptation = read("references/PRESENTER-ADAPTATION.md");
  const voiceAvatar = read("references/VOICE-AVATAR.md");
  const layoutCatalog = read("references/LAYOUT-CATALOG.md");
  const layoutMap = read("references/HYPERFRAMES-LAYOUT-MAP.md");
  const style = read("references/STYLE.md");
  const motion = read("references/MOTION.md");
  const motionCatalog = read("references/MOTION-CATALOG.md");
  const runtimeCss = read("assets/runtime/authority.css");
  const colorSystemCss = read("assets/runtime/color-system.css");
  const adapterCss = read("assets/runtime/authority-layout-adapter.css");
  const adapterJs = read("assets/runtime/authority-layout-adapter.js");
  const frameCss = read("assets/frames/frame.css");
  const layoutGallery = read("assets/layouts/index.html");
  const layoutGalleryJs = read("assets/layouts/gallery.js");
  const starter = read("assets/starter/compositions/authority-scene.html");
  const presenterStarter = read("assets/starter/compositions/authority-presenter-scene.html");
  const demoIndex = read("assets/starter/demo-index.html");
  const starterMotion = JSON.parse(read("assets/starter/compositions/authority-scene.motion.json"));
  const presenterStarterMotion = JSON.parse(read("assets/starter/compositions/authority-presenter-scene.motion.json"));
  const stageScript = read("scripts/stage-authoring-kit.mjs");
  const bootstrapScript = read("scripts/bootstrap-project.mjs");
  const starterBuilder = read("scripts/build-layout-starters.mjs");
  const scaffoldScript = read("scripts/scaffold-scenes.mjs");
  const timingFinalizer = read("scripts/finalize-timing.mjs");
  const reviewScript = read("scripts/review-project.mjs");
  const previewScript = read("scripts/render-layout-previews.mjs");
  const colorSystemSetter = read("scripts/set-color-system.mjs");
  const adapterBuilder = read("scripts/build-layout-adapters.mjs");
  const frameGallery = read("assets/frames/index.html");
  const cards = archetypeCards.map(read);
  const frames = archetypeSources.map(read);
  const contentAdapters = contentAdapterSources.map(read);

  if (template.id !== "authority-broadcast" || template.kind !== "open-visual-style") errors.push("invalid template identity");
  if (template.status !== "ready" || template.readyAt !== "2026-09-03") errors.push("package release status is not ready");
  if (template.styleVersion !== "3.0") errors.push("styleVersion must be 3.0 for the executable-starter workflow");
  if (template.canvas?.width !== 1920 || template.canvas?.height !== 1080) errors.push("invalid canvas");
  if (template.visibleLanguage !== "en") errors.push("visibleLanguage must be en");
  const expectedColorSystems = ["authority-broadcast", "monumental-minimal", "black-gold", "obsidian-champagne", "petrol-brass", "parchment-oxblood", "porcelain-carbon"];
  if (JSON.stringify(builtInColorSystems) !== JSON.stringify(expectedColorSystems)) errors.push("built-in color systems must contain the approved seven names in display order");
  for (const name of expectedColorSystems) {
    if (template.assets?.layoutPalettePreviews?.[name] !== `assets/layouts/preview/${name}`) errors.push(`${name}: invalid palette preview path`);
    if (template.assets?.layoutContactSheets?.[name] !== `assets/layouts/contact-sheet-${name}.jpg`) errors.push(`${name}: invalid contact-sheet path`);
    if (!colorSystemCss.includes(`[data-color-system="${name}"]`)) errors.push(`${name}: missing complete runtime selector`);
    if (!layoutGallery.includes(`data-palette="${name}"`) || !layoutGalleryJs.includes(`"${name}":`)) errors.push(`${name}: missing from the layout Gallery`);
    if (!previewScript.includes(`"${name}"`) || !colorSystemSetter.includes(`"${name}": "${name}"`)) errors.push(`${name}: CLI color-system support is incomplete`);
  }
  if (template.entrypoints?.hyperframesLayoutMap !== "references/HYPERFRAMES-LAYOUT-MAP.md") errors.push("official layout map entrypoint is invalid");
  if (template.entrypoints?.fastRouter !== "references/ROUTER.md") errors.push("fast Router entrypoint is invalid");
  if (template.entrypoints?.skill !== "SKILL.md") errors.push("Skill entrypoint is invalid");
  if (template.entrypoints?.presenterAdaptation !== "references/PRESENTER-ADAPTATION.md") errors.push("presenter adaptation entrypoint is invalid");
  if (template.entrypoints?.voiceAvatar !== "references/VOICE-AVATAR.md") errors.push("voice and talking-avatar entrypoint is invalid");
  if (Object.keys(template.entrypoints || {}).some(key => /zhcn$/i.test(key))) errors.push("retired Chinese entrypoint remains");
  if (template.assets?.layoutPreviews !== "assets/layouts/preview" || template.assets?.layoutContactSheet !== "assets/layouts/contact-sheet.jpg") errors.push("official render-proof asset paths are invalid");
  if (template.assets?.reviewScript !== "scripts/review-project.mjs" || template.reviewPolicy?.entrypoint !== "scripts/review-project.mjs") errors.push("deterministic review entrypoint is invalid");
  if (JSON.stringify(template.reviewPolicy?.phases) !== JSON.stringify(["preflight", "static", "preview", "release"]) || template.reviewPolicy?.sampling !== "derive-scene-midpoints-from-host" || template.reviewPolicy?.preflight !== "authority-contract-plus-hyperframes-lint" || template.reviewPolicy?.previewCheck !== "full-with-contrast-then-automatic-scene-delta" || template.reviewPolicy?.releaseReuse !== "successful-preview-when-source-fingerprint-is-unchanged" || template.reviewPolicy?.render !== "native-hyperframes-after-user-approval") errors.push("review policy must preserve linting Preflight, one full Preview check, automatic scene deltas, and unchanged release reuse");
  if (template.assets?.sceneScaffolder !== "scripts/scaffold-scenes.mjs" || template.assets?.timingFinalizer !== "scripts/finalize-timing.mjs") errors.push("scene timing asset paths are invalid");
  if (template.registryIntegrationPolicy?.receipt !== ".style-reference/authority-broadcast/REGISTRY-INSTALLS.json" || template.registryIntegrationPolicy?.component !== "fuse-official-source-into-scene-and-bake-starter-defaults" || template.registryIntegrationPolicy?.block !== "copy-official-source-per-scene-and-edit-marked-content" || template.registryIntegrationPolicy?.guessing !== "forbidden") errors.push("Registry integration receipt policy is invalid");
  if (template.fontPolicy?.nonLatin !== "stage-user-supplied-licensed-content-font" || template.fontPolicy?.runtimeToken !== "AuthorityContent") errors.push("content font policy is invalid");
  if (template.voicePolicy?.provider !== "heygen" || template.voicePolicy?.identity !== "one-voice-id-across-voice-and-talking-avatar-scenes" || template.voicePolicy?.voiceOnly !== "direct-heygen-tts" || template.voicePolicy?.talkingAvatar !== "embedded-heygen-voice-without-duplicate-tts") errors.push("HeyGen voice identity and no-duplicate-audio policy is invalid");
  if (template.assets?.sceneStarter !== "assets/starter/compositions/authority-scene.html" || template.assets?.presenterSceneStarter !== "assets/starter/compositions/authority-presenter-scene.html" || template.assets?.presenterHeadSceneStarter) errors.push("complete-media starter asset paths are invalid");
  if (fs.existsSync(absolute("assets/starter/compositions/authority-presenter-head-scene.html")) || fs.existsSync(absolute("assets/starter/compositions/authority-presenter-head-scene.motion.json"))) errors.push("retired standalone head presenter starter remains published");
  if (template.assets?.bootstrap !== "scripts/bootstrap-project.mjs" || template.assets?.executableLayoutStarters !== "assets/layouts/source") errors.push("bootstrap or executable layout starter asset path is invalid");
  if (template.workflowPolicy?.ownerWhenExplicitlySelected !== "presenter-authority-broadcast" || template.workflowPolicy?.skipGenericWorkflow !== "general-video" || template.workflowPolicy?.inlineStarterSceneLimit !== 12) errors.push("specialized fast-workflow ownership is invalid");
  if (template.archetypes?.length !== 12 || template.archetypes.filter(item => item.approvedStyleMaster).length !== 2) errors.push("twelve archetypes and two approved masters required");
  if (JSON.stringify(template.presenterGrammar?.cropVocabulary) !== JSON.stringify(["full", "head-shoulders"]) || template.presenterGrammar?.defaultCrop !== "full") errors.push("presenter crop vocabulary must prefer full and allow head-shoulders only");
  if (JSON.stringify(template.presenterGrammar?.videoModes) !== JSON.stringify(["off", "on"]) || template.presenterGrammar?.defaultVideoMode !== "unresolved" || template.presenterGrammar?.videoModeAttribute !== "data-video-presenter") errors.push("video-level presenter mode must be explicit off/on");
  if (template.presenterGrammar?.offMode !== "omit-all-presenter-dom-and-use-full-safe-frame" || template.presenterGrammar?.onMode?.scenePresence !== "optional-per-scene-after-content-review") errors.push("presenter off/on structural behavior is invalid");
  if (template.presenterGrammar?.mediaKindAttribute !== "data-presenter-media" || JSON.stringify(template.presenterGrammar?.mediaKinds) !== JSON.stringify(["static", "talking-avatar"]) || template.presenterGrammar?.talkingAvatar?.durationPolicy !== "measured-media-duration-wins" || template.presenterGrammar?.talkingAvatar?.audioPlayback !== "separate-unique-id-framework-owned-track") errors.push("presenter media kinds must distinguish static assets from real talking-avatar video");
  if (template.presenterGrammar?.onMode?.recurrence !== "narrative-judgment-without-scene-count-quota" || template.presenterGrammar?.onMode?.minimumCoverage) errors.push("presenter recurrence must remain qualitative rather than quota-driven");
  if (JSON.stringify(template.presenterGrammar?.sceneLayouts) !== JSON.stringify(["divider-left", "divider-right", "side-left", "side-right", "corner-left", "corner-right"])) errors.push("presenter scene layouts are invalid");
  if (template.presenterGrammar?.scaleVocabulary || template.presenterGrammar?.scaleAttribute || template.presenterGrammar?.defaultScale) errors.push("presenter scale variants must not be published");
  if (JSON.stringify(template.presenterGrammar?.representationPreference) !== JSON.stringify(["complete-full-presenter-at-template-standard-size", "grounded-bottom-corner-head-shoulders", "presenter-led-divider", "presenter-free"])) errors.push("presenter representation preference is invalid");
  if (template.presenterGrammar?.fullPresenterSize !== "fixed-by-template" || template.presenterGrammar?.fullPresenterScalePolicy !== "never-downscale-to-force-coexistence") errors.push("full presenter must remain at the template standard size");
  if (JSON.stringify(template.presenterGrammar?.headShouldersPolicy?.layouts) !== JSON.stringify(["corner-left", "corner-right"]) || template.presenterGrammar?.headShouldersPolicy?.verticalAnchor !== "bottom-edge" || template.presenterGrammar?.headShouldersPolicy?.boundary !== "soft-transparent-circular-fade") errors.push("head-and-shoulders treatment must be grounded in a bottom corner with a soft transparent circular fade");
  if (template.contentFitPolicy?.defaultAlignment !== "center-both-axes" || template.contentFitPolicy?.defaultTitleChrome !== "omitted") errors.push("content must default to centered with title chrome omitted");
  if (template.contentFitPolicy?.fullCanvasBlockHost !== "1920x1080-unclipped" || template.contentFitPolicy?.overflowResolution !== "use-grounded-head-shoulders-or-move-presenter-then-reselect-or-split-never-shrink-full-presenter") errors.push("full-canvas and overflow policies are invalid");

  const mapIds = [...layoutMap.matchAll(/^### ([a-z]+\/[a-z0-9-]+)$/gm)].map(match => match[1]);
  const routerIds = [...router.matchAll(/^\| `([a-z]+\/[a-z0-9-]+)` \|/gm)].map(match => match[1]);
  const expectedFamilies = { orientation: 4, text: 7, data: 8, comparison: 5, time: 6, system: 4, media: 6 };
  if (contentAdapterIds.length !== 25) errors.push(`content-ready adapter set must contain 25 layouts, found ${contentAdapterIds.length}`);
  if (layoutIds.length !== 40 || new Set(layoutIds).size !== 40) errors.push("layout catalog must contain forty unique recipes");
  if (mapIds.length !== 40 || new Set(mapIds).size !== 40 || mapIds.some(id => !layoutIds.includes(id))) errors.push("official English map must contain the same forty recipe ids as the catalog");
  if (JSON.stringify(routerIds) !== JSON.stringify(layoutIds)) errors.push("English fast Router must contain the forty catalog ids in source order");
  for (const [family, count] of Object.entries(expectedFamilies)) {
    if (layoutIds.filter(id => id.startsWith(`${family}/`)).length !== count) errors.push(`layout family ${family} must contain ${count} recipes`);
  }
  for (const id of layoutIds) {
    const stem = id.replace("/", "--");
    const sourceStem = id.replace("/", "--");
    const entryStart = layoutMap.indexOf(`### ${id}`);
    const nextStart = layoutMap.indexOf("\n### ", entryStart + 1);
    const entry = layoutMap.slice(entryStart, nextStart < 0 ? undefined : nextStart);
    if (!entry.includes("Official Registry item:") || !entry.includes("Render proof:")) errors.push(`${id}: official map entry is incomplete`);
    const mappedItems = entry.match(/Official Registry item: `([^`]+)`/)?.[1]?.split(" + ") || [];
    const routerRow = router.split("\n").find(line => line.startsWith(`| \`${id}\` |`)) || "";
    if (!mappedItems.length || mappedItems.some(item => !routerRow.includes(`\`${item}\``))) errors.push(`${id}: Router item does not match the official map`);
    if (!layoutGalleryJs.includes(`["${id}",`)) errors.push(`${id}: missing from official render-proof gallery`);
    const size = pngSize(`assets/layouts/preview/${stem}.png`);
    if (!size || size.width !== 1920 || size.height !== 1080) errors.push(`${id}: render proof must be 1920x1080 PNG`);
    for (const name of builtInColorSystems) {
      const paletteSize = pngSize(`assets/layouts/preview/${name}/${stem}.png`);
      if (!paletteSize || paletteSize.width !== 1920 || paletteSize.height !== 1080) errors.push(`${id}: ${name} render proof must be 1920x1080 PNG`);
    }
    const layoutSource = read(`assets/layouts/source/${sourceStem}.html`);
    const layoutMotion = JSON.parse(read(`assets/layouts/source/${sourceStem}.motion.json`));
    if (!layoutSource.includes(`data-layout-id="${id}"`) || !layoutSource.includes("AUTHORITY_CONTENT_SLOT_BEGIN") || !layoutSource.includes("AUTHORITY_CONTENT_SLOT_END")) errors.push(`${id}: executable starter lacks its protected content slot`);
    if (!layoutSource.includes("assets/runtime/gsap.min.js") || /https?:\/\/[^\"']*gsap/i.test(layoutSource)) errors.push(`${id}: executable starter must use local GSAP`);
    if (!layoutSource.includes("data-registry-code=") || !layoutSource.includes("data-registry-item=")) errors.push(`${id}: executable starter lacks Registry contract metadata`);
    if (/data-registry-item="(?:comparison-split|avatar-cloud|mk-placeholder-grid|mk-specs-list)"/.test(layoutSource)) errors.push(`${id}: executable starter mounts Registry demo furniture directly`);
    const adapterMatch = layoutSource.match(/data-composition-src="compositions\/authority-adapters\/([^"/]+\.html)"/);
    if (adapterMatch) {
      const adapter = read(`assets/layouts/adapters/${adapterMatch[1]}`);
      if (!adapter.includes('data-authority-content-ready="true"') || !adapter.includes("assets/runtime/authority-layout-adapter.css") || !adapter.includes("window.__timelines[stage.dataset.timelineKey]")) errors.push(`${id}: Authority adapter contract is incomplete`);
      if ((adapter.match(/"role":"content"/g) || []).length < 4) errors.push(`${id}: Authority adapter does not expose sufficient semantic content fields`);
      if (/placeholder|skeleton|baw-default|browser chrome/i.test(adapter)) errors.push(`${id}: Authority adapter contains demo placeholders`);
    }
    if (!Array.isArray(layoutMotion.assertions) || !layoutMotion.assertions.length) errors.push(`${id}: executable starter motion sidecar is empty`);
  }
  if (!layoutGalleryJs.includes('href="source/${stem}.html"')) errors.push("layout gallery does not link cards to executable starters");
  if (/<iframe\b/i.test(layoutGallery + layoutGalleryJs)) errors.push("layout gallery must not embed executable starters in iframes");
  if (fs.existsSync(absolute("assets/layouts/layout.css"))) errors.push("retired ordinary-DOM layout.css remains");

  let presenterFrames = 0;
  for (let index = 0; index < archetypeIds.length; index += 1) {
    const id = archetypeIds[index];
    const frame = frames[index];
    const card = cards[index];
    if (!frame.includes('<html lang="en"') || !frame.includes('<main class="frame')) errors.push(`${id}: invalid archetype source`);
    if (/<script|@keyframes|animation\s*:|transition\s*:|requestAnimationFrame/i.test(frame)) errors.push(`${id}: static archetype contains runtime motion`);
    if (frame.includes("presenter-slot")) {
      presenterFrames += 1;
      const crop = frame.match(/data-presenter-crop="([^"]+)"/)?.[1];
      if (!frame.includes("presenter-media") || !frame.includes('data-face-safe="true"') || crop !== "full") errors.push(`${id}: presenter must be replaceable, face-safe, and complete-media only`);
    }
    for (const heading of ["## Frame sketch", "## HyperFrames building blocks", "## Allowed variations", "## Layout rules", "## Motion order"]) {
      if (!card.includes(heading)) errors.push(`${id}: card missing ${heading}`);
    }
    const size = pngSize(`assets/frames/preview/${id}.png`);
    if (!size || size.width !== 1920 || size.height !== 1080) errors.push(`${id}: archetype preview must be 1920x1080 PNG`);
    if (!frameGallery.includes(`source/${id}.html`)) errors.push(`${id}: missing from archetype gallery`);
  }
  if (!presenterFrames || presenterFrames === 12) errors.push("presenter coverage must be mixed");

  for (const heading of ["## Bootstrap once", "## Edit an executable starter", "## Existing authored projects", "## Review with one deterministic entry point", "## Boundaries"]) if (!authoring.includes(heading)) errors.push(`AUTHORING.md missing ${heading}`);
  for (const heading of ["## Resolve one video-level choice", "## Plan recurrence by narrative need", "## Use a fixed representation ladder", "## Choose one scene relationship", "## Choose representation, not scale", "## Content-fit guidance", "## Review prompts"]) if (!presenterAdaptation.includes(heading)) errors.push(`PRESENTER-ADAPTATION.md missing ${heading}`);
  for (const heading of ["## Lock the shared contract first", "## Run two lanes concurrently", "## Join once, from real media timing"]) if (!voiceAvatar.includes(heading)) errors.push(`VOICE-AVATAR.md missing ${heading}`);
  if (!voiceAvatar.includes("Physical cutting is a fallback") || !voiceAvatar.includes("data-media-start") || !voiceAvatar.includes("do not split or duplicate it") || !voiceAvatar.includes("HeyGen voice/TTS") || !voiceAvatar.includes("not a complete Video Agent project per scene")) errors.push("VOICE-AVATAR.md must use HeyGen voice and prefer ranged reuse over duplicate generation or physical cutting");
  for (const heading of ["## Load boundary", "## Stable stage", "## Route by content meaning", "## Timeline ownership", "## No generic fallback", "## Release checks"]) if (!motion.includes(heading)) errors.push(`MOTION.md missing ${heading}`);
  for (const heading of ["## How the AI chooses", "## Selection filters", "## Candidate index", "## Diversity across a sequence"]) if (!motionCatalog.includes(heading)) errors.push(`MOTION-CATALOG.md missing ${heading}`);

  if (!skill.includes("Read only [ROUTER.md]") || !skill.includes("every proof links to its executable HTML starter")) errors.push("SKILL.md does not enforce the executable Router-first path");
  if (!skill.includes("scripts/bootstrap-project.mjs") || !skill.includes("--layout-map") || !skill.includes("Bootstrap initializes HyperFrames")) errors.push("SKILL.md does not enforce the one-command fast-start path");
  if (!skill.includes("Do not preload `template.json`") || !router.includes("compare no more than two candidates total")) errors.push("normal-path context and candidate limits are not enforced");
  if (wordCount(skill) + wordCount(router) > 2100) errors.push(`default AI context exceeds 2100 words: ${wordCount(skill) + wordCount(router)}`);
  if (!skill.includes("Do not reconstruct a preview PNG with ordinary DOM")) errors.push("SKILL.md does not enforce executable official starters");
  if (!skill.includes("Content completeness, readable scale, and centering") || !skill.includes("upper-left title blocks")) errors.push("SKILL.md does not enforce content-first chrome removal");
  if (!skill.includes("Full-canvas Registry blocks remain presenter-free")) errors.push("SKILL.md does not enforce full-canvas block mounting");
  if (!skill.includes("references/VOICE-AVATAR.md") || !skill.includes("Real media duration wins") || !skill.includes("references/PRESENTER-ADAPTATION.md") || !skill.includes("no presenter DOM")) errors.push("SKILL.md does not enforce adaptive presenter and media-parallel planning");
  if (!skill.includes("must not be shrunk") || !skill.includes("grounded bottom-corner `head-shoulders`") || !presenterAdaptation.includes("soft transparent circular fade")) errors.push("SKILL.md does not enforce fixed-size full and grounded head-and-shoulders presenter treatment");
  if (!skill.includes("Do not route through `general-video`") || !skill.includes("Edit up to twelve starter-based scenes inline")) errors.push("SKILL.md does not own and bound the fast specialized workflow");
  if (skill.includes("Start without template title chrome or presenter") || presenterAdaptation.includes("compare against its presenter-free state") || style.includes("compare it with a presenter-free snapshot") || style.includes("bottom-corner `head` fallback")) errors.push("presenter scenes must be validated directly without authoring presenter-free comparison versions");
  if (!stageScript.includes("references/ROUTER.md") || !stageScript.includes("SELECTION.md") || !stageScript.includes("buildSelectionReference")) errors.push("staging script does not produce the lean selected reference");
  if (!stageScript.includes('token === "--install"') || !stageScript.includes("installMappedRegistryItems") || !stageScript.includes("mappedRegistryItems")) errors.push("staging script does not batch mapped Registry installation");
  if (!stageScript.includes("REGISTRY-INSTALLS.json") || !stageScript.includes("result.snippet") || !stageScript.includes("scene-fusion-with-baked-starter-defaults") || !stageScript.includes("scene-copy-with-marked-content-slot")) errors.push("staging script does not preserve executable Registry integration contracts");
  if (!scaffoldScript.includes("fuseOfficialComponent") || !scaffoldScript.includes("bakeVariableDefaults") || !scaffoldScript.includes("markBlockContent") || !scaffoldScript.includes("applyAuthorityContrast") || !scaffoldScript.includes("compositions/official/")) errors.push("scene scaffolder does not fuse components, isolate blocks, and enforce contrast");
  if (!stageScript.includes("--content-font") || !stageScript.includes("AuthorityContent") || !stageScript.includes('copy("scripts/scaffold-scenes.mjs", "scripts/authority-scaffold-scenes.mjs")') || !stageScript.includes('copy("scripts/finalize-timing.mjs", "scripts/authority-finalize-timing.mjs")')) errors.push("staging script does not install content font and scene timing support");
  if (!scaffoldScript.includes("index.motion.json") || !scaffoldScript.includes("presenterScenes") || !scaffoldScript.includes("layoutMap") || !scaffoldScript.includes("AUTHORITY_CONTENT_SLOT") || !scaffoldScript.includes("Refusing to overwrite")) errors.push("scene scaffolder does not preserve the layout-bound safe contract");
  if (!scaffoldScript.includes('durationToken === "auto"') || !scaffoldScript.includes("data-authority-timing") || !timingFinalizer.includes("Authored scene content was preserved") || !timingFinalizer.includes("data-authority-timing") || !timingFinalizer.includes("compositions\\/official")) errors.push("provisional scene timing cannot be finalized safely without rebuilding authored content");
  if (!stageScript.includes('copy("scripts/review-project.mjs", "scripts/authority-review.mjs")') || !stageScript.includes("--clean-managed") || !stageScript.includes("cleanManagedReferences")) errors.push("staging script does not install the review tool and controlled cleanup");
  if (!authoring.includes("scripts/authority-review.mjs") || !motion.includes("scripts/authority-review.mjs") || !skill.includes("scripts/authority-review.mjs")) errors.push("documentation does not route review through one deterministic entrypoint");
  if (!stageScript.includes("--media-mode") || !stageScript.includes("VOICE-AVATAR.md") || !stageScript.includes("author draft scenes concurrently") || !stageScript.includes("--phase preflight") || !stageScript.includes("--phase static") || !stageScript.includes("--phase preview") || !stageScript.includes("--phase release")) errors.push("lean staged reference does not preserve media-parallel and contract-first guidance");
  if (!reviewScript.includes('"lint", projectRoot, "--json"')) errors.push("Preflight must include one HyperFrames lint run");
  if (!reviewScript.includes("data-composition-src") || !reviewScript.includes("scene.midpoint") || !reviewScript.includes('"preflight", "static", "preview", "release"') || reviewScript.includes("--no-contrast")) errors.push("review script does not enforce scene-aware full Preview QA");
  if (!reviewScript.includes("preflightProject") || !reviewScript.includes("sourceFingerprint") || !reviewScript.includes("reusablePreview") || !reviewScript.includes("incrementalPreviewSelection") || !reviewScript.includes("fingerprintState") || !reviewScript.includes("missing motion sidecar")) errors.push("review script does not preflight contracts or reuse/narrow unchanged Preview QA");
  if (!reviewScript.includes("dedupeFindings") || !reviewScript.includes("uncoveredScenes") || !reviewScript.includes("transitionSamplesDropped") || !reviewScript.includes("unverified")) errors.push("review report does not expose required coverage and finding states");
  if (/["']render["']/.test(reviewScript)) errors.push("review script must not invoke or wrap HyperFrames render");
  for (const retiredCopy of [
    "references/AUTHORING.md", "references/AUTHORING.zh-CN.md",
    "references/LAYOUT-CATALOG.md", "references/LAYOUT-CATALOG.zh-CN.md",
    "references/HYPERFRAMES-LAYOUT-MAP.md", "references/HYPERFRAMES-LAYOUT-MAP.zh-CN.md",
    "references/MOTION.md", "references/MOTION.zh-CN.md",
    "references/MOTION-CATALOG.md", "references/MOTION-CATALOG.zh-CN.md",
    "assets/layouts/contact-sheet.jpg",
  ]) if (stageScript.includes(`copy("${retiredCopy}"`)) errors.push(`staging script still copies full reference: ${retiredCopy}`);
  if (!stageScript.includes("assets/layouts/preview/") || !stageScript.includes("assets/layouts/source/") || stageScript.includes("assets/layouts/layout.css")) errors.push("staging script must copy selected proofs and executable starters");
  if (!previewScript.includes("hyperframes\", \"snapshot") || !previewScript.includes("data-layout-id")) errors.push("preview script must render from a validated HyperFrames project");
  if (!stageScript.includes("It does not modify index.html, invent layouts, write content, or render video")) errors.push("staging script boundary is missing");
  if (stageScript.includes('copy("references/stress-content.json"')) errors.push("staging script must not copy a content manifest");
  if (!stageScript.includes('copy("assets/runtime/gsap.min.js", "assets/runtime/gsap.min.js")')) errors.push("staging script does not copy local GSAP");
  if (!stageScript.includes('--presenter <off|on>') || !stageScript.includes('args.presenterMode === "on"') || !stageScript.includes("Do not add presenter DOM") || !stageScript.includes("Keep full presenters at the template standard size")) errors.push("staging script does not branch on explicit video presenter mode and fixed presenter treatment");
  if (!bootstrapScript.includes("hyperframes", "init") || !bootstrapScript.includes("--layout-map") || !bootstrapScript.includes("--prepare-only") || !bootstrapScript.includes("id:<seconds|auto>") || !bootstrapScript.includes("stage-authoring-kit.mjs") || !bootstrapScript.includes("authority-scaffold-scenes.mjs")) errors.push("bootstrap does not support merged or media-parallel preparation paths");
  if (!stageScript.includes("alreadyInstalledRegistryItems") || !stageScript.includes("reusedInstalls")) errors.push("staging does not reuse installed Registry items");
  if (!starterBuilder.includes("AUTHORITY_CONTENT_SLOT_BEGIN") || !starterBuilder.includes("data-registry-code") || !starterBuilder.includes("Expected 40 rendered layouts")) errors.push("layout starter builder does not preserve bounded official contracts");
  if (!adapterBuilder.includes("data-authority-content-ready") || !adapterBuilder.includes("authority-layout-adapter.css") || !adapterBuilder.includes("authority-layout-adapter.js")) errors.push("content adapter builder contract is incomplete");
  if (!stageScript.includes("assets/runtime/authority-layout-adapter.css") || !stageScript.includes("compositions/authority-adapters/") || !stageScript.includes("assets/authority-broadcast/media/")) errors.push("staging does not copy selected content adapters and media dependencies");
  if (!scaffoldScript.includes("synchronizeFullWindowDurations") || !scaffoldScript.includes("Number(value) === declared")) errors.push("scene scaffolder does not synchronize full-window child clip durations");

  if (/@keyframes|animation\s*:|transition\s*:/i.test(frameCss) || /@keyframes|animation\s*:|transition\s*:/i.test(runtimeCss)) errors.push("shared style contains autonomous motion");
  if (!runtimeCss.includes('.presenter-slot[data-presenter-crop="full"]') || !runtimeCss.includes('.presenter-slot[data-presenter-crop="head-shoulders"]') || !runtimeCss.includes('data-presenter-layout="corner-left"') || !runtimeCss.includes('data-presenter-layout="corner-right"') || !runtimeCss.includes("radial-gradient")) errors.push("runtime CSS must support fixed full media and soft grounded head-and-shoulders corners");
  if (!runtimeCss.includes(".authority-content-stage") || !runtimeCss.includes("place-items: center") || !runtimeCss.includes(".authority-official-mount")) errors.push("runtime CSS does not provide centered and full-canvas content hosts");
  if (!runtimeCss.includes("--authority-font-body") || !runtimeCss.includes("--authority-font-display") || !runtimeCss.includes("--authority-font-mono")) errors.push("runtime CSS does not expose overridable content font tokens");
  if (!runtimeCss.includes('[data-video-presenter="off"] .presenter-slot') || !runtimeCss.includes('.authority-frame[data-presenter="off"]') || !runtimeCss.includes('.authority-frame[data-title-chrome="off"]')) errors.push("runtime CSS does not support structurally omitted presenter and title chrome");
  if (/data-presenter-scale/.test(runtimeCss + presenterStarter + presenterAdaptation)) errors.push("presenter scale attributes must not remain in runtime, starter, or adaptation guidance");
  for (const layout of ["divider-left", "divider-right", "side-left", "side-right"]) if (!runtimeCss.includes(`data-presenter-layout="${layout}"`)) errors.push(`runtime CSS missing ${layout} presenter layout`);
  if (!starter.includes("<template>") || !starter.includes("<style>") || !starter.includes("<script>")) errors.push("starter is not a transport-safe sub-composition");
  if (!starter.includes('data-composition-id="authority-scene"') || !starter.includes('window.__timelines["authority-scene"] = tl')) errors.push("starter composition ids do not match");
  if (!starter.includes('data-presenter="off"') || !starter.includes('data-title-chrome="off"') || !starter.includes("authority-content-stage") || !starter.includes("line-by-line-slide")) errors.push("starter must demonstrate centered official content with presenter and title chrome omitted");
  if (starter.includes("presenter-slot") || starter.includes("authority-public-rail")) errors.push("starter must not reserve presenter or rail space by default");
  if (!Array.isArray(starterMotion.assertions) || !starterMotion.assertions.length) errors.push("starter motion sidecar is empty");
  if (!presenterStarter.includes('data-composition-id="authority-presenter-scene"') || !presenterStarter.includes('window.__timelines["authority-presenter-scene"] = tl')) errors.push("presenter starter composition ids do not match");
  if (!presenterStarter.includes('data-presenter="on"') || !presenterStarter.includes('data-presenter-layout="side-right"') || !presenterStarter.includes('data-presenter-crop="full"') || presenterStarter.includes("data-presenter-scale")) errors.push("presenter starter does not demonstrate standard-size full sidecar mode");
  if (!Array.isArray(presenterStarterMotion.assertions) || !presenterStarterMotion.assertions.length) errors.push("presenter starter motion sidecar is empty");
  if (!demoIndex.includes('data-composition-src="compositions/authority-scene.html"') || !demoIndex.includes('data-video-presenter="off"')) errors.push("host wiring example does not demonstrate explicit presenter-off mode");

  const formalEnglish = [skill, authoring, router, presenterAdaptation, voiceAvatar, layoutCatalog, layoutMap, style, motion, motionCatalog, layoutGallery, layoutGalleryJs, runtimeCss, colorSystemCss, adapterCss, adapterJs, frameCss, starter, presenterStarter, bootstrapScript, adapterBuilder, starterBuilder, stageScript, scaffoldScript, timingFinalizer, reviewScript, ...layoutSources.map(read), ...contentAdapters, ...cards, ...frames].join("\n");
  if (hasHan(formalEnglish)) errors.push("formal English package contains Han text");
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log("OK authority-broadcast: 40 executable Registry starters, one-command bootstrap, linting Preflight, automatic scene-delta Preview, portable content fonts, and <=2100-word default context");
