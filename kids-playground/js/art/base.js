// Shared drawing vocabulary. Every picture is an SVG string drawn in a 200×200 box
// (the wrapper leaves a margin around it), in one flat style: bold flat colours, no outlines,
// depth from darker and lighter shapes of the same hue, dot eyes and round cheeks.
//
// Classes: "d" marks small details (the colouring book leaves them alone), "t" a thick stroke
// that is a shape of its own (tails, stems), "eye" the eyes, "a-*" parts that move.

export const INK = '#38334d';
export const BOX = '-12 -16 224 228';

let uid = 0;
export const nextId = () => `kp${++uid}`;
/** A different animation delay for each picture, so a crowd does not move in step. */
export const delay = () => `style="animation-delay:-${((++uid * 37) % 50) / 10}s"`;

export const rot = (deg, x, y) => `transform="rotate(${deg} ${x} ${y})"`;

/** Darken (amount < 0) or lighten (amount > 0) a #rrggbb colour. */
export function shade(hex, amount) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const n = parseInt(hex.slice(1), 16), t = amount < 0 ? 0 : 255, k = Math.abs(amount);
  const ch = (v) => Math.round(v + (t - v) * k).toString(16).padStart(2, '0');
  return `#${ch(n >> 16)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}

/** Main shapes. */
export const E = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
export const C = (cx, cy, r, fill, extra = '') => E(cx, cy, r, r, fill, extra);
export const P = (d, fill, extra = '') => (fill === 'none' ? '' : `<path d="${d}" fill="${fill}" ${extra}/>`);
export const R = (x, y, w, h, r, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;

/** Small details. */
export const e = (cx, cy, rx, ry, fill, extra = '') => `<ellipse class="d" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
export const c = (cx, cy, r, fill, extra = '') => e(cx, cy, r, r, fill, extra);
export const p = (d, fill, extra = '') => `<path class="d" d="${d}" fill="${fill}" ${extra}/>`;

/** A drawn line. */
export const L = (d, w = 3.5, color = INK, extra = '') =>
  `<path class="d" d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

/** A thick rounded stroke used as a shape: tails, trunks, stems, arms. */
export const tube = (d, color, w = 10) =>
  `<path class="t" d="${d}" fill="none" stroke="${color}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Keep details inside an ellipse or a path (stripes, patches, shadows). */
export const inside = (cx, cy, rx, ry, content) => {
  const id = nextId();
  return `<clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath><g clip-path="url(#${id})">${content}</g>`;
};
export const insidePath = (d, content) => {
  const id = nextId();
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${content}</g>`;
};

/** A soft highlight streak, and a flat shadow. */
export const shine = (cx, cy, rx, ry, extra = '') => e(cx, cy, rx, ry, '#fff', `opacity=".4" ${extra}`);
export const shadow = (cx, cy, rx, ry, o = 0.1) => e(cx, cy, rx, ry, '#1f1a3a', `opacity="${o}"`);

/** The shared face: two shiny dot eyes, round cheeks and a little mouth. */
export function face(cx, cy, o = {}) {
  const { gap = 27, r = 8, mouth = 'smile', blush = true, my = 13, by = 11, ring = '', teeth = false, eyes = true, bx = 0, cheek = '#ff8fa3' } = o;
  let out = '';
  for (const s of [-1, 1]) {
    const x = cx + s * gap;
    if (blush) out += e(x + s * (r + 9 + bx), cy + by, r * 1.05, r * 0.95, cheek, 'opacity=".75"');
    if (!eyes) continue;
    out += `<g class="eye">`;
    if (ring) out += `<ellipse cx="${x}" cy="${cy}" rx="${r + 4}" ry="${r * 1.1 + 4}" fill="${ring}"/>`;
    out += `<ellipse cx="${x}" cy="${cy}" rx="${r * 0.95}" ry="${r * 1.1}" fill="${INK}"/>` +
      `<circle cx="${x - r * 0.3}" cy="${cy - r * 0.4}" r="${r * 0.36}" fill="#fff"/></g>`;
  }
  const y = cy + my;
  if (mouth === 'smile') out += L(`M${cx - 7} ${y} q7 7 14 0`);
  else if (mouth === 'big') out += L(`M${cx - 13} ${y - 2} q13 13 26 0`);
  else if (mouth === 'w') out += L(`M${cx - 10} ${y} q5 6 10 0 q5 6 10 0`);
  else if (mouth === 'o') out += e(cx, y + 2, 5, 6, '#c0455e');
  else if (mouth === 'open') {
    const id = nextId(), d = `M${cx - 11} ${y - 2} h22 a11 12 0 0 1 -22 0z`;
    out += `<clipPath id="${id}"><path d="${d}"/></clipPath><path class="d" d="${d}" fill="${INK}"/><ellipse class="d" clip-path="url(#${id})" cx="${cx}" cy="${y + 10}" rx="7" ry="5" fill="#ff7f9c"/>`;
  }
  if (teeth) out += `<rect class="d" x="${cx - 4.5}" y="${y + 2}" width="9" height="7" rx="2" fill="#fff"/>`;
  return out;
}

/** Five-pointed star and heart paths, centred at (cx, cy). */
export function starPath(cx, cy, R1, R2 = R1 * 0.5, n = 5, turn = -90) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (turn + i * 180 / n) * Math.PI / 180, rr = i % 2 ? R2 : R1;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
}
/** A star with soft rounded points. */
export const star = (cx, cy, r, fill, extra = '') =>
  `<path d="${starPath(cx, cy, r * 0.92, r * 0.46)}" fill="${fill}" stroke="${fill}" stroke-width="${r * 0.22}" stroke-linejoin="round" ${extra}/>`;
export const heartPath = (cx, cy, s) =>
  `M${cx} ${cy + s * 0.9} C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.75} ${cy - s * 1.15} ${cx} ${cy - s * 0.35} C${cx + s * 0.75} ${cy - s * 1.15} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.9}Z`;
/** The four-pointed sparkle LogicLike-style pictures are sprinkled with. */
export const sparkle = (cx, cy, r, fill = '#fff') =>
  `<path class="d twinkle" d="M${cx} ${cy - r} Q${cx + r * 0.18} ${cy - r * 0.18} ${cx + r} ${cy} Q${cx + r * 0.18} ${cy + r * 0.18} ${cx} ${cy + r} Q${cx - r * 0.18} ${cy + r * 0.18} ${cx - r} ${cy} Q${cx - r * 0.18} ${cy - r * 0.18} ${cx} ${cy - r}Z" fill="${fill}"/>`;

/** Wrap a drawing into a standalone <svg>. */
export const wrap = (inner, cls = '', box = BOX) =>
  `<svg class="art ${cls}" viewBox="${box}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
