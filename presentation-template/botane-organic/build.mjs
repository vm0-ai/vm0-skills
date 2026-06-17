import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outArg = process.argv[2] === '--out' ? process.argv[3] : 'example.html';
const outPath = resolve(here, outArg || 'example.html');

const G ={accent:'g0',s1:'g1',s2:'g2',s3:'g3'};
const T ={accent:'t0',s1:'t1',s2:'t2',s3:'t3'};
const HUE = ['accent', 's1', 's2', 's3'];

const tocList=({items})=>`<div data-device="toc" style="display:flex;flex-direction:column;width:100%">${
  items.map((it,i)=>{
    const hue = it.hue || HUE[i%HUE.length];
    return `<div style="display:flex;align-items:baseline;gap:1.6cqw;padding:1.6cqh 0;border-bottom:1px solid color-mix(in srgb, var(--ink) 14%, transparent)">
      <div style="flex:none;color:var(--${hue});font-family:var(--fd);font-weight:600;font-size:1.7cqw;letter-spacing:.04em;width:5cqw">${String(i+1).padStart(2,'0')}</div>
      <h3 class="h3" style="flex:1;color:var(--ink);font-size:2.4cqw">${it.label}</h3>
      <div style="flex:none;color:var(--ink);opacity:.55;font-family:var(--fd);font-weight:500;font-size:1.4cqw;text-align:right;width:5cqw">${String(it.page).padStart(2,'0')}</div>
    </div>`;
  }).join('')
}</div>`;

const numberedList=({items})=>`<div data-device="numbered-list" style="display:flex;flex-direction:column;width:100%">${
  items.map((it,i)=>{
    const hue = HUE[i%HUE.length];
    return `<div style="display:flex;gap:2cqw;align-items:flex-start;margin-bottom:3.4cqh">
      <div style="flex:none"><div class="badge" data-badge="1" style="width:5cqw;height:5cqw;background:var(--${G[hue]});color:var(--${T[hue]})">${String(i+1).padStart(2,'0')}</div></div>
      <div style="flex:1;padding-top:.6cqh"><h3 class="h3">${it.title}</h3><p class="body" style="margin-top:.6cqh;opacity:.92">${it.body}</p></div>
    </div>`;
  }).join('')
}</div>`;

const teamGrid=({members, cols=3, aspect='3/2'})=>`<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:1.6cqw;width:100%">${
  members.map((m,i)=>`<div data-device="team" style="display:flex;flex-direction:column;gap:1.2cqh">
      <div data-photocell="1" data-photo-seed="${m.seed||`team-${i}`}" style="position:relative;width:100%;aspect-ratio:${aspect};background:var(--ph);border-radius:var(--r-md);overflow:hidden"></div>
      <div>
        <h3 class="h3" style="color:var(--ink);font-size:1.7cqw">${m.name}</h3>
        <p class="cap" style="color:var(--ink);opacity:.65;margin-top:.2cqh">${m.role}</p>
      </div>
    </div>`).join('')
}</div>`;

const iconQuad=(items)=>`<div style="display:grid;grid-template-columns:1fr 1fr;gap:2cqw;">${
  items.slice(0,4).map((it,i)=>{
    const hue = HUE[i%HUE.length];
    return `<div class="card" data-device="icon-cell" style="display:flex;gap:1.4cqw;align-items:flex-start;padding:2.4cqh 1.8cqw;">
      <div class="tile" data-tile="1" style="width:5cqw;height:5cqw;flex:none;background:var(--${G[hue]});color:var(--${T[hue]})">${it.icon||''}</div>
      <div><h3 class="h3" style="color:var(--ink)">${it.title}</h3><p class="body soft" style="margin-top:.5cqh">${it.body}</p></div>
    </div>`;
  }).join('')
}</div>`;

