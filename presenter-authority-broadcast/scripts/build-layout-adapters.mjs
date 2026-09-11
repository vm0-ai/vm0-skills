#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultProject = path.resolve(skillRoot, "../../../authority-broadcast-layouts");
const projectRoot = path.resolve(process.argv[2] || defaultProject);
const outputRoot = path.join(skillRoot, "assets/layouts/adapters");
const adapterRuntime = fs.readFileSync(path.join(skillRoot, "assets/runtime/authority-layout-adapter.js"), "utf8").trim();

const stringVar = (id, label, defaultValue, description = "") => ({ id, type: "string", role: "content", label, description, default: defaultValue });
const numberVar = (id, label, defaultValue, min, max) => ({ id, type: "number", role: "content", label, default: defaultValue, min, max, step: 1 });

const specs = [
  { id: "orientation/briefing-map", kind: "cards", origins: ["grid-card-assemble", "line-by-line-slide"], variables: [stringVar("kicker", "Kicker", "TODAY'S BRIEF"), stringVar("title", "Framing statement", "Three decisions shape the next 90 days"), stringVar("summary", "Summary", "A bounded briefing map, not a geographic map."), stringVar("items", "Issue fields", "Access|Who qualifies and where;Readiness|What changes before launch;Accountability|How results will be reported"), stringVar("source", "Source", "PUBLIC BRIEF · THREE PRIORITIES")], markup: cards("items", 3) },
  { id: "orientation/public-action-close", kind: "close", origins: ["cta-close", "line-by-line-slide"], variables: [stringVar("kicker", "Responsibility", "PUBLIC ACTION"), stringVar("title", "Action statement", "Check whether the new rule applies to you"), stringVar("action", "Action label", "Read the official guidance"), stringVar("meta", "Date or channel", "Effective 1 October · gov.example/action"), stringVar("disclosure", "Disclosure", "Eligibility rules and exceptions remain source-controlled"), stringVar("source", "Source", "OFFICIAL NOTICE · 2026")], markup: close() },
  { id: "text/two-column-argument", kind: "compare", origins: ["split-tilt-cards"], variables: compareVars("One conclusion, two complementary reasons", "COMMON PREMISE", "Rationale", "The policy establishes one national baseline while leaving delivery choices to local services.", "Response", "Implementation guidance converts that baseline into clear dates, owners and public actions.", "The two columns support one claim; they are not competing options."), markup: compare() },
  { id: "text/action-checklist", kind: "checklist", origins: ["grid-card-assemble"], variables: [stringVar("kicker", "Kicker", "ACTION CHECKLIST"), stringVar("title", "Instruction", "Complete these steps before the deadline"), stringVar("summary", "Context", "Each item is a concrete action with an observable completion state."), stringVar("items", "Actions", "Confirm eligibility|Check the published criteria;Prepare records|Gather the required documents;Submit through the official channel|Keep the confirmation receipt;Review the outcome|Escalate only through the stated route"), stringVar("source", "Source", "PUBLIC SERVICE GUIDANCE · VERIFIED")], markup: checklist() },
  { id: "data/single-stat", kind: "stat", origins: ["conic-progress-ring", "number-pop-in"], variables: statVars("ONE DECISIVE NUMBER", "Coverage reached the operational threshold", "74", "%", 74, "Eleven points above the previous review", "Benchmark · 63% last quarter", "OFFICIAL PERFORMANCE RETURN · Q3"), markup: stat() },
  { id: "data/data-table", kind: "table", origins: ["grid-card-assemble", "inline-highlight"], variables: [stringVar("kicker", "Kicker", "EXACT VALUES"), stringVar("title", "Table title", "Regional readiness at the decision date"), stringVar("summary", "Takeaway", "Central is the only region below the publication threshold."), stringVar("headers", "Column headers", "Region|Ready|Pending|Coverage"), stringVar("rows", "Rows", "North|42|3|93%;Central|31|9|78%;South|38|4|90%;West|27|2|93%"), numberVar("highlight_row", "Highlighted row", 1, -1, 4), stringVar("source", "Source", "READINESS RETURN · 26 SEPTEMBER")], markup: table() },
  { id: "data/ranked-bars", kind: "bars", origins: ["chart-story"], variables: [stringVar("kicker", "Kicker", "COMMON BASIS"), stringVar("title", "Chart title", "Readiness ranks differ by region"), stringVar("summary", "Measure", "Share of required checks completed"), stringVar("items", "Bars", "North|82|82%;Central|68|68%;South|54|54%;West|41|41%"), stringVar("takeaway", "Takeaway", "North leads West by 41 percentage points."), stringVar("source", "Source", "IMPLEMENTATION DASHBOARD · 2026")], markup: bars() },
  { id: "data/share-ring", kind: "stat", origins: ["conic-progress-ring"], variables: [stringVar("kicker", "Kicker", "PART OF WHOLE"), stringVar("title", "Interpretation", "Most listed services are ready to publish"), stringVar("value", "Primary share", "74"), stringVar("unit", "Unit", "%"), numberVar("progress", "Ring progress", 74, 0, 100), stringVar("benchmark", "Denominator", "74 of every 100 listed services"), stringVar("supports", "Supporting shares", "18% awaiting evidence;8% require intervention"), stringVar("summary", "Disclosure", "Percentages use the complete registered-service denominator."), stringVar("source", "Source", "SERVICE READINESS REGISTER · 2026")], markup: stat(true) },
  { id: "comparison/balanced-split", kind: "compare", origins: ["split-tilt-cards"], variables: compareVars("Compare both models on the same basis", "SHARED BASIS · COST, REACH, ACCOUNTABILITY", "Current model", "Regional rules;Variable reporting;Uneven access", "Proposed model", "National baseline;Common reporting;Consistent access", "Decision remains conditional on implementation evidence."), markup: compare() },
  { id: "comparison/before-after", kind: "compare", origins: ["before-after-wipe"], variables: compareVars("The verified change is structural, not cosmetic", "EFFECTIVE 1 OCTOBER", "Before", "Local criteria;Multiple channels;Quarterly reporting", "After", "National criteria;One public route;Monthly reporting", "Change vector · one standard, one channel, faster review"), markup: compare() },
  { id: "comparison/benefit-risk", kind: "compare", origins: ["split-tilt-cards"], variables: compareVars("The decision has real benefits and real risks", "TRADEOFF · SAME EVIDENCE STANDARD", "Benefits", "Faster access;Clearer accountability;Comparable reporting", "Risks", "Transition errors;Local capacity gaps;Short-term cost pressure", "Unresolved condition · regional readiness must remain above 85%."), markup: compare() },
  { id: "comparison/option-matrix", kind: "matrix", origins: ["grid-card-assemble", "state-chip-rail"], variables: [stringVar("kicker", "Kicker", "DECISION MATRIX"), stringVar("title", "Question", "Which rollout option meets the common rule?"), stringVar("summary", "Decision rule", "Select only an option that satisfies speed, coverage and delivery risk."), stringVar("headers", "Headers", "Option|Speed|Coverage|Risk"), stringVar("rows", "Rows", "Immediate|High|Medium|High;Phased|Medium|High|Low;Regional pilot|Low|Low|Low"), numberVar("highlight_row", "Selected row", 1, -1, 3), stringVar("source", "Source", "OPTIONS APPRAISAL · DECISION PENDING")], markup: table() },
  { id: "comparison/threshold-decision", kind: "threshold", origins: ["state-chip-rail", "number-pop-in"], variables: [stringVar("kicker", "Kicker", "RULE TEST"), stringVar("title", "Decision question", "Has the publication threshold been crossed?"), stringVar("measure", "Measure", "Services ready"), stringVar("value", "Measured value", "74%"), stringVar("threshold", "Threshold", "70%"), stringVar("status", "Status", "CROSSED"), stringVar("conditions", "Conditions", "Evidence complete;No critical exception"), stringVar("consequence", "Consequence", "Publish the guidance and open the support route."), stringVar("source", "Source", "GOVERNANCE RULE · SECTION 6")], markup: threshold() },
  { id: "time/ordered-steps", kind: "process", origins: ["tracing-beam", "grid-card-assemble"], variables: processVars("Complete the procedure in this order", "START · VERIFIED REQUEST", "01|Confirm|Check eligibility and scope;02|Prepare|Gather required records;03|Publish|Use the official channel;04|Retain|Keep confirmation for review", "RESULT · AUDITABLE SUBMISSION"), markup: processLayout() },
  { id: "time/milestone-timeline", kind: "timeline", origins: ["beat-timeline"], variables: processVars("Four dated milestones govern the rollout", "CURRENT MARKER · GUIDANCE", "12 SEP|Decision|Policy confirmed;20 SEP|Guidance|Official instructions published;01 OCT|Launch|New route opens;15 NOV|Review|First evidence checkpoint", "SOURCE · IMPLEMENTATION SCHEDULE"), markup: processLayout() },
  { id: "time/phased-roadmap", kind: "phases", origins: ["state-chip-rail", "grid-card-assemble"], variables: processVars("The programme advances through governed phases", "CURRENT PHASE · READINESS", "Phase 1|Confirm mandate|Gate: decision signed;Phase 2|Prepare delivery|Gate: 85% ready;Phase 3|Open service|Gate: public route live;Phase 4|Review outcomes|Gate: evidence complete", "ROADMAP · VERSION 3"), markup: processLayout() },
  { id: "time/rollout-lanes", kind: "lanes", origins: ["beat-timeline", "grid-card-assemble"], variables: [stringVar("kicker", "Kicker", "PARALLEL WORKSTREAMS"), stringVar("title", "Roadmap title", "Three delivery lanes converge on launch"), stringVar("summary", "Critical dependency", "Local training cannot close before national guidance is published."), stringVar("periods", "Periods", "DECISION|PREPARE|LAUNCH"), stringVar("lanes", "Lanes", "National|Approve policy|Publish guidance|Monitor;Regional|Assess capacity|Close gaps|Report;Local|Name owners|Train teams|Open service"), stringVar("source", "Source", "DELIVERY PLAN · CRITICAL DATES ONLY")], markup: lanes() },
  { id: "time/deadline-countdown", kind: "deadline", origins: ["titlecard-lockup", "grid-card-assemble"], variables: [stringVar("kicker", "Kicker", "IMPLEMENTATION WINDOW"), stringVar("title", "Deadline", "18 days remain"), stringVar("summary", "Context", "The final period is for evidence, publication and escalation."), stringVar("value", "Countdown", "D−18"), stringVar("items", "Actions", "Verify the register|Owner: Evidence;Publish guidance|Owner: Communications;Open support route|Owner: Service"), stringVar("source", "Source", "DEADLINE · 1 OCTOBER 2026")], markup: deadline() },
  { id: "time/handoff-flow", kind: "process", origins: ["tracing-beam"], variables: processVars("Responsibility moves with a named artifact", "HANDOFF CONTROL", "01|Policy team|Signed decision → region;02|Regional lead|Readiness return → service;03|Service owner|Published guidance → public;04|Review team|Outcome record → authority", "FINAL STATE · ACCOUNTABLE DELIVERY"), markup: processLayout() },
  { id: "system/dependency-network", kind: "network", origins: ["constellation-hub", "tracing-beam"], variables: [stringVar("kicker", "Kicker", "DEPENDENCY NETWORK"), stringVar("title", "System statement", "Delivery depends on five named controls"), stringVar("summary", "Interpretation", "Funding and guidance converge on service delivery; evidence closes the loop."), stringVar("nodes", "Nodes", "Mandate|Funding|Guidance|Delivery|Evidence"), stringVar("edges", "Directed edges", "Mandate>Funding;Mandate>Guidance;Funding>Delivery;Guidance>Delivery;Delivery>Evidence;Evidence>Mandate"), stringVar("source", "Source", "OPERATING MODEL · VERIFIED RELATIONSHIPS")], markup: network() },
  { id: "system/decision-flow", kind: "process", origins: ["tracing-beam", "state-chip-rail"], variables: processVars("The decision path includes a real exception", "DECISION CONTROL", "01|Assess evidence|Is the record complete?;YES|Approve|Confirm authority and threshold;NO|Return|Name the missing evidence;FINAL|Publish|Record decision and route", "OUTCOME · EVERY BRANCH HAS AN OWNER"), markup: processLayout() },
  { id: "media/media-left", kind: "media", mediaSide: "left", origins: ["particle-image-reveal", "line-by-line-slide"], variables: mediaVars("EVIDENCE IMAGE", "The source image establishes the decision context", "assets/authority-broadcast/media/style-master-a.png", "Approved Authority Broadcast reference frame", "Deadline remains visible;Presenter and content stay disjoint", "STYLE MASTER · APPROVED REFERENCE"), markup: media() },
  { id: "media/media-right", kind: "media", mediaSide: "right", origins: ["screen-flow-carousel", "line-by-line-slide"], variables: mediaVars("DOCUMENT READING", "The record and the interpretation remain side by side", "assets/authority-broadcast/media/style-master-b.png", "Implementation record · page 12", "Measure passes;Phase one begins with large institutions", "OFFICIAL RECORD · VERIFIED EXCERPT"), markup: media() },
  { id: "media/evidence-grid", kind: "media-grid", origins: ["screen-flow-carousel", "grid-card-assemble"], variables: [stringVar("kicker", "Kicker", "EVIDENCE SET"), stringVar("title", "Evidence statement", "Three records support the same conclusion"), stringVar("summary", "Interpretation", "Each item has a visible role, source label and source-backed image."), stringVar("image_1", "Primary image", "assets/authority-broadcast/media/style-master-a.png"), stringVar("caption_1", "Primary caption", "Approved presenter-led reference"), stringVar("image_2", "Second image", "assets/authority-broadcast/media/style-master-b.png"), stringVar("caption_2", "Second caption", "Decision and deadline structure"), stringVar("image_3", "Third image", "assets/authority-broadcast/media/presenter.png"), stringVar("caption_3", "Third caption", "Bundled identity reference"), stringVar("source", "Source", "AUTHORITY EVIDENCE SET · THREE ITEMS")], markup: mediaGrid() },
  { id: "media/evidence-hero", kind: "media", mediaSide: "left", origins: ["particle-image-reveal", "inline-highlight"], variables: mediaVars("PRIMARY EVIDENCE", "One record carries the decisive proof", "assets/authority-broadcast/media/style-master-b.png", "Official implementation record", "The effective date is explicit;The rollout condition is traceable", "OFFICIAL RECORD · PAGE 12"), markup: media() },
];

