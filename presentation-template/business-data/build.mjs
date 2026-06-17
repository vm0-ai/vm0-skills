import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const esc = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const hueAt = (index) => ['accent', 's1', 's2', 's3'][index % 4];

const tocList = ({ items }) =>
  `<div data-device="toc" style="display:flex;flex-direction:column;width:100%">${items
    .map((item, index) => {
      const hue = item.hue || hueAt(index);
      return `<div style="display:flex;align-items:baseline;gap:1.6cqw;padding:1.6cqh 0;border-bottom:1px solid color-mix(in srgb, var(--ink) 14%, transparent)">
      <div style="flex:none;color:var(--${hue});font-family:var(--fd);font-weight:600;font-size:1.7cqw;letter-spacing:.04em;width:5cqw">${String(index + 1).padStart(2, '0')}</div>
      <h3 class="h3" style="flex:1;color:var(--ink);font-size:2.4cqw">${esc(item.label)}</h3>
      <div style="flex:none;color:var(--ink);opacity:.55;font-family:var(--fd);font-weight:500;font-size:1.4cqw;text-align:right;width:5cqw">${String(item.page).padStart(2, '0')}</div>
    </div>`;
    })
    .join('')}</div>`;

const numberedList = ({ items }) =>
  `<div data-device="numbered-list" style="display:flex;flex-direction:column;width:100%">${items
    .map((item, index) => {
      const g = `g${index % 4}`;
      const t = `t${index % 4}`;
      return `<div style="display:flex;gap:2cqw;align-items:flex-start;margin-bottom:3.4cqh">
      <div style="flex:none"><div class="badge" data-badge="1" style="width:5cqw;height:5cqw;background:var(--${g});color:var(--${t})">${String(index + 1).padStart(2, '0')}</div></div>
      <div style="flex:1;padding-top:.6cqh"><h3 class="h3">${esc(item.title)}</h3><p class="body" style="margin-top:.6cqh;opacity:.92">${esc(item.body)}</p></div>
    </div>`;
    })
    .join('')}</div>`;

const teamGrid = ({ aspect = '4/3', cols = 4, members }) =>
  `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:1.6cqw;width:100%">${members
    .map(
      (member) => `<div data-device="team" style="display:flex;flex-direction:column;gap:1.2cqh">
      <div data-photocell="1" data-photo-seed="${esc(member.seed)}" style="position:relative;width:100%;aspect-ratio:${aspect};background:var(--ph);border-radius:var(--r-md);overflow:hidden"></div>
      <div>
        <h3 class="h3" style="color:var(--ink);font-size:1.7cqw">${esc(member.name)}</h3>
        <p class="cap" style="color:var(--ink);opacity:.65;margin-top:.2cqh">${esc(member.role)}</p>
      </div>
    </div>`,
    )
    .join('')}</div>`;

const iconQuad = (items) =>
  `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2cqw;">${items
    .map((item, index) => {
      const g = `g${index % 4}`;
      const t = `t${index % 4}`;
      return `<div class="card" data-device="icon-cell" style="display:flex;gap:1.4cqw;align-items:flex-start;padding:2.4cqh 1.8cqw;">
      <div class="tile" data-tile="1" style="width:5cqw;height:5cqw;flex:none;background:var(--${g});color:var(--${t})">${item.icon}</div>
      <div><h3 class="h3" style="color:var(--ink)">${esc(item.title)}</h3><p class="body soft" style="margin-top:.5cqh">${esc(item.body)}</p></div>
    </div>`;
    })
    .join('')}</div>`;