const processSpine=(steps)=>`<div data-device="process" style="position:relative;display:flex;height:46cqh;"><div data-connector="1" style="position:absolute;left:12.5%;right:12.5%;top:50%;height:.55cqh;background:color-mix(in srgb, var(--ink) 24%, transparent);transform:translateY(-50%);z-index:0"></div>${
  steps.map((s,i)=>{
    const hue = HUE[i%HUE.length];
    const pos = i%2===0 ? 'bottom:calc(50% + 5.6cqw)' : 'top:calc(50% + 5.6cqw)';
    return `<div style="position:relative;z-index:1;width:25%;height:100%"><div style="position:absolute;left:50%;transform:translateX(-50%);${pos};width:92%;text-align:center"><div class="kicker" style="color:var(--ka)">Step 0${i+1}</div><h3 class="h3" style="margin-top:.4cqh">${s.title}</h3><p class="body soft" style="margin-top:.3cqh">${s.body}</p></div><div class="tile" data-node="1" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:6cqw;height:6cqw;border-radius:50%;background:var(--${G[hue]});color:var(--${T[hue]})">${s.icon||''}</div></div>`;
  }).join('')
}</div>`;

const quoteCards=({quotes})=>`<div style="display:grid;grid-template-columns:repeat(${quotes.length},1fr);gap:2cqw;height:100%">${
  quotes.map((q,i)=>{
    const hue = HUE[i%HUE.length];
    return `<div data-device="quote" style="background:var(--${G[hue]});color:var(--${T[hue]});border-radius:var(--r-lg);padding:3cqh 2cqw;display:flex;flex-direction:column;height:100%">
      <div style="font-family:var(--fd);font-weight:700;font-size:5cqw;line-height:.6;opacity:.45">"</div>
      <p class="body" style="margin-top:.4cqh;flex:1">${q.text}</p>
      <div style="margin-top:2cqh;display:flex;align-items:center;gap:1cqw">
        <div data-photocell="1" data-photo-seed="${q.seed||`quote-${i}`}" style="position:relative;width:4cqw;height:4cqw;background:var(--ph);border-radius:50%;overflow:hidden;flex:none"></div>
        <div style="min-width:0">
          <div style="font-family:var(--fd);font-weight:600;font-size:1.4cqw;line-height:1.1">${q.name}</div>
          <div class="cap" style="opacity:.85;font-size:1.1cqw">${q.role}${q.company?', '+q.company:''}</div>
        </div>
      </div>
    </div>`;
  }).join('')
}</div>`;

const priceCardRow=({cards})=>`<div style="display:grid;grid-template-columns:repeat(${cards.length},1fr);gap:2cqw;height:100%">${
  cards.map((c,i)=>{
    const hue = ['accent','s2','s1','s3'][i%4];
    const feats = (c.features||[]).map(f=>`<div class="body" style="margin-top:.8cqh;opacity:.92">• ${f}</div>`).join('');
    const tag = c.tag ? `<div style="align-self:flex-start;background:var(--ink);color:var(--bg);padding:.7cqh 1.2cqw;border-radius:999px;font-family:var(--fd);font-weight:600;font-size:1.15cqw;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2cqh">${c.tag}</div>` : '';
    return `<div data-device="price" style="background:var(--${G[hue]});color:var(--${T[hue]});border-radius:var(--r-lg);padding:3.2cqh 2cqw;display:flex;flex-direction:column;height:100%">
      ${tag}
      <div class="kicker" style="opacity:.85">${c.tier}</div>
      <div style="display:flex;align-items:baseline;gap:.4cqw;margin-top:2cqh">
        <span class="h1" style="line-height:1">${c.price}</span>
        <span class="cap" style="opacity:.8">${c.unit}</span>
      </div>
      <div style="height:1px;background:currentColor;opacity:.25;margin:2.2cqh 0 .4cqh"></div>
      ${feats}
    </div>`;
  }).join('')
}</div>`;

const slide=(deco,fit,num,ss='')=>`<div class="slide"><div class="stage" style="${ss}">${deco}<div class="fit">${fit}</div><div class="pagenum">${num}</div></div></div>`;

// Botane decoration helpers — calm, editorial, lighter density than Aplocoto

// soft photo placeholder rectangle (data-photocell so it can swap to real photo)
const photoBlock=(pos,size,seed='',radius='var(--r-lg)')=>`<div data-photocell="1" data-photo-seed="${seed}" style="position:absolute;${pos};${size};background:var(--ph);border-radius:${radius};overflow:hidden"></div>`;

// circle photo (rounded full)
const photoCircle=(pos,size,seed='')=>`<div data-photocell="1" data-photo-seed="${seed}" style="position:absolute;${pos};width:${size}cqw;height:${size}cqw;background:var(--ph);border-radius:50%;overflow:hidden"></div>`;

// soft colour-block panel — light tinted section (uses --gN/--tN safe ground for AA text)
const colourBlock=(pos,size,hue='accent',extra='')=>`<div data-bigcircle="1" style="position:absolute;${pos};${size};background:var(--${G[hue]});color:var(--${T[hue]});border-radius:var(--r-md);${extra}"></div>`;

// tiny accent dot (counts toward DENSITY via .dot selector)
const dotMark=(pos,size,hue='accent')=>`<div class="dot" style="position:absolute;${pos};width:${size}cqw;height:${size}cqw;background:var(--${hue});border-radius:50%;"></div>`;

// rotated side-title (botane signature — vertical kicker on left edge)
const sideTitle=(txt,pos='left:3cqw;top:50%')=>`<div style="position:absolute;${pos};transform-origin:0 0;transform:rotate(-90deg) translate(-50%,0);font-family:var(--fd);font-weight:500;font-size:1.05cqw;letter-spacing:.24em;text-transform:uppercase;color:var(--soft);white-space:nowrap;z-index:3">${txt}</div>`;

// inline donut (botane signature) — pct ring with centred number, uses --accent + --ph track
const donut=(pct,size=22)=>`<svg viewBox="0 0 100 100" data-bbadge="1" style="width:${size}cqw;height:${size}cqw">
  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--ph)" stroke-width="9"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--accent)" stroke-width="9"
          stroke-dasharray="${(pct/100*238.76).toFixed(1)} 238.76" stroke-linecap="round" transform="rotate(-90 50 50)"/>
