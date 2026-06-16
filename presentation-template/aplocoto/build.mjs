#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outArg = process.argv[2] === "--out" ? process.argv[3] : "example.html";
const outPath = resolve(here, outArg || "example.html");

const meta = {
  title: "Tomorrow Lab",
  subtitle: "Play with great ideas",
  year: "2026",
  hashtag: "#PlayfulMinds",
  contact: "hello@tomorrowlab.example",
  url: "tomorrowlab.example",
};

const toc = [
  ["01", "About - who we are", "03", "var(--accent)"],
  ["02", "Work - what we make", "07", "var(--s1)"],
  ["03", "Proof - the impact", "11", "var(--s2)"],
  ["04", "Close - find us", "15", "var(--s3)"],
];

const vision = [
  ["Build for kids first", "Every choice begins with a young learner - clear, kind, joyful."],
  ["Make it joyful", "Curiosity is fragile. We protect it with playful tools and gentle defaults."],
  ["Practice over polish", "Daily repetition builds confidence faster than any one-off lesson."],
];

const team = [
  ["Jordy Koero", "Founder", "team-jordy"],
  ["Olivia Wolff", "Design lead", "team-olivia"],
  ["Daniel Musell", "Engineering", "team-daniel"],
  ["Jesse Roie", "Workshops", "team-jesse"],
];

const services = [
  ["star", "Play equipment", "Cardboard kits, wooden builds, soft modular sets.", "var(--g0)", "var(--t0)"],
  ["spark", "Interactive play panels", "Tactile, magnetic, room-friendly story scenes.", "var(--g1)", "var(--t1)"],
  ["pen", "Murals & walls", "Hand-painted classroom and bedroom murals.", "var(--g2)", "var(--t2)"],
  ["book", "Read-along bundles", "Audio + book + sticker packs sent monthly.", "var(--g3)", "var(--t3)"],
];

const steps = [
  ["01", "Discovery", "A playful audit of the child, room, curriculum, and daily routine."],
  ["02", "Prototype", "Quick sketches, storyboards, and cardboard models tested with families."],
  ["03", "Build", "Production with durable materials, friendly copy, and accessible defaults."],
  ["04", "Learn", "We measure use, collect stories, and tune the next release."],
];

const stats = [
  ["42k", "kits shipped"],
  ["180", "classrooms"],
  ["94%", "repeat use"],
];

const quotes = [
  ["The first kit that kept my twins busy without me hovering.", "Mara Chen", "Parent", "quote-mara"],
  ["It turns a corner of our classroom into a little invention studio.", "Tomas Reid", "Teacher", "quote-tomas"],
  ["Beautiful, robust, and calm enough to live in a real home.", "Priya Shah", "Retail partner", "quote-priya"],
];

const plans = [
  ["Starter", "$29", "per month", ["One monthly kit", "Parent guide", "Audio story"], false, "var(--g0)", "var(--t0)"],
  ["Studio", "$79", "per month", ["Three kit bundle", "Workshop cards", "Priority support"], true, "var(--g1)", "var(--t1)"],
  ["Classroom", "$249", "per month", ["12 learner packs", "Teacher notes", "Quarterly refresh"], false, "var(--g3)", "var(--t3)"],
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function starPoints(count = 28, inner = 36, outer = 49) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    points.push(`${(50 + Math.cos(angle) * r).toFixed(2)},${(50 + Math.sin(angle) * r).toFixed(2)}`);
  }
  return points.join(" ");
}

function burst(label = "", opts = {}) {
  const {
    fill = "var(--accent)",
    color = "var(--oa)",
    size = 5,
    textSize = size * 0.28,
    points = 28,
    inner = 36,
    style = "",
  } = opts;
  return `<div data-bbadge="1" style="position:relative;width:${size}cqw;height:${size}cqw;display:inline-flex;align-items:center;justify-content:center;${style}">
    <svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;display:block"><polygon points="${starPoints(points, inner)}" fill="${fill}"/></svg>
    <div style="position:relative;text-align:center;line-height:1;font-family:var(--fd);font-weight:600;font-size:${textSize}cqw;color:${color}">${esc(label)}</div>
  </div>`;
}