function compareVars(title, basis, leftLabel, leftItems, rightLabel, rightItems, condition) {
  return [stringVar("kicker", "Kicker", "TWO-SIDED READING"), stringVar("title", "Shared question", title), stringVar("summary", "Shared basis", basis), stringVar("left_label", "Left label", leftLabel), stringVar("left_items", "Left content", leftItems), stringVar("right_label", "Right label", rightLabel), stringVar("right_items", "Right content", rightItems), stringVar("condition", "Condition or conclusion", condition), stringVar("source", "Source", "DECISION BRIEF · VERIFIED")];
}
function statVars(kicker, title, value, unit, progress, summary, benchmark, source) {
  return [stringVar("kicker", "Kicker", kicker), stringVar("title", "Interpretation", title), stringVar("value", "Value", value), stringVar("unit", "Unit", unit), numberVar("progress", "Visual progress", progress, 0, 100), stringVar("summary", "Interpretation line", summary), stringVar("benchmark", "Benchmark", benchmark), stringVar("supports", "Supporting values", ""), stringVar("source", "Source", source)];
}
function processVars(title, summary, steps, source) {
  return [stringVar("kicker", "Kicker", "ORDER AND OWNERSHIP"), stringVar("title", "Process title", title), stringVar("summary", "Start, current marker, or rule", summary), stringVar("steps", "Ordered content", steps), stringVar("source", "Result or source", source)];
}
function mediaVars(kicker, title, image, caption, callouts, source) {
  return [stringVar("kicker", "Kicker", kicker), stringVar("title", "Headline", title), stringVar("summary", "Caption", caption), stringVar("image", "Image path", image), stringVar("callouts", "Callouts", callouts), stringVar("source", "Source", source)];
}