</svg>`;

// icon glyph helper
const ico=(p)=>`<svg viewBox="0 0 24 24" style="width:50%;height:50%;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round">${p}</svg>`;
const I={
  leaf:'<path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 11-9 0 6-4 11-9 11"/><path d="M2 22c2-2 5-5 9-7"/>',
  sprout:'<path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c0-4-3-7-7-7 0 4 3 7 7 7zm0 0c0-4 3-7 7-7 0 4-3 7-7 7z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  cycle:'<path d="M21 12a9 9 0 1 1-9-9c2.5 0 5 1 7 3"/><path d="M21 3v6h-6"/>',
  cup:'<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M5 8h12v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
  heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  book:'<path d="M2 19V6a2 2 0 0 1 2-2h7v17H4a2 2 0 0 1-2-2zM22 19V6a2 2 0 0 0-2-2h-7v17h7a2 2 0 0 0 2-2z"/>',
  star:'<polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9"/>'
};

// section divider (botane: colour-block half-panel + serif chapter)
const divider=(chapter,title,hue='accent')=>slide(
  photoCircle('right:10cqw;top:50cqh;transform:translateY(-50%)',26,`divider-${chapter}`)+
  dotMark('right:7cqw;top:6cqh',1.0,hue),
  `<div data-bigcircle="1" style="position:absolute;left:0;top:0;width:48cqw;height:100cqh;background:var(--${G[hue]});color:var(--${T[hue]});padding:18cqh 0 0 6cqw;box-sizing:border-box">
     <div class="kicker">Chapter ${chapter}</div>
     <h1 class="display" style="font-size:7cqw;margin-top:3cqh;line-height:1.0;letter-spacing:-.01em">${title}</h1>
     <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.85">Botane &nbsp;·&nbsp; ${chapter}/03</div>
   </div>`,
  '');

// =====================================================================
// 01 COVER — serif wordmark left, colour-block panel + circular photo right
// =====================================================================
const s01 = slide(
  colourBlock('right:0;top:0','width:46cqw;height:100cqh','accent','border-radius:0')+
  photoCircle('right:14cqw;top:50cqh;transform:translateY(-50%)',28,'botane-cover')+
  dotMark('left:7cqw;top:8cqh',1.4,'accent')+
  dotMark('left:14cqw;top:9cqh',.7,'accent'),
  `<div style="position:absolute;left:7cqw;top:18cqh;width:38cqw">
     <div class="kicker" style="color:var(--ka)">A wellness studio · 2026</div>
     <h1 class="display" style="font-size:7cqw;margin-top:3cqh;line-height:1.02;letter-spacing:-.015em">Botane.<br>Made of<br>the garden.</h1>
     <p class="lead soft" style="margin-top:3.4cqh;max-width:34cqw">Small batches from one Welsh garden.</p>
   </div>
   <div class="kicker" style="position:absolute;left:7cqw;bottom:3.4cqh;opacity:.75">yourcompany.com</div>`,
  '01');

// =====================================================================
// 02 AGENDA — tocList + colour-block accent strip
// =====================================================================
const s02 = slide(
  colourBlock('left:0;top:0','width:8cqw;height:100cqh','accent','border-radius:0')+
  dotMark('left:18cqw;top:5cqh',1.2,'accent')+
  photoCircle('right:10cqw;bottom:14cqh',16,'agenda-still'),
  `<div style="position:absolute;left:18cqw;top:14cqh;width:36cqw">
     <div class="kicker" style="color:var(--ka)">Inside</div>
     <h1 class="h1" style="margin-top:1.6cqh;font-family:var(--fd);font-weight:500;line-height:1">What we cover</h1>
     <div style="margin-top:3.4cqh">
       ${tocList({items:[
         {label:'The garden behind the brand', page:3, hue:'accent'},
         {label:'The herbs we grow this year', page:7, hue:'s1'},
         {label:'The numbers we are proud of', page:11, hue:'s2'},
         {label:'Find us, write us, visit us', page:15, hue:'s3'}
       ]})}
     </div>
   </div>
   <div class="kicker" style="position:absolute;left:18cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; agenda</div>`,
  '02');