function positioned(html, style) {
  return `<div style="position:absolute;${style}">${html}</div>`;
}

function pill(text, opts = {}) {
  const { bg = "var(--g0)", color = "var(--t0)", style = "" } = opts;
  return `<span data-pill="1" style="display:inline-block;background:${bg};color:${color};padding:1cqh 1.6cqw;border-radius:999px;font-family:var(--fd);font-weight:600;font-size:1.3cqw;letter-spacing:.06em;text-transform:uppercase;${style}">${esc(text)}</span>`;
}

function photo(seed, style) {
  return `<div data-photocell="1" data-photo-seed="${esc(seed)}" style="position:absolute;background:var(--ph);overflow:hidden;${style}"></div>`;
}

function plus(style, color = "var(--ka)", opacity = 1) {
  return `<svg style="position:absolute;${style};width:1.8cqw;height:1.8cqw;opacity:${opacity}" viewBox="0 0 24 24"><path d="M12 3 V21 M3 12 H21" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
}

function icon(kind) {
  const paths = {
    star: '<polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9"/>',
    spark: '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    book: '<path d="M2 19V6a2 2 0 0 1 2-2h7v17H4a2 2 0 0 1-2-2zM22 19V6a2 2 0 0 0-2-2h-7v17h7a2 2 0 0 0 2-2z"/>',
    circle: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  };
  return `<svg viewBox="0 0 24 24" style="width:52%;height:52%;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round">${paths[kind] || paths.circle}</svg>`;
}

function slide(number, inner, stageStyle = "") {
  const page = number ? `<div class="pagenum">${String(number).padStart(2, "0")}</div>` : "";
  return `<div class="slide"><div class="stage" style="${stageStyle}">${inner}${page}</div></div>`;
}

function footer(opacity = 0.7, color = "inherit") {
  return `<div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:${opacity};color:${color}">${esc(meta.hashtag)}</div>`;
}

function tocItem([order, title, page, color]) {
  return `<div style="display:flex;align-items:baseline;gap:1.6cqw;padding:1.6cqh 0;border-bottom:1px solid color-mix(in srgb, var(--ink) 14%, transparent)">
      <div style="flex:none;color:${color};font-family:var(--fd);font-weight:600;font-size:1.7cqw;letter-spacing:.04em;width:5cqw">${esc(order)}</div>
      <h3 class="h3" style="flex:1;color:var(--ink);font-size:2.4cqw">${esc(title)}</h3>
      <div style="flex:none;color:var(--ink);opacity:.55;font-family:var(--fd);font-weight:500;font-size:1.4cqw;text-align:right;width:5cqw">${esc(page)}</div>
    </div>`;
}

function divider(chapter, title) {
  return slide("", `
    ${positioned(burst("", { size: 7 }), "left:3cqw;top:28cqh")}
    ${positioned(burst("", { fill: "var(--bg)", color: "var(--ink)", size: 6 }), "right:3cqw;bottom:22cqh")}
    ${positioned(burst("", { size: 4 }), "left:4cqw;bottom:12cqh")}
    ${positioned(pill(chapter), "right:4cqw;top:10cqh;z-index:3")}
    ${plus("left:5cqw;top:5cqh", "var(--bg)", 0.55)}
    ${plus("right:5cqw;bottom:11cqh", "var(--bg)", 0.55)}
    <div class="fit"><div style="position:absolute;left:22cqw;right:22cqw;top:32cqh;text-align:center">
      <div class="kicker" style="opacity:.7">${esc(chapter)}</div>
      <h1 class="display" style="font-size:7cqw;margin-top:2.4cqh;line-height:1">${esc(title)}</h1>
      <div style="margin-top:5cqh">${pill(meta.title)}</div>
    </div>${footer(0.6)}</div>`, "background:var(--ink);color:var(--bg)");
}