const processSpine = (steps) =>
  `<div data-device="process" style="position:relative;display:flex;height:46cqh;"><div data-connector="1" style="position:absolute;left:12.5%;right:12.5%;top:50%;height:.55cqh;background:color-mix(in srgb, var(--ink) 24%, transparent);transform:translateY(-50%);z-index:0"></div>${steps
    .map((step, index) => {
      const g = `g${index % 4}`;
      const t = `t${index % 4}`;
      const labelPos =
        index % 2 === 0
          ? 'bottom:calc(50% + 5.6cqw)'
          : 'top:calc(50% + 5.6cqw)';
      return `<div style="position:relative;z-index:1;width:25%;height:100%"><div style="position:absolute;left:50%;transform:translateX(-50%);${labelPos};width:92%;text-align:center"><div class="kicker" style="color:var(--ka)">Step ${String(index + 1).padStart(2, '0')}</div><h3 class="h3" style="margin-top:.4cqh">${esc(step.title)}</h3><p class="body soft" style="margin-top:.3cqh">${esc(step.body)}</p></div><div class="tile" data-node="1" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:6cqw;height:6cqw;border-radius:50%;background:var(--${g});color:var(--${t})">${step.icon}</div></div>`;
    })
    .join('')}</div>`;

const quoteCards = ({ quotes }) =>
  `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2cqw;height:100%">${quotes
    .map((quote, index) => {
      const g = `g${index % 4}`;
      const t = `t${index % 4}`;
      return `<div data-device="quote" style="background:var(--${g});color:var(--${t});border-radius:var(--r-lg);padding:3cqh 2cqw;display:flex;flex-direction:column;height:100%">
      <div style="font-family:var(--fd);font-weight:700;font-size:5cqw;line-height:.6;opacity:.45">"</div>
      <p class="body" style="margin-top:.4cqh;flex:1">${esc(quote.text)}</p>
      <div style="margin-top:2cqh;display:flex;align-items:center;gap:1cqw">
        <div data-photocell="1" data-photo-seed="${esc(quote.seed)}" style="position:relative;width:4cqw;height:4cqw;background:var(--ph);border-radius:50%;overflow:hidden;flex:none"></div>
        <div>
          <div style="font-family:var(--fd);font-weight:600;font-size:1.4cqw;line-height:1.1">${esc(quote.name)}</div>
          <div class="cap" style="opacity:.85;font-size:1.1cqw">${esc(quote.role)}, ${esc(quote.company)}</div>
        </div>
      </div>
    </div>`;
    })
    .join('')}</div>`;

const priceCardRow = ({ cards }) =>
  `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2cqw;height:100%">${cards
    .map((card, index) => {
      const hueIndex = index === 1 ? 2 : index === 2 ? 1 : 0;
      const g = `g${hueIndex}`;
      const t = `t${hueIndex}`;
      const tag = card.tag
        ? `<div style="align-self:flex-start;background:var(--ink);color:var(--bg);padding:.7cqh 1.2cqw;border-radius:999px;font-family:var(--fd);font-weight:600;font-size:1.15cqw;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2cqh">${esc(card.tag)}</div>`
        : '';
      const features = card.features
        .map(
          (feature) =>
            `<div class="body" style="margin-top:.8cqh;opacity:.92">• ${esc(feature)}</div>`,
        )
        .join('');
      return `<div data-device="price" style="background:var(--${g});color:var(--${t});border-radius:var(--r-lg);padding:3.2cqh 2cqw;display:flex;flex-direction:column;height:100%">
      ${tag}
      <div class="kicker" style="opacity:.85">${esc(card.tier)}</div>
      <div style="display:flex;align-items:baseline;gap:.4cqw;margin-top:2cqh">
        <span class="h1" style="line-height:1">${esc(card.price)}</span>
        <span class="cap" style="opacity:.8">${esc(card.unit)}</span>
      </div>
      <div style="height:1px;background:currentColor;opacity:.25;margin:2.2cqh 0 .4cqh"></div>
      ${features}
    </div>`;
    })
    .join('')}</div>`;

const ON={accent:'oa',s1:'o1',s2:'o2',s3:'o3'};
const G ={accent:'g0',s1:'g1',s2:'g2',s3:'g3'};
const T ={accent:'t0',s1:'t1',s2:'t2',s3:'t3'};

const slide=(deco,fit,num,ss='')=>`<div class="slide"><div class="stage" style="${ss}">${deco}<div class="fit">${fit}</div><div class="pagenum">${num}</div></div></div>`;

// Business-data decoration helpers — numbers-first, confident, balanced density

const photoBlock=(pos,size,seed='',radius='var(--r-md)')=>`<div data-photocell="1" data-photo-seed="${seed}" style="position:absolute;${pos};${size};background:var(--ph);border-radius:${radius};overflow:hidden"></div>`;

// `+` plus mark — business-data signature motif (data point marker)
const plusMark=(pos,size=1.4,hue='accent')=>`<svg class="dot" style="position:absolute;${pos};width:${size}cqw;height:${size}cqw" viewBox="0 0 24 24"><path d="M12 4 V20 M4 12 H20" stroke="var(--${hue})" stroke-width="2.6" stroke-linecap="round"/></svg>`;

// small dot decoration
const dotMark=(pos,size,hue='accent')=>`<div class="dot" style="position:absolute;${pos};width:${size}cqw;height:${size}cqw;background:var(--${hue});border-radius:50%;"></div>`;

// donut / ring chart
const donut=(pct,size=18,hue='accent')=>`<svg viewBox="0 0 100 100" data-bbadge="1" style="width:${size}cqw;height:${size}cqw">
  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--ph)" stroke-width="9"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--${hue})" stroke-width="9"
          stroke-dasharray="${(pct/100*238.76).toFixed(1)} 238.76" stroke-linecap="round" transform="rotate(-90 50 50)"/>