// =====================================================================
// 03 SECTION DIVIDER: About
// =====================================================================
const s03 = divider('01','Garden','accent');

// =====================================================================
// 04 ABOUT US — large photo left, text right, rotated side title
// =====================================================================
const s04 = slide(
  photoBlock('left:0;top:8cqh','width:42cqw;height:84cqh','about-portrait','0 var(--r-lg) var(--r-lg) 0')+
  sideTitle('About — 2026','left:46cqw;top:18cqh')+
  dotMark('right:8cqw;top:7cqh',1.4,'accent')+
  dotMark('right:14cqw;top:5cqh',.7,'accent'),
  `<div style="position:absolute;right:6cqw;top:14cqh;width:40cqw">
     <div class="kicker" style="color:var(--ka)">A small studio</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500;line-height:1.04">Built one season at a time.</h1>
     <p class="lead" style="margin-top:2.8cqh">We make small batches of skincare, tinctures and teas from a single Welsh garden — slow, honest, and made by hand.</p>
     <p class="body" style="margin-top:2cqh;max-width:38cqw;opacity:.88">Founded in 2018 with three rows of calendula and a hand-cranked still. Six years on, still small, still slow, still ours.</p>
   </div>
   <div class="kicker" style="position:absolute;right:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 04</div>`,
  '04');