function numberItem(item, index) {
  const [title, body] = item;
  const colors = [
    ["var(--accent)", "var(--oa)"],
    ["var(--s1)", "var(--o1)"],
    ["var(--s2)", "var(--o2)"],
  ];
  const [fill, color] = colors[index];
  return `<div style="display:flex;gap:2cqw;align-items:flex-start;margin-bottom:3.4cqh">
      <div style="flex:none">${burst(String(index + 1).padStart(2, "0"), { fill, color, size: 7, points: 24, inner: 38 })}</div>
      <div style="flex:1;padding-top:.6cqh"><h3 class="h3">${esc(title)}</h3><p class="body" style="margin-top:.6cqh;opacity:.92">${esc(body)}</p></div>
    </div>`;
}

function teamCard([name, role, seed]) {
  return `<div data-device="team" style="display:flex;flex-direction:column;gap:1.2cqh">
      <div data-photocell="1" data-photo-seed="${esc(seed)}" style="position:relative;width:100%;aspect-ratio:1;background:var(--ph);border-radius:var(--r-md);overflow:hidden"></div>
      <div><h3 class="h3" style="color:var(--ink);font-size:1.7cqw">${esc(name)}</h3><p class="cap" style="color:var(--ink);opacity:.65;margin-top:.2cqh">${esc(role)}</p></div>
    </div>`;
}

function serviceCard([kind, title, body, bg, color]) {
  return `<div class="card" data-device="icon-cell" style="display:flex;gap:1.4cqw;align-items:flex-start;padding:2.4cqh 1.8cqw;">
      <div class="tile" data-tile="1" style="width:5cqw;height:5cqw;flex:none;background:${bg};color:${color}">${icon(kind)}</div>
      <div><h3 class="h3" style="color:var(--ink)">${esc(title)}</h3><p class="body soft" style="margin-top:.5cqh">${esc(body)}</p></div>
    </div>`;
}

function stepCard([num, title, body], index) {
  const color = ["var(--accent)", "var(--s1)", "var(--s2)", "var(--s3)"][index];
  return `<div style="position:relative;flex:1;padding-top:8cqh">
      <div style="position:absolute;top:0;left:0">${burst(num, { fill: color, color: index === 2 ? "var(--ink)" : "var(--bg)", size: 6, points: 24, inner: 38 })}</div>
      <h3 class="h3">${esc(title)}</h3>
      <p class="body soft" style="margin-top:.8cqh">${esc(body)}</p>
    </div>`;
}

function quoteCard([text, name, role, seed]) {
  return `<div class="card" style="padding:3cqh 2cqw;min-height:39cqh;display:flex;flex-direction:column;justify-content:space-between">
      <p class="lead" style="font-size:1.75cqw;line-height:1.35">"${esc(text)}"</p>
      <div style="display:flex;align-items:center;gap:1cqw;margin-top:3cqh">
        <div data-photocell="1" data-photo-seed="${esc(seed)}" style="width:4.5cqw;height:4.5cqw;background:var(--ph);border-radius:50%;overflow:hidden"></div>
        <div><h3 class="h3" style="font-size:1.55cqw">${esc(name)}</h3><p class="cap soft">${esc(role)}</p></div>
      </div>
    </div>`;
}

function planCard([tier, price, unit, features, popular, bg, color]) {
  const items = features.map((feature) => `<li>${esc(feature)}</li>`).join("");
  const popularPill = popular ? `<div style="margin-bottom:2cqh">${pill("Most popular", { bg: "var(--ink)", color: "var(--bg)" })}</div>` : "";
  return `<div style="background:${bg};color:${color};border-radius:var(--r-md);padding:3cqh 2cqw;min-height:45cqh;display:flex;flex-direction:column;justify-content:space-between">
      <div>${popularPill}<div class="kicker" style="opacity:.8">${esc(tier)}</div><div class="stat" style="margin-top:1.4cqh">${esc(price)}</div><p class="cap" style="opacity:.8;margin-top:.5cqh">${esc(unit)}</p></div>
      <ul class="body" style="list-style:none;display:flex;flex-direction:column;gap:.7cqh;opacity:.9">${items}</ul>
    </div>`;
}