</svg>`;

// horizontal bar chart (business-data signature)
const barChart=(bars,height=18)=>{
  const max=Math.max(...bars.map(b=>b.value));
  const rows=bars.map((b,i)=>{
    const w=Math.round(b.value/max*100);
    const hue=['accent','s1','s2','s3'][i%4];
    return `<div style="display:flex;align-items:center;gap:1.4cqw;margin-bottom:1.4cqh">
      <div class="cap" style="flex:none;width:8cqw;color:var(--ink);opacity:.7">${b.label}</div>
      <div style="flex:1;height:1.6cqh;background:var(--ph);border-radius:.4cqh;overflow:hidden">
        <div style="width:${w}%;height:100%;background:var(--${hue});border-radius:.4cqh"></div>
      </div>
      <div class="cap" style="flex:none;font-family:var(--fd);font-weight:600;color:var(--ink);width:5cqw;text-align:right">${b.value}${b.unit||''}</div>
    </div>`;
  }).join('');
  return `<div data-device="bar-chart" style="width:100%">${rows}</div>`;
};

// section divider — dark plum ground (business-data signature)
const divider=(chapter,title)=>slide(
  `${plusMark('right:6cqw;top:6cqh',1.6,'accent')}
   ${plusMark('left:6cqw;bottom:11cqh',1.6,'accent')}
   ${plusMark('right:6cqw;bottom:11cqh',1.0,'accent')}`,
  `<div style="position:absolute;left:8cqw;top:32cqh;width:60cqw;z-index:3">
     <div class="kicker" style="opacity:.65">Chapter ${chapter}</div>
     <h1 class="display" style="font-size:7.4cqw;margin-top:2.4cqh;line-height:1;letter-spacing:-.015em">${title}</h1>
   </div>
   <div class="kicker" style="position:absolute;left:8cqw;bottom:3.4cqh;opacity:.65;z-index:3">Business Data &nbsp;·&nbsp; ${chapter}/03</div>`,
  '','background:var(--ink);color:var(--bg)');

// =====================================================================
// 01 COVER — wordmark + big image + stat strip
// =====================================================================
const s01 = slide(
  photoBlock('right:0;top:0','width:46cqw;height:100cqh','cover-hero','0')+
  plusMark('left:7cqw;top:6cqh',1.6)+
  plusMark('right:50cqw;bottom:6cqh',1.4),
  `<div style="position:absolute;left:7cqw;top:14cqh;width:42cqw">
     <div class="kicker" style="color:var(--ka)">Annual Report &nbsp;·&nbsp; 2026</div>
     <h1 class="display" style="font-size:7.2cqw;margin-top:2.8cqh;line-height:1;letter-spacing:-.025em">Numbers<br>tell the<br>story.</h1>
     <p class="lead soft" style="margin-top:3.4cqh;max-width:38cqw">A year of growth, signal and small bets that paid off.</p>
   </div>
   <div style="position:absolute;left:7cqw;bottom:11cqh;display:flex;gap:3cqw">
     <div data-device="stat-cell"><div style="font-family:var(--fd);font-weight:600;font-size:3.6cqw;line-height:1;color:var(--ka)">$48M</div><div class="cap soft" style="margin-top:.6cqh">Revenue</div></div>
     <div data-device="stat-cell"><div style="font-family:var(--fd);font-weight:600;font-size:3.6cqw;line-height:1;color:var(--ka)">+34%</div><div class="cap soft" style="margin-top:.6cqh">YoY</div></div>
     <div data-device="stat-cell"><div style="font-family:var(--fd);font-weight:600;font-size:3.6cqw;line-height:1;color:var(--ka)">12 mkts</div><div class="cap soft" style="margin-top:.6cqh">Live</div></div>
   </div>
   <div class="kicker" style="position:absolute;left:7cqw;bottom:3.4cqh;opacity:.7">yourcompany.com</div>`,
  '01');

// =====================================================================
// 02 AGENDA — tocList
// =====================================================================
const s02 = slide(
  plusMark('right:6cqw;top:6cqh')+
  plusMark('left:6cqw;bottom:11cqh')+
  photoBlock('right:6cqw;top:38cqh','width:32cqw;height:52cqh','agenda-side'),
  `<div style="position:absolute;left:6cqw;top:11cqh;width:40cqw">
     <div class="kicker" style="color:var(--ka)">Contents</div>
     <h1 class="h1" style="margin-top:1.4cqh">What's in this report</h1>
     <div style="margin-top:3cqh">
       ${tocList({items:[
         {label:'About the year — context and trends', page:3, hue:'accent'},
         {label:'How we worked — services and process', page:7, hue:'s1'},
         {label:'Proof — numbers, stories, plans', page:11, hue:'s2'},
         {label:'Close — find us, work with us', page:15, hue:'accent'}
       ]})}
     </div>
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; agenda</div>`,
  '02');

// =====================================================================
// 03 SECTION DIVIDER: About
// =====================================================================
const s03 = divider('01','The year in review');

// =====================================================================
// 04 ABOUT — narrative + big image + bar chart
// =====================================================================
const s04 = slide(
  photoBlock('left:0;top:8cqh','width:38cqw;height:84cqh','about-photo','0 var(--r-md) var(--r-md) 0')+
  plusMark('right:7cqw;top:6cqh'),
  `<div style="position:absolute;right:6cqw;top:14cqh;width:48cqw">
     <div class="kicker" style="color:var(--ka)">About the company</div>
     <h1 class="h1" style="margin-top:1.4cqh">A specialist agency,<br>doing the unglamorous work.</h1>
     <p class="lead" style="margin-top:2.4cqh">We are eighteen people building infrastructure for media companies — boring tools that make the public-facing work possible.</p>
     <div style="margin-top:3cqh">
       ${barChart([
         {label:'Engineering', value:65, unit:'%'},
         {label:'Design', value:20, unit:'%'},
         {label:'Operations', value:15, unit:'%'}
       ])}
     </div>
   </div>
   <div class="kicker" style="position:absolute;right:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 04</div>`,
  '04');

