/* devices.mjs — structured SLIDE-DEVICE library (the "grammar" layer).
 * Compose a deck by assembling these correct, parameterised blocks instead of
 * hand-drawing each slide. Every device:
 *   - sizes in stage-relative cqw/cqh,
 *   - uses contrast-safe grounds (--g0..--g3 / --t0..--t3) for text-on-fill and
 *     raw --accent/--s1/--s2/--s3 for decoration,
 *   - carries data-* hooks so qa-deck.mjs can assert composition invariants.
 * Shapes come from shapes.mjs (parametric/symmetric). */
import { asterisk8, sparkle4, checker, semiPair, chevronStack, diamondInSquare, clover4, quarterPetals, sunburst, blob, doodleSpark } from './shapes.mjs';
const SHAPE = { asterisk8, sparkle4, checker, semiPair, chevronStack, diamondInSquare, clover4, quarterPetals, sunburst, blob, doodleSpark };
const HUE = ['accent','s1','s2','s3'];                 // decorative hues
const ON  = {accent:'oa', s1:'o1', s2:'o2', s3:'o3'};  // on-colour for a raw hue
const G   = {accent:'g0', s1:'g1', s2:'g2', s3:'g3'};  // contrast-safe text ground
const T   = {accent:'t0', s1:'t1', s2:'t2', s3:'t3'};  // text colour on that ground

/* MOSAIC GRID — the source's signature: equal square tiles on a strict grid,
   each holding one centred shape. Decoration as a designed block, never a loose cluster. */
export function mosaicGrid({rows=3, cols=2, tile=7, gap=0.7, cells=null, style=''}){
  const seq = cells || Array.from({length:rows*cols}, (_,i)=>({
    shape:['sparkle4','clover4','checker','semiPair','asterisk8','diamondInSquare','quarterPetals','chevronStack'][i%8],
    hue:HUE[i%HUE.length]
  }));
  const tiles = seq.map(c=>{
    const inner = c.shape && SHAPE[c.shape] ? `<svg viewBox="0 0 100 100" style="width:62%;height:62%">${SHAPE[c.shape](`var(--${ON[c.hue]})`)}</svg>` : '';
    return `<div class="mtile" data-mtile="1" style="display:flex;align-items:center;justify-content:center;width:${tile}cqw;height:${tile}cqw;background:var(--${c.hue})">${inner}</div>`;
  }).join('');
  return `<div class="mosaic" data-mosaic="1" data-cols="${cols}" data-tile="${tile}" style="display:grid;grid-template-columns:repeat(${cols},${tile}cqw);gap:${gap}cqw;${style}">${tiles}</div>`;
}

/* PROCESS SPINE — the right way to show a sequence (replaces the stray "timeline" line):
   circular numbered nodes on ONE clean line through their centres, labels alternating
   above/below. The connector is anchored node1→nodeN (data-connector for the linter). */
export function processSpine(steps, {h=46, node=6, gap=2.6, tone=null}={}){
  // tone:'ink' → all nodes use the ink ground (dark circle, light numeral/icon). Keeps the
  // node high-contrast on LIGHT stages where a hue-rotated g-ground would be too pale to
  // clear SHAPE-CONTRAST. Default (null) = the original per-hue rotation (unchanged).
  const n = steps.length, colpc = 100/n, half = colpc/2, clear = node/2 + gap; // labels anchored OUTSIDE the circle
  // connector sits at the device's vertical centre and spans node1→nodeN centres
  const line = `<div data-connector="1" style="position:absolute;left:${half}%;right:${half}%;top:50%;height:.55cqh;background:color-mix(in srgb, var(--ink) 24%, transparent);transform:translateY(-50%);z-index:0"></div>`;
  const nodes = steps.map((s,i)=>{
    const hue=HUE[i%HUE.length], above=i%2===0;
    // label anchored a FIXED clearance beyond the node edge → grows away from the circle, never onto it
    const pos = above ? `bottom:calc(50% + ${clear}cqw)` : `top:calc(50% + ${clear}cqw)`;
    const label = `<div style="position:absolute;left:50%;transform:translateX(-50%);${pos};width:92%;text-align:center"><div class="kicker" style="color:var(--ka)">Step 0${i+1}</div><h3 class="h3" style="margin-top:.4cqh">${s.title}</h3><p class="body soft" style="margin-top:.3cqh">${s.body}</p></div>`;
    // node centred on the line (top:50%) so the connector always passes through every node centre
    const nbg = tone==='ink' ? 'var(--ink)' : `var(--${G[hue]})`, ntx = tone==='ink' ? 'var(--bg)' : `var(--${T[hue]})`;
    const nodeEl = `<div class="tile" data-node="1" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${node}cqw;height:${node}cqw;border-radius:50%;background:${nbg};color:${ntx}">${s.icon||''}</div>`;
    return `<div style="position:relative;z-index:1;width:${colpc}%;height:100%">${label}${nodeEl}</div>`;
  }).join('');
  return `<div data-device="process" style="position:relative;display:flex;height:${h}cqh;">${line}${nodes}</div>`;
}