// =====================================================================
// 05 MISSION / VISION — numberedList with numeral circle badges
// =====================================================================
const s05 = slide(
  colourBlock('right:0;top:0','width:38cqw;height:100cqh','s2','border-radius:0')+
  photoCircle('right:6cqw;top:6cqh',14,'vision-flower')+
  dotMark('left:7cqw;top:6cqh',1.4,'accent'),
  `<div style="position:absolute;left:7cqw;top:14cqh;width:46cqw">
     <div class="kicker" style="color:var(--ka)">What we believe</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">Three small promises.</h1>
     <div style="margin-top:3.4cqh">
       ${numberedList({items:[
         {title:'Grown not bought', body:'Every leaf, root and petal in our blends is from our garden, in this season.'},
         {title:'Small batch, slow craft', body:'Hand-poured, hand-labelled, hand-checked. We make what one of us can carry in a day.'},
         {title:'Honest on every label', body:'We list every ingredient, the season it grew in, and how to read the small print.'}
       ], numeral:'num'})}
     </div>
   </div>
   <div class="kicker" style="position:absolute;left:7cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 05</div>`,
  '05');

// =====================================================================
// 06 TEAM — circular team grid (botane uses round photos)
// =====================================================================
const s06 = slide(
  dotMark('right:6cqw;top:6cqh',1.4,'accent')+
  dotMark('left:7cqw;bottom:18cqh',1.0,'s2'),
  `<div style="position:absolute;left:6cqw;top:14cqh">
     <div class="kicker" style="color:var(--ka)">The garden hands</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">Three of us, six rows.</h1>
   </div>
   <div style="position:absolute;left:6cqw;right:6cqw;top:42cqh;bottom:14cqh">
     ${teamGrid({aspect:'3/2',cols:3,members:[
       {name:'Ines Holm', role:'Grower & Founder', seed:'team-ines'},
       {name:'Mara Kwan', role:'Distiller', seed:'team-mara'},
       {name:'Owen Riley', role:'Designer & Writer', seed:'team-owen'}
     ], cols:3})}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 06</div>`,
  '06');

// =====================================================================
// 07 SECTION DIVIDER: Work
// =====================================================================
const s07 = divider('02','Herbs','s1');

// =====================================================================
// 08 SERVICES — iconQuad with line icons in (rounded) tiles
// =====================================================================
const s08 = slide(
  dotMark('right:6cqw;top:6cqh',1.4,'accent')+
  dotMark('left:7cqw;bottom:18cqh',1.0,'s1'),
  `<div style="position:absolute;left:6cqw;top:14cqh;width:50cqw">
     <div class="kicker" style="color:var(--ka)">What we make</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">Four small ranges.</h1>
     <p class="lead soft" style="margin-top:2cqh;max-width:46cqw">Each range is a single garden's worth of one ingredient — made, bottled, and sent in the season it grew in.</p>
   </div>
   <div style="position:absolute;left:6cqw;right:6cqw;top:46cqh">
     ${iconQuad([
       {title:'Skin & body', body:'Cold-pressed oils and balms from calendula, comfrey, plantain.',icon:ico(I.leaf)},
       {title:'Teas & tinctures', body:'Loose-leaf blends and herbal extracts, gentle and slow.',icon:ico(I.cup)},
       {title:'Slow soaps', body:'Cured 8 weeks, cut by hand, wrapped in unbleached paper.',icon:ico(I.heart)},
       {title:'Garden books', body:'Small printed books on growing what we grow at home.',icon:ico(I.book)}
     ])}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 08</div>`,
  '08');