// =====================================================================
// 05 MISSION / VISION — numberedList with circle badges
// =====================================================================
const s05 = slide(
  `<div data-bigcircle="1" style="position:absolute;right:0;top:0;width:40cqw;height:100cqh;background:var(--g0);color:var(--t0)"></div>
   ${plusMark('left:6cqw;top:6cqh')}
   ${photoBlock('right:6cqw;top:14cqh','width:28cqw;height:72cqh','vision-side','var(--r-md)')}`,
  `<div style="position:absolute;left:7cqw;top:14cqh;width:46cqw">
     <div class="kicker" style="color:var(--ka)">What we are about</div>
     <h1 class="h1" style="margin-top:1.4cqh">Three commitments<br>we measure ourselves on.</h1>
     <div style="margin-top:3.4cqh">
       ${numberedList({items:[
         {title:'Ship measurable work', body:'A number we can defend, every quarter.'},
         {title:'Boring is a feature', body:'Predictable, documented, well-tested.'},
         {title:'Customers over launches', body:'Long-term users beat one-time signups.'}
       ], numeral:'num'})}
     </div>
   </div>
   <div class="kicker" style="position:absolute;left:7cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 05</div>`,
  '05');

// =====================================================================
// 06 TEAM — teamGrid (4 across)
// =====================================================================
const s06 = slide(
  plusMark('right:6cqw;top:6cqh')+
  plusMark('left:6cqw;bottom:14cqh'),
  `<div style="position:absolute;left:6cqw;top:11cqh">
     <div class="kicker" style="color:var(--ka)">The people behind the numbers</div>
     <h1 class="h1" style="margin-top:1.4cqh">Eighteen in total, four named here.</h1>
   </div>
   <div style="position:absolute;left:6cqw;right:6cqw;top:40cqh;bottom:18cqh">
     ${teamGrid({aspect:'4/3',cols:4,members:[
       {name:'Aisha Hill', role:'CEO & Founder', seed:'team-aisha'},
       {name:'Bruno Kato', role:'Engineering Lead', seed:'team-bruno'},
       {name:'Clara Voss', role:'Design Director', seed:'team-clara'},
       {name:'Dev Patel', role:'Head of Operations', seed:'team-dev'}
     ]})}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 06</div>`,
  '06');