function header() { return '<header class="ab-header"><p class="ab-kicker" data-bind="kicker" data-optional></p><h1 class="ab-title" data-bind="title" data-motion="primary"></h1><p class="ab-summary" data-bind="summary" data-optional data-motion="secondary"></p></header>'; }
function footer() { return '<p class="ab-source" data-bind="source" data-optional data-motion="secondary"></p>'; }
function cards(key, columns) { return `<div class="ab-frame">${header()}<section class="ab-card-grid" data-cards="${key}" data-columns="${columns}"></section>${footer()}</div>`; }
function checklist() { return `<div class="ab-frame">${header()}<ul class="ab-checklist" data-list="items"></ul>${footer()}</div>`; }
function close() { return '<div class="ab-frame"><section class="ab-close"><p class="ab-kicker" data-bind="kicker" data-optional></p><h1 class="ab-title" data-bind="title" data-motion="primary"></h1><div class="ab-action" data-bind="action" data-motion="item"></div><p class="ab-meta" data-bind="meta" data-motion="secondary"></p><p class="ab-note" data-bind="disclosure" data-motion="secondary"></p><p class="ab-source" data-bind="source" data-motion="secondary"></p></section></div>'; }
function compare() { return `<div class="ab-frame">${header()}<section class="ab-compare-grid"><article class="ab-panel" data-motion="item"><p class="ab-label" data-bind="left_label"></p><ul class="ab-panel-list" data-list="left_items"></ul></article><article class="ab-panel" data-motion="item"><p class="ab-label" data-bind="right_label"></p><ul class="ab-panel-list" data-list="right_items"></ul></article></section><p class="ab-condition" data-bind="condition"></p>${footer()}</div>`; }
function stat(includeSupports = false) { return `<div class="ab-frame">${header()}<section class="ab-stat-grid"><div class="ab-ring" data-motion="secondary"><div class="ab-ring-copy"><span class="ab-value" data-bind="value"></span><span class="ab-unit" data-bind="unit"></span></div></div><article class="ab-stat-copy" data-motion="item"><p class="ab-takeaway" data-bind="summary"></p><p class="ab-benchmark" data-bind="benchmark"></p>${includeSupports ? '<div class="ab-supports"><span class="ab-support" data-bind="supports"></span></div>' : ''}</article></section>${footer()}</div>`; }
function table() { return `<div class="ab-frame">${header()}<div class="ab-table-wrap"><table class="ab-table"><thead><tr data-table-head="headers"></tr></thead><tbody data-table-rows="rows" data-highlight-key="highlight_row"></tbody></table></div>${footer()}</div>`; }
function bars() { return `<div class="ab-frame">${header()}<section class="ab-bars" data-bars="items"></section><p class="ab-takeaway" data-bind="takeaway"></p>${footer()}</div>`; }
function threshold() { return `<div class="ab-frame">${header()}<section class="ab-threshold-grid"><article class="ab-threshold-card" data-motion="item"><p class="ab-label" data-bind="measure"></p><strong class="ab-threshold-number" data-bind="value"></strong></article><article class="ab-threshold-card" data-motion="item"><p class="ab-label">Threshold</p><strong class="ab-threshold-number" data-bind="threshold"></strong></article><article class="ab-threshold-card" data-state="result" data-motion="item"><p class="ab-label">Decision</p><strong class="ab-threshold-number" data-bind="status"></strong></article></section><ul class="ab-panel-list" data-list="conditions"></ul><p class="ab-condition" data-bind="consequence"></p>${footer()}</div>`; }
function processLayout() { return `<div class="ab-frame">${header()}<section class="ab-flow" data-steps="steps"></section>${footer()}</div>`; }
function lanes() { return `<div class="ab-frame">${header()}<section class="ab-lanes" data-lanes="lanes" data-periods="periods"></section>${footer()}</div>`; }
function deadline() { return `<div class="ab-frame">${header()}<section class="ab-stat-grid"><div class="ab-ring" data-fixed-progress="100" data-motion="secondary"><div class="ab-ring-copy"><span class="ab-value" data-bind="value"></span></div></div><ul class="ab-checklist" data-list="items"></ul></section>${footer()}</div>`; }
function network() { return `<div class="ab-frame">${header()}<section class="ab-network" data-network="nodes" data-edges="edges"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg></section>${footer()}</div>`; }
function media() { return `<div class="ab-frame"><section class="ab-media-layout"><figure class="ab-media-card" data-motion="media"><img src="assets/authority-broadcast/media/style-master-a.png" data-media="image" alt="" /></figure><div class="ab-media-copy">${header()}<ul class="ab-callouts" data-list="callouts"></ul>${footer()}</div></section></div>`; }
function mediaGrid() { return `<div class="ab-frame">${header()}<section class="ab-media-grid"><figure data-motion="media"><img src="assets/authority-broadcast/media/style-master-a.png" data-media="image_1" alt="" /><figcaption data-bind="caption_1"></figcaption></figure><figure data-motion="media"><img src="assets/authority-broadcast/media/style-master-b.png" data-media="image_2" alt="" /><figcaption data-bind="caption_2"></figcaption></figure><figure data-motion="media"><img src="assets/authority-broadcast/media/presenter.png" data-media="image_3" alt="" /><figcaption data-bind="caption_3"></figcaption></figure></section>${footer()}</div>`; }