// =====================================================================
// 09 PROCESS — processSpine with 4 garden steps
// =====================================================================
const s09 = slide(
  dotMark('right:6cqw;top:6cqh',1.4,'accent')+
  dotMark('left:7cqw;bottom:18cqh',1.0,'s2'),
  `<div style="position:absolute;left:6cqw;top:14cqh">
     <div class="kicker" style="color:var(--ka)">From plot to bottle</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">A year in four turns.</h1>
   </div>
   <div style="position:absolute;left:6cqw;right:6cqw;top:42cqh">
     ${processSpine([
       {title:'Sow',body:'Seeds in February under cloches.',icon:ico(I.sprout)},
       {title:'Tend',body:'Weekly weeding, watering, weeks of patience.',icon:ico(I.sun)},
       {title:'Harvest',body:'Two pickings, August and October.',icon:ico(I.leaf)},
       {title:'Make',body:'Press, distill, cure. Bottle. Send.',icon:ico(I.cycle)}
     ])}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 09</div>`,
  '09');

// =====================================================================
// 10 GALLERY — small photo grid + side title
// =====================================================================
const photoCell=(area,seed='')=>`<div data-photocell="1" data-photo-seed="${seed}" style="grid-area:${area};position:relative;background:var(--ph);border-radius:var(--r-md);overflow:hidden"></div>`;
const s10 = slide(
  sideTitle('Selected work · 2026','left:3cqw;top:50cqh')+
  dotMark('right:6cqw;top:6cqh',1.4,'accent'),
  `<div style="position:absolute;left:9cqw;top:14cqh;width:26cqw">
     <div class="kicker" style="color:var(--ka)">Around the garden</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">This season.</h1>
     <p class="body" style="margin-top:2cqh;opacity:.84">Four small snapshots — beds, the still, a finished tincture, and the wrap.</p>
   </div>
   <div style="position:absolute;right:6cqw;top:11cqh;bottom:11cqh;width:54cqw;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:1.2cqw">
     ${photoCell('1 / 1 / 2 / 3','gallery-1')}
     ${photoCell('1 / 3 / 2 / 4','gallery-2')}
     ${photoCell('2 / 1 / 3 / 2','gallery-3')}
     ${photoCell('2 / 2 / 3 / 4','gallery-4')}
   </div>
   <div class="kicker" style="position:absolute;left:9cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 10</div>`,
  '10');

// =====================================================================
// 11 SECTION DIVIDER: Proof
// =====================================================================
const s11 = divider('03','Numbers','s2');

// =====================================================================
// 12 STATS — donut + 2 supporting stats + headline
// =====================================================================
const s12 = slide(
  dotMark('right:6cqw;top:6cqh',1.4,'accent')+
  dotMark('left:7cqw;bottom:18cqh',1.0,'s2'),
  `<div style="position:absolute;left:6cqw;top:14cqh;width:42cqw">
     <div class="kicker" style="color:var(--ka)">A year in numbers</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">A small operation,<br>growing slowly.</h1>
     <p class="body" style="margin-top:2.4cqh;max-width:38cqw;opacity:.88">Six rows turned into seventeen products. Two of us became three. Repeat orders quietly outgrew new ones.</p>
   </div>
   <div style="position:absolute;right:6cqw;top:18cqh;width:36cqw;display:flex;align-items:center;gap:3cqw">
     <div data-device="stat-cell" style="position:relative">
       ${donut(72,22)}
       <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column">
         <div style="font-family:var(--fd);font-weight:600;font-size:4cqw;line-height:1">72%</div>
         <div class="cap" style="opacity:.7;margin-top:.5cqh">Repeat buyers</div>
       </div>
     </div>
     <div data-device="stat-cell" style="display:flex;flex-direction:column;gap:2cqh">
       <div>
         <div style="font-family:var(--fd);font-weight:600;font-size:3.4cqw;line-height:1">17</div>
         <div class="cap" style="opacity:.7;margin-top:.4cqh">Products in catalogue</div>
       </div>
       <div>
         <div style="font-family:var(--fd);font-weight:600;font-size:3.4cqw;line-height:1">8wk</div>
         <div class="cap" style="opacity:.7;margin-top:.4cqh">Average soap cure time</div>
       </div>
     </div>
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 12</div>`,
  '12');