function html() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(meta.title)} - deck</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#FFFDF7; --surface:#FFFFFF; --ink:#221C14; --soft:#5E564A; --ph:#EFEADF;
  --accent:#FF7A1A; --s1:#E5388E; --s2:#F5B73E; --s3:#1FB6A6;
  --oa:#FFFFFF; --o1:#FFFFFF; --o2:#15151A; --o3:#FFFFFF;
  --ka:#221C14; --kad:#FF7A1A;
  --g0:#ba5a17; --g1:#cb327f; --g2:#f5b73e; --g3:#187f75;
  --t0:#FFFFFF; --t1:#FFFFFF; --t2:#15131C; --t3:#FFFFFF;
  --fd:'Archivo'; --fb:'Manrope';
  --r-xs:.5cqw; --r-sm:.9cqw; --r-md:1.7cqw; --r-lg:3cqw; --r-xl:5cqw;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#cfd2d8;color:var(--ink);font-family:var(--fb),sans-serif;}
.deck{scroll-snap-type:y mandatory;height:100vh;overflow-y:scroll;}
.slide{width:100vw;height:100vh;scroll-snap-align:start;display:flex;background:#cfd2d8;}
.stage{position:relative;width:min(92vw,163.55vh);height:min(51.75vw,92vh);margin:auto;overflow:hidden;container-type:size;
  background:var(--bg);color:var(--ink);border:1px solid rgba(0,0,0,.12);box-shadow:0 14px 50px rgba(0,0,0,.2);}
.fit{position:absolute;inset:0;transform-origin:top center;}
.display{font-family:var(--fd);font-size:7cqw;font-weight:600;line-height:1;}
.h1{font-family:var(--fd);font-size:4.6cqw;font-weight:500;line-height:1.04;}
.h2{font-family:var(--fd);font-size:3.2cqw;font-weight:500;line-height:1.08;}
.h3{font-family:var(--fd);font-size:1.95cqw;font-weight:500;line-height:1.18;}
.stat{font-family:var(--fd);font-size:5.2cqw;font-weight:600;line-height:1;}
.kicker{font-family:var(--fd);font-size:1.15cqw;font-weight:500;letter-spacing:.20em;text-transform:uppercase;}
.lead{font-size:2cqw;font-weight:300;line-height:1.5;}
.body{font-size:1.5cqw;font-weight:400;line-height:1.5;}
.cap{font-size:1.2cqw;font-weight:400;line-height:1.4;letter-spacing:.02em;}
.pagenum{position:absolute;right:3cqw;bottom:3.2cqh;font-family:var(--fd);font-size:1cqw;font-weight:500;letter-spacing:.06em;opacity:.65;z-index:6;}
.tile{display:flex;align-items:center;justify-content:center;border-radius:var(--r-md);}
.badge{display:flex;align-items:center;justify-content:center;border-radius:var(--r-md);font-family:var(--fd);font-weight:600;}
.card{background:var(--surface);border-radius:var(--r-md);}
.soft{color:var(--soft);}
ul{padding-left:0}
</style>
</head>
<body>
<div class="deck" id="deck">
${slides().join("\n")}
</div>
</body>
</html>
`;
}

function slides() {
  return [
    slide(1, `
      ${photo("cover-r", "right:6cqw;top:14cqh;width:22cqw;height:22cqw;border-radius:50%;opacity:.85;z-index:1")}
      ${photo("cover-l", "left:5cqw;top:50cqh;width:20cqw;height:20cqw;border-radius:50%;opacity:.85;z-index:1")}
      ${plus("right:5cqw;top:5cqh", "var(--t2)")}
      ${plus("left:5cqw;bottom:11cqh", "var(--t2)")}
      ${positioned(burst(meta.year, { fill: "var(--ink)", color: "var(--bg)", size: 7, textSize: 1.96 }), "left:5cqw;top:3cqh;z-index:3")}
      ${positioned(burst("", { fill: "var(--ink)", color: "var(--bg)", size: 5 }), "right:8cqw;bottom:11cqh;z-index:3")}
      <div class="fit"><div style="position:absolute;left:14cqw;right:14cqw;top:18cqh;text-align:center;z-index:4">
        <h1 class="display" style="font-size:6.6cqw;line-height:.98;text-transform:uppercase">${esc(meta.subtitle).replaceAll(" ", "<br>")}</h1>
      </div>
      <div style="position:absolute;left:50%;top:75cqh;transform:translateX(-50%);z-index:5">${pill(meta.title, { bg: "var(--ink)", color: "var(--bg)" })}</div>
      ${footer(1, "var(--t2)")}</div>`, "background:var(--g2);color:var(--t2)"),

    slide(2, `
      ${positioned(burst("", { size: 5 }), "right:6cqw;top:6cqh;z-index:3")}
      ${positioned(burst("", { size: 4 }), "left:5cqw;bottom:11cqh;z-index:3")}
      ${plus("left:5cqw;top:5cqh")}
      ${plus("right:5cqw;bottom:11cqh")}
      <div class="fit"><div style="position:absolute;left:8cqw;top:11cqh;width:48cqw">
        <div class="kicker" style="color:var(--ka)">Agenda</div>
        <h1 class="h1" style="margin-top:1.4cqh">What's<br>inside</h1>
      </div>
      <div style="position:absolute;right:8cqw;top:14cqh;width:36cqw">${toc.map(tocItem).join("")}</div>
      ${footer()}</div>`),

    divider("Chapter 01", "About"),

    slide(4, `
      ${photo("about-portrait", "left:6cqw;top:11cqh;width:32cqw;height:78cqh;border-radius:var(--r-lg)")}
      ${positioned(burst("", { size: 5 }), "left:32cqw;top:5cqh;z-index:3")}
      ${plus("right:5cqw;top:5cqh")}
      ${plus("right:5cqw;bottom:11cqh")}
      <div class="fit"><div style="position:absolute;right:6cqw;top:13cqh;width:40cqw">
        <div class="kicker" style="color:var(--ka)">About us</div>
        <h1 class="h1" style="margin-top:1.4cqh">A small studio<br>building joyful tools</h1>
        <p class="lead" style="margin-top:2.6cqh">We make learning toys, books, and apps for the under-tens - built by parents, tested by classrooms, used by families.</p>
        <p class="body" style="margin-top:2cqh;max-width:38cqw;opacity:.88">Founded in 2022 in a single room with a sketch wall, a pile of cardboard, and a stubborn belief that kids deserve better than another bright-button app.</p>
        <div style="margin-top:4.5cqh;display:flex;gap:1cqw">${pill("Education")}${pill("Play", { bg: "var(--g1)", color: "var(--t1)" })}</div>
      </div>${footer()}</div>`),

    slide(5, `
      <div style="position:absolute;inset:0;background:var(--bg);z-index:0"></div>
      <div style="position:absolute;inset:0;background:var(--ink);clip-path:polygon(0 0, 42% 0, 36% 100%, 0 100%);z-index:0"></div>
      ${positioned(burst("", { fill: "var(--bg)", color: "var(--ink)", size: 8 }), "left:5cqw;top:14cqh;z-index:3")}
      <div style="position:absolute;left:5cqw;top:50cqh;z-index:3;display:flex;flex-direction:column;gap:1.4cqh;align-items:flex-start">
        ${pill("#Favorite", { bg: "var(--bg)", color: "var(--ink)" })}
        ${pill("#Havefun", { bg: "var(--bg)", color: "var(--ink)", style: "margin-left:1.6cqw" })}
      </div>
      ${plus("left:5cqw;bottom:11cqh;z-index:3", "var(--bg)", 0.6)}
      ${positioned(burst("", { size: 5 }), "right:6cqw;bottom:6cqh;z-index:3")}
      <div class="fit"><div style="position:absolute;right:6cqw;top:11cqh;width:46cqw">
        <div class="kicker" style="color:var(--ka)">What we believe</div>
        <h1 class="h1" style="margin-top:1.4cqh;font-size:5.4cqw;line-height:.98">Our<br>Vision</h1>
        <div style="margin-top:3cqh">${vision.map(numberItem).join("")}</div>
      </div></div>`),

    slide(6, `
      ${positioned(burst("", { size: 5 }), "right:6cqw;top:6cqh;z-index:3")}
      ${positioned(burst("", { size: 3 }), "left:1cqw;top:1cqh;z-index:3")}
      ${plus("left:5cqw;top:5cqh")}
      ${plus("right:5cqw;bottom:11cqh")}
      <div class="fit"><div style="position:absolute;left:6cqw;top:11cqh">
        <div class="kicker" style="color:var(--ka)">Our makers</div>
        <h1 class="h1" style="margin-top:1.4cqh">Meet the team</h1>
      </div>
      <div style="position:absolute;left:6cqw;right:6cqw;top:36cqh;bottom:11cqh">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.6cqw;width:100%">${team.map(teamCard).join("")}</div>
      </div>${footer()}</div>`),

    divider("Chapter 02", "Work"),

    slide(8, `
      ${positioned(burst("", { size: 5 }), "right:6cqw;bottom:11cqh;z-index:3")}
      ${plus("left:5cqw;top:5cqh")}
      ${plus("right:5cqw;top:5cqh")}
      <div class="fit"><div style="position:absolute;left:6cqw;top:11cqh;width:48cqw">
        <div class="kicker" style="color:var(--ka)">What we offer</div>
        <h1 class="h1" style="margin-top:1.4cqh">Services</h1>
        <p class="body" style="margin-top:2cqh;max-width:42cqw;opacity:.84">Four playful disciplines, one curious approach - pick the mix that fits your family or classroom.</p>
      </div>
      <div style="position:absolute;left:6cqw;right:6cqw;top:42cqh">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2cqw;">${services.map(serviceCard).join("")}</div>
      </div>${footer()}</div>`),

    slide(9, `
      ${positioned(burst("", { size: 5 }), "left:5cqw;top:6cqh;z-index:3")}
      ${plus("right:5cqw;top:5cqh")}
      <div class="fit"><div style="position:absolute;left:6cqw;top:11cqh;width:50cqw">
        <div class="kicker" style="color:var(--ka)">How it works</div>
        <h1 class="h1" style="margin-top:1.4cqh">From spark<br>to shelf</h1>
      </div>
      <div style="position:absolute;left:6cqw;right:6cqw;top:43cqh;display:flex;gap:2cqw">
        <div style="position:absolute;left:0;right:0;top:2.8cqh;height:.4cqh;background:var(--ink);opacity:.12"></div>
        ${steps.map(stepCard).join("")}
      </div>${footer()}</div>`),

    slide(10, `
      <div class="fit"><div style="position:absolute;left:6cqw;top:8cqh;width:34cqw;z-index:3">
        <div class="kicker" style="color:var(--ka)">Gallery</div>
        <h1 class="h1" style="margin-top:1.4cqh">Things we<br>make</h1>
        <p class="body" style="margin-top:2cqh">A fast scan of products, rooms, workshops, and prototype rituals.</p>
      </div>
      ${photo("gallery-a", "left:43cqw;top:7cqh;width:24cqw;height:27cqh;border-radius:var(--r-md)")}
      ${photo("gallery-b", "left:68cqw;top:12cqh;width:20cqw;height:35cqh;border-radius:var(--r-md)")}
      ${photo("gallery-c", "left:8cqw;top:50cqh;width:30cqw;height:32cqh;border-radius:var(--r-md)")}
      ${photo("gallery-d", "left:40cqw;top:42cqh;width:31cqw;height:39cqh;border-radius:var(--r-md)")}
      ${photo("gallery-e", "left:73cqw;top:55cqh;width:17cqw;height:24cqh;border-radius:var(--r-md)")}
      <div style="position:absolute;left:54cqw;top:35cqh;z-index:5">${pill("#Build")}</div>
      <div style="position:absolute;left:21cqw;top:78cqh;z-index:5">${pill("#Play")}</div>
      ${footer()}</div>`),

    divider("Chapter 03", "Proof"),

    slide(12, `
      <div style="position:absolute;left:-8cqw;top:10cqh;width:48cqw;height:48cqw;border-radius:50%;background:var(--g2);"></div>
      ${positioned(burst("", { fill: "var(--ink)", color: "var(--bg)", size: 5 }), "right:7cqw;top:7cqh;z-index:3")}
      <div class="fit"><div style="position:absolute;left:8cqw;top:16cqh;width:38cqw">
        <div class="kicker">Impact</div>
        <h1 class="h1" style="margin-top:1.4cqh">Proof in<br>the wild</h1>
        <p class="body" style="margin-top:2cqh">Families and teachers use the system across homes, shops, and classrooms.</p>
      </div>
      <div style="position:absolute;right:7cqw;top:19cqh;width:42cqw;display:grid;grid-template-columns:1fr;gap:2cqh">
        ${stats.map(([value, caption], i) => `<div class="card" style="padding:2.2cqh 2cqw;display:flex;align-items:center;gap:2cqw"><div>${burst(value, { fill: ["var(--accent)", "var(--s1)", "var(--s3)"][i], color: i === 0 ? "var(--bg)" : "var(--o1)", size: 8, textSize: 2.05 })}</div><h3 class="h3">${esc(caption)}</h3></div>`).join("")}
      </div>${footer()}</div>`),

    slide(13, `
      ${positioned(burst("", { size: 5 }), "right:6cqw;top:6cqh;z-index:3")}
      <div class="fit"><div style="position:absolute;left:6cqw;top:10cqh;width:54cqw">
        <div class="kicker">What people say</div>
        <h1 class="h1" style="margin-top:1.4cqh">Loved by<br>families</h1>
      </div>
      <div style="position:absolute;left:6cqw;right:6cqw;top:42cqh;display:grid;grid-template-columns:repeat(3,1fr);gap:2cqw">${quotes.map(quoteCard).join("")}</div>
      ${footer()}</div>`),

    slide(14, `
      ${positioned(burst("", { size: 5 }), "right:6cqw;top:6cqh;z-index:3")}
      <div class="fit"><div style="position:absolute;left:6cqw;top:9cqh;width:56cqw">
        <div class="kicker">Pricelist</div>
        <h1 class="h1" style="margin-top:1.4cqh">Simple ways<br>to start</h1>
        <p class="body" style="margin-top:1.6cqh;max-width:42cqw">Choose a monthly path and change it as children, rooms, and classroom needs evolve.</p>
      </div>
      <div style="position:absolute;left:6cqw;right:6cqw;top:43cqh;display:grid;grid-template-columns:repeat(3,1fr);gap:2cqw">${plans.map(planCard).join("")}</div>
      ${footer()}</div>`),

    slide(15, `
      ${positioned(burst(meta.year, { fill: "var(--accent)", color: "var(--oa)", size: 8, textSize: 2.2 }), "left:6cqw;top:7cqh;z-index:3")}
      ${positioned(burst("", { fill: "var(--bg)", color: "var(--ink)", size: 6 }), "right:7cqw;bottom:12cqh;z-index:3")}
      ${plus("right:5cqw;top:5cqh", "var(--bg)", 0.65)}
      ${plus("left:5cqw;bottom:11cqh", "var(--bg)", 0.65)}
      <div class="fit"><div style="position:absolute;left:12cqw;right:12cqw;top:25cqh;text-align:center">
        <div class="kicker" style="opacity:.75">Thank you</div>
        <h1 class="display" style="margin-top:2cqh;font-size:7.2cqw;line-height:.98">Let's play<br>again</h1>
        <div style="margin-top:5cqh">${pill(meta.title)}</div>
        <p class="lead" style="margin-top:4cqh">${esc(meta.contact)}<br>${esc(meta.url)}</p>
      </div>${footer(0.62, "var(--bg)")}</div>`, "background:var(--ink);color:var(--bg)"),
  ];
}

writeFileSync(outPath, html(), "utf8");
console.log(`Wrote ${outPath}`);