function adapterHtml(spec, duration) {
  const stem = spec.id.replace("/", "--");
  const compositionId = `authority-adapter-${stem}`;
  const variables = JSON.stringify(spec.variables).replaceAll("'", "&#39;");
  return `<!doctype html>
<!-- Content-ready Authority adapter. Official HyperFrames behavior origins: ${spec.origins.join(" + ")}. -->
<html lang="en" data-composition-id="${compositionId}" data-composition-duration="${duration}" data-authority-content-ready="true" data-registry-origin="${spec.origins.join(" + ")}" data-composition-variables='${variables}'>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <div id="root" data-composition-id="${compositionId}" data-duration="${duration}" data-width="1920" data-height="1080" data-fps="30">
        <style>@import url("assets/runtime/authority-layout-adapter.css");</style>
        <section id="${stem}-stage" class="authority-adapter-stage clip" data-authority-adapter-stage data-kind="${spec.kind}"${spec.mediaSide ? ` data-media-side="${spec.mediaSide}"` : ""} data-timeline-key="${compositionId}" data-start="0" data-duration="${duration}" data-track-index="0">
          ${spec.markup}
        </section>
        <script>
${adapterRuntime}
        </script>
      </div>
    </template>
  </body>
</html>
`;
}

function defaultValues(spec) { return Object.fromEntries(spec.variables.map(variable => [variable.id, variable.default])); }
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