// =====================================================================
// 13 TESTIMONIALS — quoteCards × 2 (botane uses fewer, calmer)
// =====================================================================
const s13 = slide(
  dotMark('right:6cqw;top:6cqh',1.4,'accent')+
  dotMark('left:7cqw;bottom:18cqh',1.0,'s1'),
  `<div style="position:absolute;left:8cqw;top:14cqh;width:46cqw">
     <div class="kicker" style="color:var(--ka)">What buyers tell us</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">In their words.</h1>
   </div>
   <div style="position:absolute;left:8cqw;right:8cqw;top:40cqh;bottom:14cqh">
     ${quoteCards({quotes:[
       {text:'The calendula balm replaced three things in my cupboard. Smells like a garden, not a chemist.',name:'Hannah W.',role:'Subscriber since 2022',company:'Cardiff',seed:'quote-hannah'},
       {text:'A small package, hand-wrapped, hand-noted. The kind of post you stop and read on the stairs.',name:'Niall O.',role:'New customer',company:'Edinburgh',seed:'quote-niall'}
     ]})}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 13</div>`,
  '13');

// =====================================================================
// 14 PRICELIST — priceCardRow with botane tone
// =====================================================================
const s14 = slide(
  dotMark('right:6cqw;top:6cqh',1.4,'accent')+
  dotMark('left:7cqw;bottom:18cqh',1.0,'s2'),
  `<div style="position:absolute;left:8cqw;top:11cqh">
     <div class="kicker" style="color:var(--ka)">Pricelist</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-family:var(--fd);font-weight:500">Three small boxes.</h1>
     <p class="body" style="margin-top:1.6cqh;max-width:46cqw;opacity:.84">Sent four times a year, in the season that grew them. Cancel any time, keep what you love.</p>
   </div>
   <div style="position:absolute;left:8cqw;right:8cqw;top:38cqh;bottom:11cqh">
     ${priceCardRow({cards:[
       {tier:'Single',price:'£18',unit:'/quarter',features:['One soap or tea','Hand-labelled card','Seasonal note']},
       {tier:'Pair',price:'£32',unit:'/quarter',tag:'Most loved',features:['Two products','Choose your blends','Free postage in UK','First pick of new ranges']},
       {tier:'Garden',price:'£58',unit:'/quarter',features:['Five products','Includes the small book','Postage + a thank-you card']}
     ]})}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.65">Botane &nbsp;·&nbsp; 14</div>`,
  '14');

// =====================================================================
// 15 THANK YOU — colour-block + serif thanks + contact + small photo
// =====================================================================
const s15 = slide(
  colourBlock('left:0;top:0','width:46cqw;height:100cqh','accent','border-radius:0')+
  photoCircle('left:10cqw;top:50cqh;transform:translateY(-50%)',24,'thanks-still')+
  dotMark('right:7cqw;top:8cqh',1.4,'accent')+
  dotMark('right:13cqw;top:9cqh',.7,'accent'),
  `<div style="position:absolute;right:6cqw;top:18cqh;width:40cqw">
     <div class="kicker" style="color:var(--ka)">Thank you</div>
     <h1 class="display" style="font-size:7cqw;margin-top:3cqh;line-height:1.02;letter-spacing:-.015em">Visit the<br>garden.</h1>
     <p class="lead soft" style="margin-top:3cqh;max-width:34cqw">Open the last Saturday of every month.</p>
     <div class="kicker" style="margin-top:4cqh;opacity:.85">hello@yourcompany.com</div>
   </div>`,
  '15');

