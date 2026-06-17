/* shapes.mjs @1.1.0 — parametric SVG primitives for the deck vocabulary (mostly
 * mathematically-symmetric; blob/doodleSpark are intentionally organic/hand-drawn).
 * 1.1.0 (2026-06-16): + blob, + doodleSpark (Playful-Children ingestion, Tong-approved).
 * Each fn returns the INNER markup for a
 * <svg viewBox="0 0 100 100">. Symmetry is computed (rotate/mirror from one arm),
 * never hand-typed — so the shapes are perfect and consistent every time.
 * Colours come in as CSS var names so they follow the palette. */
export const C = (i)=>`var(--${i})`;                       // colour helper

// 8-spoke asterisk built from 4 identical rounded bars rotated 0/45/90/135°
export function asterisk8(fill='currentColor', bar=17, len=94){
  const r=bar/2, x=(100-len)/2, y=(100-bar)/2;
  return [0,45,90,135].map(a=>
    `<rect x="${x}" y="${y}" width="${len}" height="${bar}" rx="${r}" transform="rotate(${a} 50 50)" fill="${fill}"/>`
  ).join('');
}
// 4-point concave "sparkle" (✦) — quadratic curves pinched toward the centre
export function sparkle4(fill='currentColor', pinch=15){
  const c=50, p=pinch; // smaller pinch = sharper concave waist
  return `<path d="M50 3 Q${c+p} ${c-p} 97 50 Q${c+p} ${c+p} 50 97 Q${c-p} ${c+p} 3 50 Q${c-p} ${c-p} 50 3 Z" fill="${fill}"/>`;
}
// n×n checkerboard, two colours
export function checker(a='currentColor', b='transparent', n=4){
  const s=100/n; let o='';
  for(let r=0;r<n;r++)for(let col=0;col<n;col++) if((r+col)%2===0) o+=`<rect x="${col*s}" y="${r*s}" width="${s}" height="${s}" fill="${a}"/>`;
  if(b!=='transparent') for(let r=0;r<n;r++)for(let col=0;col<n;col++) if((r+col)%2===1) o+=`<rect x="${col*s}" y="${r*s}" width="${s}" height="${s}" fill="${b}"/>`;
  return o;
}
// two stacked half-discs (top half + bottom half, small gap between)
export function semiPair(fill='currentColor'){
  return `<path d="M12 47 A38 38 0 0 1 88 47 Z" fill="${fill}"/>`+
         `<path d="M12 53 A38 38 0 0 0 88 53 Z" fill="${fill}" opacity=".6"/>`;
}
// k stacked filled chevrons pointing up
export function chevronStack(fill='currentColor', k=3, h=24, gap=4){
  let o=''; const w=80, x0=10, t=10;
  for(let i=0;i<k;i++){ const y=t+i*(h*0.55+gap);
    o+=`<polygon points="${x0},${y+h} 50,${y} ${x0+w},${y+h} ${x0+w},${y+h-7} 50,${y+7} ${x0},${y+h-7}" fill="${fill}"/>`; }
  return o;
}
// rotated diamond with a centred square hole-colour
export function diamondInSquare(diamond='currentColor', inner='#fff'){
  return `<rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" fill="${diamond}"/>`+
         `<rect x="36" y="36" width="28" height="28" fill="${inner}"/>`;
}
// 4-dot clover (2×2 circles touching at centre)
export function clover4(fill='currentColor', r=23){
  const o=50-r-1, p=50+r+1; return [[o,o],[p,o],[o,p],[p,p]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
}
// quarter-circle petals filling the 4 corners -> negative-space 4-point star centre
export function quarterPetals(fill='currentColor', r=50){
  return [
    `<path d="M0 0 L${r} 0 A${r} ${r} 0 0 1 0 ${r} Z" fill="${fill}"/>`,           // TL
    `<path d="M100 0 L100 ${r} A${r} ${r} 0 0 1 ${100-r} 0 Z" fill="${fill}"/>`,    // TR
    `<path d="M100 100 L${100-r} 100 A${r} ${r} 0 0 1 100 ${100-r} Z" fill="${fill}"/>`, // BR
    `<path d="M0 100 L0 ${100-r} A${r} ${r} 0 0 1 ${r} 100 Z" fill="${fill}"/>`     // BL
  ].join('');
}

// scalloped sunburst rosette — N teeth alternating outer/inner radius around a centre.
// Default 14 teeth, ~14% depth → blunt cookie-cutter scallop. The signature container
// for numerals/years/percentages — fills the burst-star slot in the shape vocabulary.
export function sunburst(fill='currentColor', n=14, depth=14){
  const cx=50, cy=50, R=49, r=R-depth;
  const pts=[];
  for(let i=0;i<n*2;i++){
    const a=(i*Math.PI)/n - Math.PI/2;
    const rad=i%2===0?R:r;
    pts.push(`${(cx+rad*Math.cos(a)).toFixed(2)},${(cy+rad*Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

// foliage sprig — stylised leaf cluster on a curved stem, the agency-style
// decoration motif. Parametric: variant flips orientation; n = leaf count.
// Each leaf is a teardrop polygon; the stem is a smooth curve.
export function foliageSprig(fill='currentColor', variant=0, n=4){
  // four orientation variants for natural scatter
  const orients = [
    {sx:50,sy:95, ex:18,ey:25, stem:'M 50 95 Q 50 60 18 25'},
    {sx:50,sy:95, ex:82,ey:25, stem:'M 50 95 Q 50 60 82 25'},
    {sx:5,sy:50, ex:95,ey:45, stem:'M 5 50 Q 50 35 95 45'},
    {sx:50,sy:5, ex:55,ey:95, stem:'M 50 5 Q 65 50 55 95'}
  ];
  const o = orients[variant%4];
  const stem = `<path d="${o.stem}" stroke="${fill}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const leaves = [];
  for(let i=0;i<n;i++){
    const t = 0.15 + i*(0.7/(n-1));
    const x = o.sx + (o.ex-o.sx)*t;
    const y = o.sy + (o.ey-o.sy)*t;
    const stemAng = Math.atan2(o.ey-o.sy, o.ex-o.sx) * 180/Math.PI;
    const side = (i%2 === 0 ? 1 : -1);
    const leafAng = stemAng + 55*side;
    // teardrop leaf path 0,0 → tip at (28,0) with a wide curve
    leaves.push(`<path d="M 0 0 Q 14 -8 28 0 Q 14 8 0 0 Z" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${leafAng.toFixed(1)})" fill="${fill}"/>`);
  }
  return stem + leaves.join('');
}

// organic blob — seeded amorphous CLOSED shape (Catmull-Rom smoothed through computed
// points). `seed` varies the silhouette (same fn → different blobs); `n` = lobe count.
// The "big peripheral decoration" + irregular-ground primitive (promoted shapes@1.1.0,
// approved by Tong 2026-06-16 from the Playful-Children source). Parametric but
// intentionally NOT symmetric — organic is the point.
export function blob(fill='currentColor', seed=0, n=8){
  const cx=50,cy=50,base=38,pts=[];
  for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2;const r=base+9*Math.sin(i*1.7+seed)+5*Math.cos(i*2.3+seed*1.3);pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
  let d=`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} `;
  for(let i=0;i<n;i++){const p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
    const c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6,c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=`C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} `;}
  return `<path d="${d}Z" fill="${fill}"/>`;
}

// doodle spark — n parallel short slashes (kid "motion / excitement" marks, the source's
// yellow ///). `variant` rotates the cluster. The loose, hand-drawn counterpart to
// sparkle4 (promoted shapes@1.1.0, approved by Tong 2026-06-16).
export function doodleSpark(fill='currentColor', variant=0, sw=7, n=3){
  let o=''; for(let i=0;i<n;i++){const x=30+i*16; o+=`<line x1="${x}" y1="64" x2="${x+14}" y2="34" stroke="${fill}" stroke-width="${sw}" stroke-linecap="round"/>`;}
  return `<g transform="rotate(${variant} 50 50)">${o}</g>`;
}

export const ALL = {asterisk8, sparkle4, checker, semiPair, chevronStack, diamondInSquare, clover4, quarterPetals, sunburst, foliageSprig, blob, doodleSpark};