/* CASE CARD ROW — the source's distinctive structured card: full-height left accent bar,
   corner number badge, image placeholder, coloured caption panel, chevron-stack accent. */
export function caseCardRow(items){
  const cards = items.map((it,i)=>{
    const hue=HUE[i%HUE.length];
    return `<div class="ccard" data-device="case" style="position:relative;background:var(--surface);border-radius:var(--r-md);overflow:hidden;display:flex;flex-direction:column;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:1.3cqw;background:var(--${hue});z-index:2"></div>
      <div class="badge" data-badge="1" style="position:absolute;left:2cqw;top:2cqh;width:4cqw;height:4cqw;background:var(--${G[hue]});color:var(--${T[hue]});z-index:3">0${i+1}</div>
      <div style="height:15cqh;background:var(--ph);margin-left:1.3cqw"></div>
      <div style="flex:1;background:var(--${G[hue]});color:var(--${T[hue]});padding:2.4cqh 1.6cqw 2.4cqh 2.4cqw;">
        <h3 class="h3">${it.title}</h3>
        <p class="body" style="color:var(--${T[hue]});opacity:.9;margin-top:.6cqh">${it.body}</p>
      </div>
      <svg data-chev="1" viewBox="0 0 100 100" style="position:absolute;left:1.8cqw;bottom:1.6cqh;width:4cqw;height:4cqw;z-index:3">${chevronStack(`var(--${hue})`,3)}</svg>
    </div>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:2cqw;height:100%;">${cards}</div>`;
}

/* ICON QUADRANT — 2×2 icon-tile + heading + body (Industry-Trends / What-Sets-Us-Apart).
   data-device per cell so the qa-deck TEXT-NEAR-SHAPE check exempts the intentional
   tile-↔-heading flex adjacency. */
export function iconQuad(items){
  const cells = items.slice(0,4).map((it,i)=>{
    const hue=HUE[i%HUE.length];
    return `<div class="card" data-device="icon-cell" style="display:flex;gap:1.4cqw;align-items:flex-start;padding:2.4cqh 1.8cqw;">
      <div class="tile" data-tile="1" style="width:5cqw;height:5cqw;flex:none;background:var(--${G[hue]});color:var(--${T[hue]})">${it.icon||''}</div>
      <div><h3 class="h3" style="color:var(--ink)">${it.title}</h3><p class="body soft" style="margin-top:.5cqh">${it.body}</p></div>
    </div>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2cqw;">${cells}</div>`;
}

/* BURST BADGE — scalloped sunburst rosette holding centred content (number / year / %).
   The atom for Aplocoto's "stat-as-graphic" + numeral usage. Hue picks decoration colour;
   on-colour text is auto from --o*. Content uses inline-only styles (no tracked class) so
   the linter treats the badge as decoration — the burst polygon + on-colour text are
   visually AA-safe by construction. */
export function burstBadge({content='', hue='accent', size=8, points=14, depth=14, fontSize=null}){
  // hue='ink' / 'bg' give an inverse-luminance burst always opposite to bg/ink — useful
  // when the slide ground is itself a saturated colour and no accent reliably contrasts.
  const fillVar = hue==='ink' ? 'var(--ink)' : hue==='bg' ? 'var(--bg)' : `var(--${hue})`;
  const onVar = hue==='ink' ? 'var(--bg)' : hue==='bg' ? 'var(--ink)' : `var(--${ON[hue]})`;
  const fs = fontSize || size * 0.28;
  return `<div data-bbadge="1" style="position:relative;width:${size}cqw;height:${size}cqw;display:inline-flex;align-items:center;justify-content:center">
    <svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;display:block">${sunburst(fillVar, points, depth)}</svg>
    <div style="position:relative;text-align:center;line-height:1;font-family:var(--fd);font-weight:600;font-size:${fs}cqw;letter-spacing:-.01em;color:${onVar}">${content}</div>
  </div>`;
}

/* NUMBERED LIST — vertical N-item list anchored by a burst-badge (or plain) numeral
   on the left, with title + body on the right. Different shape from iconQuad (2×2)
   and processSpine (horizontal flow). */
export function numberedList({items, numeral='burst', hueRotate=true}){
  const rows = items.map((it,i)=>{
    const hue = hueRotate ? HUE[i%HUE.length] : 'accent';
    const num = String(i+1).padStart(2,'0');
    const anchor = numeral==='burst'
      ? burstBadge({content:num, hue, size:7, points:12, depth:12, contentClass:'h3'})
      : `<div class="badge" data-badge="1" style="width:5cqw;height:5cqw;background:var(--${G[hue]});color:var(--${T[hue]})">${num}</div>`;
    return `<div style="display:flex;gap:2cqw;align-items:flex-start;margin-bottom:3.4cqh">
      <div style="flex:none">${anchor}</div>
      <div style="flex:1;padding-top:.6cqh"><h3 class="h3">${it.title}</h3><p class="body" style="margin-top:.6cqh;opacity:.92">${it.body}</p></div>
    </div>`;
  }).join('');
  return `<div data-device="numbered-list" style="display:flex;flex-direction:column;width:100%">${rows}</div>`;
}

/* PRICE CARD ROW — N equal colour-blocked cards with a giant price + kicker tier
   + feature lines. Different from caseCardRow (which carries an image + accent bar);
   here the price IS the visual. Local hue rotation puts s2 in the middle column so
   the optional `tag` (e.g. "Most popular") clears contrast across every palette
   — Mono Ink's s1 collides with ink otherwise.
   `tag?` — when set on a card, renders an ink-pill INSIDE the card top as the
   card's own "premium" label. This makes the tag a structural attribute of the
   card (subordinate relationship), not a free-floating shape near the deck's
   body text — fixes both the contrast and the proximity issues (2026-06-16). */
export function priceCardRow({cards}){
  const ROTATE=['accent','s2','s1','s3'];
  const items = cards.map((c,i)=>{
    const hue = ROTATE[i%ROTATE.length];
    const feats = (c.features||[]).map(f=>`<div class="body" style="margin-top:.8cqh;opacity:.92">• ${f}</div>`).join('');
    const tag = c.tag ? `<div style="align-self:flex-start;background:var(--ink);color:var(--bg);padding:.7cqh 1.2cqw;border-radius:999px;font-family:var(--fd);font-weight:600;font-size:1.15cqw;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2cqh">${c.tag}</div>` : '';
    return `<div data-device="price" style="background:var(--${G[hue]});color:var(--${T[hue]});border-radius:var(--r-lg);padding:3.2cqh 2cqw;display:flex;flex-direction:column;height:100%">
      ${tag}
      <div class="kicker" style="opacity:.85">${c.tier||'Plan'}</div>
      <div style="display:flex;align-items:baseline;gap:.4cqw;margin-top:2cqh">
        <span class="h1" style="line-height:1">${c.price||''}</span>
        <span class="cap" style="opacity:.8">${c.unit||''}</span>
      </div>
      <div style="height:1px;background:currentColor;opacity:.25;margin:2.2cqh 0 .4cqh"></div>
      ${feats}
    </div>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(${cards.length},1fr);gap:2cqw;height:100%">${items}</div>`;
}

/* ANGLED SPLIT — diagonal two-tone background, the source's signature space device.
   Renders as a backdrop of `rightHue` plus a clip-pathed `leftHue` panel whose seam
   tilts by `angle` degrees. Both sides are full-bleed; content sits over either side
   via absolute positioning. Hues are role keys (`ink`, `bg`, `accent`, `s1`-`s3`) or
   pre-resolved CSS strings. */
export function angledSplit({leftHue='ink', rightHue='bg', angle=6, leftWidth=56}){
  const css=(v)=>v.startsWith('#')||v.startsWith('var')?v:`var(--${v})`;
  const lf=css(leftHue), rf=css(rightHue);
  // polygon: top-left, top-right (leftWidth%), bottom-right (leftWidth - angle)%, bottom-left
  const topX=leftWidth, botX=Math.max(2,leftWidth-angle);
  return `<div data-angle="1" style="position:absolute;inset:0;background:${rf};z-index:0"></div>
<div data-angle="1" style="position:absolute;inset:0;background:${lf};clip-path:polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%);z-index:0"></div>`;
}

/* BIG CIRCLE PANEL — oversized disc bleeding off one edge; the source's "giant
   quarter-circle into a colour field" device. NOT a placeholder — this is a
   coloured background layer that the rest of the slide composes against. */
export function bigCirclePanel({hue='accent', position='right', size=72, opacity=1}){
  const half=size/2;
  const place={
    right:`right:-${half}cqw;top:50%;transform:translateY(-50%)`,
    left :`left:-${half}cqw;top:50%;transform:translateY(-50%)`,
    tr   :`right:-${half}cqw;top:-${half*0.56}cqh`,
    tl   :`left:-${half}cqw;top:-${half*0.56}cqh`,
    br   :`right:-${half}cqw;bottom:-${half*0.56}cqh`,
    bl   :`left:-${half}cqw;bottom:-${half*0.56}cqh`,
  }[position]||'right:0;top:0';
  return `<div data-bigcircle="1" style="position:absolute;${place};width:${size}cqw;height:${size}cqw;background:var(--${hue});border-radius:50%;opacity:${opacity};z-index:1"></div>`;
}

/* TOC LIST — vertical agenda list. Each row = section number + label + page number on
   the right with a dotted leader rule. Different from numberedList (no body para,
   numbered with a page anchor not a step). */
export function tocList({items, hueRotate=true}){
  const rows = items.map((it,i)=>{
    const hue = it.hue || (hueRotate ? HUE[i%HUE.length] : 'accent');
    const num = String(i+1).padStart(2,'0');
    return `<div style="display:flex;align-items:baseline;gap:1.6cqw;padding:1.6cqh 0;border-bottom:1px solid color-mix(in srgb, var(--ink) 14%, transparent)">
      <div style="flex:none;color:var(--${hue});font-family:var(--fd);font-weight:600;font-size:1.7cqw;letter-spacing:.04em;width:5cqw">${num}</div>
      <h3 class="h3" style="flex:1;color:var(--ink);font-size:2.4cqw">${it.label}</h3>
      <div style="flex:none;color:var(--ink);opacity:.55;font-family:var(--fd);font-weight:500;font-size:1.4cqw;text-align:right;width:5cqw">${String(it.page).padStart(2,'0')}</div>
    </div>`;
  }).join('');
  return `<div data-device="toc" style="display:flex;flex-direction:column;width:100%">${rows}</div>`;
}

/* TEAM GRID — multi-person card grid. Each card = photo placeholder on top +
   name + role. data-photocell on photo so apply-training-photos can swap with
   real images during training renders. */
export function teamGrid({members, cols=4, aspect='1'}){
  const cards = members.map((m,i)=>{
    return `<div data-device="team" style="display:flex;flex-direction:column;gap:1.2cqh">
      <div data-photocell="1" data-photo-seed="${m.seed||'team-'+i}" style="position:relative;width:100%;aspect-ratio:${aspect};background:var(--ph);border-radius:var(--r-md);overflow:hidden"></div>
      <div>
        <h3 class="h3" style="color:var(--ink);font-size:1.7cqw">${m.name}</h3>
        <p class="cap" style="color:var(--ink);opacity:.65;margin-top:.2cqh">${m.role}</p>
      </div>
    </div>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:1.6cqw;width:100%">${cards}</div>`;
}

/* QUOTE CARDS — N testimonial cards in a row. Each card has a big quotation mark,
   the quote text, and a name/role/company line with a small round photo. Colour-
   blocked grounds (rotating hues) — text uses contrast-safe --tN on top. */
export function quoteCards({quotes}){
  const items = quotes.map((q,i)=>{
    const hue = HUE[i%HUE.length];
    return `<div data-device="quote" style="background:var(--${G[hue]});color:var(--${T[hue]});border-radius:var(--r-lg);padding:3cqh 2cqw;display:flex;flex-direction:column;height:100%">
      <div style="font-family:var(--fd);font-weight:700;font-size:5cqw;line-height:.6;opacity:.45">"</div>
      <p class="body" style="margin-top:.4cqh;flex:1">${q.text}</p>
      <div style="margin-top:2cqh;display:flex;align-items:center;gap:1cqw">
        <div data-photocell="1" data-photo-seed="${q.seed||'quote-'+i}" style="position:relative;width:4cqw;height:4cqw;background:var(--ph);border-radius:50%;overflow:hidden;flex:none"></div>
        <div style="min-width:0">
          <div style="font-family:var(--fd);font-weight:600;font-size:1.4cqw;line-height:1.1">${q.name}</div>
          <div class="cap" style="opacity:.85;font-size:1.1cqw">${q.role}${q.company?', '+q.company:''}</div>
        </div>
      </div>
    </div>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(${quotes.length},1fr);gap:2cqw;height:100%">${items}</div>`;
}

/* BIG STAT HERO — the agency-deck signature: ONE giant number anchored against
   white space + short caption. Different from stat-cell (which lives in a row of
   3+) and from burstBadge (which wraps the number in a scallop). Here the digit
   IS the page. Hue 'ink'/'bg' supported for max-contrast on light/dark grounds. */
export function bigStatHero({value, caption='', hue='accent', size=18}){
  const color = hue==='ink' ? 'var(--ink)' : hue==='bg' ? 'var(--bg)' : `var(--${hue})`;
  return `<div data-device="big-stat" style="display:flex;flex-direction:column;align-items:flex-start">
    <div style="font-family:var(--fd);font-weight:700;font-size:${size}cqw;line-height:.85;letter-spacing:-.035em;color:${color}">${value}</div>
    ${caption?`<p class="body" style="margin-top:3cqh;max-width:36cqw;opacity:.85">${caption}</p>`:''}
  </div>`;
}

/* MULTI-COLOUR TITLE — the source's per-word coloured headline (the "color 文字" motif).
   `parts` = array of {text, hue} where hue ∈ 'ink'|'accent'|'s1'|'s2'|'s3' (rendered with the
   AA-safe text vars --ka/--k1..--k3, so a too-light hue auto-falls back to ink), OR
   {text, marker} where marker is a hue key → that word gets a MARKER-HIGHLIGHT: an irregular
   rounded colour-field BEHIND the word (the "不规则图形作为部分文字的背景" motif), using the
   contrast-safe g/t ground so the word-on-colour is legible by construction and the gate
   treats it as a GROUND (data-marker), not a foreground shape. Returns a heading; caller
   sets the class via `cls` (display/h1/h2). Each word span carries data-mc-word for the gate's
   contrast check. */
export function multiColorTitle({parts, cls='display', style=''}){
  const KT={ink:'var(--ink)', accent:'var(--ka)', s1:'var(--k1)', s2:'var(--k2)', s3:'var(--k3)'};
  const Gv={accent:'--g0', s1:'--g1', s2:'--g2', s3:'--g3', ink:'--ink'};
  const Tv={accent:'--t0', s1:'--t1', s2:'--t2', s3:'--t3', ink:'--bg'};
  const spans = parts.map(p=>{
    if(p.marker){
      const h=p.marker;
      return `<span data-marker="1" data-mc-word="1" style="display:inline-block;background:var(${Gv[h]||'--g0'});color:var(${Tv[h]||'--t0'});border-radius:.9em .7em .8em .6em / .7em .9em .6em .8em;padding:0 .3em;margin:0 .04em;transform:rotate(-1.6deg)">${p.text}</span>`;
    }
    return `<span data-mc-word="1" style="color:${KT[p.hue||'ink']||'var(--ink)'}">${p.text}</span>`;
  }).join(' ');
  return `<h1 class="${cls}" data-multicolor="1" style="${style}">${spans}</h1>`;
}

/* PERIPHERAL BLOBS — the source's "big organic shapes decorating the edges" (大图形四周点缀).
   Places N large blob() shapes bleeding off the stage. Each item = {pos, size, hue, seed,
   opacity}. data-bigcircle → counts for DENSITY and is treated as a colour-field UNDERLAY
   (never holds tracked text). Raw hue = decoration. */
export function peripheralBlobs(items){
  return items.map(b=>{
    const size=b.size||40, op=(b.opacity!=null?b.opacity:1), seed=b.seed||0, hue=b.hue||'accent';
    return `<div data-bigcircle="1" style="position:absolute;${b.pos};width:${size}cqw;height:${size}cqw;opacity:${op};z-index:0"><svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block">${blob(`var(--${hue})`, seed)}</svg></div>`;
  }).join('');
}

/* DOODLE SPARK — small hand-drawn excitement accent (kid "///" marks). Decoration; raw hue. */
export function doodleSparks(items){
  // data-doodle (NOT .dot) → counts for DENSITY but is exempt from the FG shape-contrast /
  // proximity checks (it's an open-stroke accent with no fill, intentionally placed loose).
  return items.map(d=>`<div data-doodle="1" style="position:absolute;${d.pos};width:${d.size||5}cqw;height:${d.size||5}cqw"><svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block;overflow:visible">${doodleSpark(`var(--${d.hue||'s2'})`, d.variant||0)}</svg></div>`).join('');
}

export const DEVICES = { mosaicGrid, processSpine, caseCardRow, iconQuad, burstBadge, numberedList, priceCardRow, angledSplit, bigCirclePanel, tocList, teamGrid, quoteCards, bigStatHero, multiColorTitle, peripheralBlobs, doodleSparks };