// =====================================================================
// 07 SECTION DIVIDER: Work
// =====================================================================
const s07 = divider('02','How we work');

// =====================================================================
// 08 SERVICES — iconQuad
// =====================================================================
const ico=(p)=>`<svg viewBox="0 0 24 24" style="width:50%;height:50%;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round">${p}</svg>`;
const I={
  code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
};
const s08 = slide(
  plusMark('right:6cqw;top:6cqh')+
  plusMark('left:6cqw;bottom:11cqh'),
  `<div style="position:absolute;left:6cqw;top:11cqh;width:50cqw">
     <div class="kicker" style="color:var(--ka)">What we ship</div>
     <h1 class="h1" style="margin-top:1.4cqh">Four service lines.</h1>
     <p class="lead soft" style="margin-top:1.6cqh;max-width:48cqw">Each line runs on its own dedicated pod — same people, same cadence, all year.</p>
   </div>
   <div style="position:absolute;left:6cqw;right:6cqw;top:42cqh">
     ${iconQuad([
       {title:'Engineering platforms',body:'Backend systems, APIs, internal tools.',icon:ico(I.code)},
       {title:'Design systems',body:'Component libraries, brand systems, motion.',icon:ico(I.layers)},
       {title:'Reliability & security',body:'Audits, hardening, ongoing support.',icon:ico(I.shield)},
       {title:'Rapid prototypes',body:'Sprints, spikes, working software in a week.',icon:ico(I.zap)}
     ])}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 08</div>`,
  '08');

// =====================================================================
// 09 PROCESS — processSpine
// =====================================================================
const s09 = slide(
  plusMark('right:6cqw;top:6cqh'),
  `<div style="position:absolute;left:6cqw;top:11cqh">
     <div class="kicker" style="color:var(--ka)">How a project moves</div>
     <h1 class="h1" style="margin-top:1.4cqh">From brief to handover in twelve weeks.</h1>
   </div>
   <div style="position:absolute;left:6cqw;right:6cqw;top:42cqh">
     ${processSpine([
       {title:'Brief',body:'Two-week scoping with a written plan.',icon:ico(I.layers)},
       {title:'Build',body:'Six weeks. Demos every Friday.',icon:ico(I.code)},
       {title:'Harden',body:'Two weeks. Tests, docs, monitoring.',icon:ico(I.shield)},
       {title:'Handover',body:'Two weeks. We pair you off it.',icon:ico(I.zap)}
     ])}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 09</div>`,
  '09');

// =====================================================================
// 10 GALLERY — featured projects (4 photos + captions)
// =====================================================================
const photoCell=(area,seed='')=>`<div data-photocell="1" data-photo-seed="${seed}" style="grid-area:${area};position:relative;background:var(--ph);border-radius:var(--r-md);overflow:hidden"></div>`;
const s10 = slide(
  plusMark('right:6cqw;top:6cqh'),
  `<div style="position:absolute;left:6cqw;top:11cqh;width:34cqw">
     <div class="kicker" style="color:var(--ka)">Selected work</div>
     <h1 class="h1" style="margin-top:1.4cqh">Four we are proud of.</h1>
     <p class="body" style="margin-top:2cqh;max-width:30cqw;opacity:.84">Internal tools and infrastructure for media companies, fintechs, and a public broadcaster.</p>
   </div>
   <div style="position:absolute;right:6cqw;top:11cqh;bottom:11cqh;width:52cqw;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:1.2cqw">
     ${photoCell('1 / 1 / 2 / 2','work-1')}
     ${photoCell('1 / 2 / 2 / 3','work-2')}
     ${photoCell('2 / 1 / 3 / 2','work-3')}
     ${photoCell('2 / 2 / 3 / 3','work-4')}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 10</div>`,
  '10');

// =====================================================================
// 11 SECTION DIVIDER: Proof
// =====================================================================
const s11 = divider('03','Proof');