function renderHtml(slides) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Botane — deck</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Work+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#FAF7FB; --surface:#FFFFFF; --ink:#2B2533; --soft:#635B70; --ph:#ECE7F0;
  --accent:#9C7BB8; --s1:#8AA0C9; --s2:#E0B6C9; --s3:#2B2533;
  --oa:#FFFFFF; --o1:#FFFFFF; --o2:#15151A; --o3:#FFFFFF;
  --ka:#2B2533; --kad:#FAF7FB;
  --g0:#85699d; --g1:#61708d; --g2:#e0b6c9; --g3:#2b2533;
  --t0:#FFFFFF; --t1:#FFFFFF; --t2:#15131C; --t3:#FFFFFF;
  --fd:'Fraunces'; --fb:'Work Sans';
  --r-xs:.5cqw; --r-sm:.9cqw; --r-md:1.7cqw; --r-lg:3cqw; --r-xl:5cqw;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#cfd2d8;color:var(--ink);font-family:var(--fb),sans-serif;}
.deck{scroll-snap-type:y mandatory;height:100vh;overflow-y:scroll;}
.slide{width:100vw;height:100vh;scroll-snap-align:start;display:flex;background:#cfd2d8;}
.stage{position:relative;width:min(92vw,163.55vh);height:min(51.75vw,92vh);margin:auto;overflow:hidden;container-type:size;
  background:var(--bg);color:var(--ink);border:1px solid rgba(0,0,0,.12);box-shadow:0 14px 50px rgba(0,0,0,.2);}
.fit{position:absolute;inset:0;transform-origin:top center;}  /* auto-scaled to keep content in-frame on any font */
/* ---- type scale (projection-legible) ---- */
.display{font-family:var(--fd);font-size:7cqw;font-weight:600;line-height:1.0;letter-spacing:-.02em;}
.h1{font-family:var(--fd);font-size:4.6cqw;font-weight:500;line-height:1.04;letter-spacing:-.01em;}
.h2{font-family:var(--fd);font-size:3.2cqw;font-weight:500;line-height:1.08;letter-spacing:-.01em;}
.h3{font-family:var(--fd);font-size:1.95cqw;font-weight:500;line-height:1.18;}
.stat{font-family:var(--fd);font-size:5.2cqw;font-weight:600;line-height:1;letter-spacing:-.01em;}
.kicker{font-family:var(--fd);font-size:1.15cqw;font-weight:500;letter-spacing:.20em;text-transform:uppercase;}
.lead{font-size:2cqw;font-weight:300;line-height:1.5;}
.body{font-size:1.5cqw;font-weight:400;line-height:1.5;}
.cap{font-size:1.2cqw;font-weight:400;line-height:1.4;letter-spacing:.02em;}
.pagenum{position:absolute;right:3cqw;bottom:3.2cqh;font-family:var(--fd);font-size:1cqw;font-weight:500;letter-spacing:.06em;opacity:.65;z-index:6;}
/* ---- signature motifs ---- */
.tile{display:flex;align-items:center;justify-content:center;border-radius:50%;}
.tile svg{width:55%;height:55%;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.badge{display:flex;align-items:center;justify-content:center;border-radius:50%;font-family:var(--fd);font-weight:600;}
.tick{position:absolute;}
.card{background:var(--surface);border-radius:var(--r-md);}
.dot{border-radius:50%;}.qcircle{border-radius:50% 0 0 0;}.semi{border-radius:999px 999px 0 0;}.tri{width:0;height:0;}
.dim{opacity:.84;}
.soft{color:var(--soft);}
.band{position:absolute;display:flex;flex-direction:column;align-items:center;gap:1.6cqh;}
.band>*{flex:none;}
</style>
</head>
<body>
<div class="deck" id="deck">
${slides}
</div>

</body>
</html>
`;
}

const slides=[s01,s02,s03,s04,s05,s06,s07,s08,s09,s10,s11,s12,s13,s14,s15].join('\n');
const html=renderHtml(slides);

writeFileSync(outPath, html);
console.log(`${outPath} built:`, html.length, 'bytes,', (html.match(/class="slide"/g)||[]).length, 'slides');