fs.mkdirSync(outputRoot, { recursive: true });
const indexPath = path.join(projectRoot, "index.html");
if (!fs.existsSync(indexPath)) throw new Error(`Missing proof project index: ${indexPath}`);
let index = fs.readFileSync(indexPath, "utf8");

for (const spec of specs) {
  const stem = spec.id.replace("/", "--");
  const mountStem = spec.id.replace("/", "-");
  // Match by the stable mount id. Attribute values can legitimately contain `>`
  // (for example dependency edges), so an opening-tag-only expression is unsafe.
  const mountPattern = new RegExp(`<div\\s+id="mount-${escapeRegExp(mountStem)}"[\\s\\S]*?<\\/div>`);
  const match = index.match(mountPattern);
  if (!match) throw new Error(`Missing proof mount for ${spec.id}`);
  const duration = Number(match[0].match(/data-duration="([^"]+)"/)?.[1]);
  if (!Number.isFinite(duration)) throw new Error(`Missing duration for ${spec.id}`);
  const compositionId = `authority-adapter-${stem}`;
  const replacement = match[0]
    .replace(/data-registry-item="[^"]+"/, `data-registry-item="${spec.origins.join(" + ")}"`)
    .replace(/data-composition-id="[^"]+"/, `data-composition-id="${compositionId}"`)
    .replace(/data-composition-src="[^"]+"/, `data-composition-src="compositions/authority-adapters/${stem}.html"`)
    .replace(/\s+data-variable-values='[^']*'/, "")
    .replace(/(data-composition-src="[^"]+")/, `$1\n        data-variable-values='${JSON.stringify(defaultValues(spec)).replaceAll("'", "&#39;")}'`);
  index = index.replace(match[0], replacement);
  const scenePattern = new RegExp(`(<section\\s+id="scene-${escapeRegExp(mountStem)}"[\\s\\S]*?<div class="source-rail">)[^<]*(<\\/div>)`);
  index = index.replace(scenePattern, `$1HYPERFRAMES OFFICIAL BEHAVIORS · ${spec.origins.join(" + ")}$2`);
  fs.writeFileSync(path.join(outputRoot, `${stem}.html`), adapterHtml(spec, duration));
}

const projectAdapterRoot = path.join(projectRoot, "compositions/authority-adapters");
fs.mkdirSync(projectAdapterRoot, { recursive: true });
for (const spec of specs) {
  const stem = spec.id.replace("/", "--");
  fs.copyFileSync(path.join(outputRoot, `${stem}.html`), path.join(projectAdapterRoot, `${stem}.html`));
}
fs.mkdirSync(path.join(projectRoot, "assets/runtime"), { recursive: true });
for (const name of ["authority-layout-adapter.css", "authority-layout-adapter.js"]) {
  fs.copyFileSync(path.join(skillRoot, "assets/runtime", name), path.join(projectRoot, "assets/runtime", name));
}
const mediaRoot = path.join(projectRoot, "assets/authority-broadcast/media");
fs.mkdirSync(mediaRoot, { recursive: true });
fs.copyFileSync(path.join(skillRoot, "assets/style-master-a.png"), path.join(mediaRoot, "style-master-a.png"));
fs.copyFileSync(path.join(skillRoot, "assets/style-master-b.png"), path.join(mediaRoot, "style-master-b.png"));
fs.copyFileSync(path.join(skillRoot, "assets/presenters/p1.png"), path.join(mediaRoot, "presenter.png"));
fs.writeFileSync(indexPath, index);
console.log(`Built and wired ${specs.length} content-ready Authority adapters.`);