// =====================================================================
// 12 STATS — BIG-STAT signature page: 1 hero number + sub-stats + donut + bar
// =====================================================================
const s12 = slide(
  `${plusMark('right:6cqw;top:6cqh','1.6','bg')}
   ${plusMark('right:6cqw;bottom:6cqh','1.4','bg')}`,
  `<div style="position:absolute;left:6cqw;top:11cqh;width:44cqw;z-index:3">
     <div class="kicker" style="opacity:.75">By the numbers</div>
     <h1 class="h1" style="margin-top:1.4cqh;font-size:5cqw">A year of compounding signal.</h1>
     <div style="margin-top:3cqh;font-family:var(--fd);font-weight:600;font-size:14cqw;line-height:.9;letter-spacing:-.03em">+34%</div>
     <p class="lead" style="margin-top:2cqh;max-width:40cqw;opacity:.9">Year-on-year revenue growth, with margins held and headcount steady.</p>
   </div>
   <div style="position:absolute;right:6cqw;top:14cqh;width:36cqw;z-index:3">
     <div style="display:flex;gap:3cqw;align-items:flex-start">
       <div data-device="stat-cell" style="position:relative">
         ${donut(82,18,'bg')}
         <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column">
           <div style="font-family:var(--fd);font-weight:600;font-size:3.4cqw;line-height:1">82%</div>
           <div class="cap" style="opacity:.85;margin-top:.5cqh">Retention</div>
         </div>
       </div>
       <div data-device="stat-cell" style="display:flex;flex-direction:column;gap:2cqh">
         <div>
           <div style="font-family:var(--fd);font-weight:600;font-size:3.2cqw;line-height:1">$48M</div>
           <div class="cap" style="opacity:.85;margin-top:.4cqh">Revenue</div>
         </div>
         <div>
           <div style="font-family:var(--fd);font-weight:600;font-size:3.2cqw;line-height:1">18</div>
           <div class="cap" style="opacity:.85;margin-top:.4cqh">People</div>
         </div>
       </div>
     </div>
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7;z-index:3">Business Data &nbsp;·&nbsp; 12</div>`,
  '','background:var(--g0);color:var(--t0)');

// =====================================================================
// 13 TESTIMONIALS — quoteCards × 3
// =====================================================================
const s13 = slide(
  plusMark('right:6cqw;top:6cqh')+
  plusMark('left:6cqw;bottom:11cqh'),
  `<div style="position:absolute;left:8cqw;top:11cqh;width:50cqw">
     <div class="kicker" style="color:var(--ka)">What customers tell us</div>
     <h1 class="h1" style="margin-top:1.4cqh">In their words.</h1>
   </div>
   <div style="position:absolute;left:8cqw;right:8cqw;top:38cqh;bottom:11cqh">
     ${quoteCards({quotes:[
       {text:'They shipped what we asked for, in the time they said, with the tests and the docs already done.',name:'Sarah Mendes',role:'CTO',company:'Northwind Media',seed:'quote-sarah'},
       {text:'Quiet, focused work. Exactly the kind of partner we needed for our infrastructure refresh.',name:'James Okafor',role:'Head of Platform',company:'BBN',seed:'quote-james'},
       {text:'We doubled traffic without doubling headcount. That is what they built for us.',name:'Priya Lal',role:'VP Engineering',company:'Plate',seed:'quote-priya'}
     ]})}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 13</div>`,
  '13');

// =====================================================================
// 14 PRICELIST — priceCardRow with retainer tiers
// =====================================================================
const s14 = slide(
  plusMark('right:6cqw;top:6cqh')+
  plusMark('left:6cqw;bottom:11cqh'),
  `<div style="position:absolute;left:8cqw;top:11cqh">
     <div class="kicker" style="color:var(--ka)">How we work with you</div>
     <h1 class="h1" style="margin-top:1.4cqh">Three retainer shapes.</h1>
     <p class="body" style="margin-top:1.6cqh;max-width:46cqw;opacity:.84">Pick what fits. Switch any time. All include a written plan, weekly demos, and the handover doc on day one.</p>
   </div>
   <div style="position:absolute;left:8cqw;right:8cqw;top:38cqh;bottom:11cqh">
     ${priceCardRow({cards:[
       {tier:'Spike',price:'$24k',unit:'/sprint',features:['Two-week scoping','One engineer, one designer','Written plan & handover']},
       {tier:'Build',price:'$80k',unit:'/quarter',tag:'Most common',features:['Twelve-week build','Pod of three','Demos every Friday','Tests + docs on day one']},
       {tier:'Embed',price:'$240k',unit:'/year',features:['Year-long pod','Pod of four','Quarterly roadmaps','Priority support window']}
     ]})}
   </div>
   <div class="kicker" style="position:absolute;left:6cqw;bottom:3.4cqh;opacity:.7">Business Data &nbsp;·&nbsp; 14</div>`,
  '14');

// =====================================================================
// 15 THANK YOU — accent ground + contact
// =====================================================================
const s15 = slide(
  `${plusMark('right:6cqw;top:6cqh','1.6','bg')}
   ${plusMark('right:6cqw;bottom:6cqh','1.4','bg')}
   ${photoBlock('right:6cqw;top:18cqh','width:34cqw;height:64cqh','thanks-side')}`,
  `<div style="position:absolute;left:8cqw;top:24cqh;width:42cqw;z-index:3">
     <div class="kicker" style="opacity:.75">Thank you</div>
     <h1 class="display" style="font-size:7.4cqw;margin-top:2.4cqh;line-height:1;letter-spacing:-.02em">Let's<br>build it.</h1>
     <p class="lead" style="margin-top:3cqh;max-width:38cqw;opacity:.92">Send us your brief — we will reply within two working days with a written plan.</p>
     <div class="kicker" style="margin-top:4cqh;opacity:.85">hello@yourcompany.com</div>
   </div>
   <div class="kicker" style="position:absolute;left:8cqw;bottom:3.4cqh;opacity:.7;z-index:3">yourcompany.com</div>`,
  '','background:var(--g0);color:var(--t0)');

const renderHtml = (slides) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Business Data — deck</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Lexend:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#FFFAFC; --surface:#FFFFFF; --ink:#2E1A2C; --soft:#6A5566; --ph:#F0E6EC;
  --accent:#D63A8E; --s1:#8E5BD0; --s2:#F4B8D4; --s3:#2E1A2C;
  --oa:#fff; --o1:#fff; --o2:#15131C; --o3:#fff;
  --ka:#2E1A2C; --kad:#FFFAFC;
  --g0:#ce3889; --g1:#8e5bd0; --g2:#f4b8d4; --g3:#2e1a2c;
  --t0:#fff; --t1:#fff; --t2:#15131C; --t3:#fff;
  --fd:'Space Grotesk'; --fb:'Lexend';
  --r-xs:.5cqw; --r-sm:.9cqw; --r-md:1.7cqw; --r-lg:3cqw; --r-xl:5cqw;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#cfd2d8;color:var(--ink);font-family:var(--fb),sans-serif;}
.deck{scroll-snap-type:y mandatory;height:100vh;overflow-y:scroll;}
.slide{width:100vw;height:100vh;scroll-snap-align:start;display:flex;background:#cfd2d8;}
.stage{position:relative;width:min(92vw,163.55vh);height:min(51.75vw,92vh);margin:auto;overflow:hidden;container-type:size;background:var(--bg);color:var(--ink);border:1px solid rgba(0,0,0,.12);box-shadow:0 14px 50px rgba(0,0,0,.2);}
.fit{position:absolute;inset:0;transform-origin:top center;}
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
.tile{display:flex;align-items:center;justify-content:center;border-radius:var(--r-md);}
.tile svg{width:55%;height:55%;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.badge{display:flex;align-items:center;justify-content:center;border-radius:var(--r-md);font-family:var(--fd);font-weight:600;}
.tick{position:absolute;}
.card{background:var(--surface);border-radius:var(--r-md);}
.dot{border-radius:50%;}
.qcircle{border-radius:50% 0 0 0;}
.semi{border-radius:999px 999px 0 0;}
.tri{width:0;height:0;}
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

const slides=[s01,s02,s03,s04,s05,s06,s07,s08,s09,s10,s11,s12,s13,s14,s15].join('\n');
const outFlag = process.argv.indexOf('--out');
const outFile = outFlag === -1
  ? resolve(here, 'example.html')
  : resolve(process.cwd(), process.argv[outFlag + 1]);
const html = renderHtml(slides);

writeFileSync(outFile, html);
console.log('example.html built:', html.length, 'bytes,', (html.match(/class="slide"/g)||[]).length, 'slides');
