// Backdrops and scenery. Scenes are drawn in stage units (W × 800) and deliberately
// spill far past every edge, so any screen shape is filled.
import { INK, E, C, P, R, e, c, p, L, tube, rot, nextId, delay, shade, starPath, heartPath } from './base.js';

const FAR = 1400;   // how far scenery bleeds past the stage

export const sceneSvg = (W, inner, cls = '') =>
  `<svg class="scene ${cls}" viewBox="0 0 ${W} 800" width="${W}" height="800" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export function gradient(W, stops, y0 = -FAR, y1 = 800 + FAR) {
  const id = nextId();
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, col]) => `<stop offset="${o}" stop-color="${col}"/>`).join('')}</linearGradient></defs>` +
    `<rect x="${-FAR}" y="${y0}" width="${W + FAR * 2}" height="${y1 - y0}" fill="url(#${id})"/>`;
}
/** Sky that is `top` at the top of the stage and `bottom` at y. */
export const sky = (W, top = '#9fdcff', bottom = '#e6f8ff', y = 620) =>
  `<rect x="${-FAR}" y="${-FAR}" width="${W + FAR * 2}" height="${FAR + 2}" fill="${top}"/>` + gradient(W, [[0, top], [1, bottom]], 0, y) +
  `<rect x="${-FAR}" y="${y - 1}" width="${W + FAR * 2}" height="${FAR}" fill="${bottom}"/>`;

export const band = (W, y, fill, h = FAR) => `<rect x="${-FAR}" y="${y}" width="${W + FAR * 2}" height="${h}" fill="${fill}"/>`;

export const cloud = (x, y, s = 1, fill = '#b5f3ff', o = 0.95) =>
  `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><g class="drift" ${delay()}><path d="M-84 20 a24 24 0 0 1 14 -44 a36 36 0 0 1 64 -18 a30 30 0 0 1 52 18 a24 24 0 0 1 22 44z" fill="${fill}"/></g></g>`;

export const sun = (x, y, r = 60) =>
  `<g transform="translate(${x} ${y})"><circle class="pulse-soft" r="${r * 1.55}" fill="#fff" opacity=".22"/><circle r="${r * 1.25}" fill="#fff7a8" opacity=".55"/><circle r="${r}" fill="#ffe84d"/>` +
  `<ellipse cx="${-r * 0.3}" cy="${-r * 0.06}" rx="${r * 0.085}" ry="${r * 0.11}" fill="${INK}"/><ellipse cx="${r * 0.3}" cy="${-r * 0.06}" rx="${r * 0.085}" ry="${r * 0.11}" fill="${INK}"/><path d="M${-r * 0.18} ${r * 0.2} q${r * 0.18} ${r * 0.18} ${r * 0.36} 0" fill="none" stroke="${INK}" stroke-width="${r * 0.06}" stroke-linecap="round"/>` +
  `<circle cx="${-r * 0.52}" cy="${r * 0.18}" r="${r * 0.13}" fill="#ffb347" opacity=".8"/><circle cx="${r * 0.52}" cy="${r * 0.18}" r="${r * 0.13}" fill="#ffb347" opacity=".8"/></g>`;

/** A rolling hill line across the whole width, filled downwards. */
export function hills(W, y, fill, amp = 40, wave = 520, shift = 0) {
  let d = `M${-FAR} ${y}`;
  for (let x = -FAR; x < W + FAR; x += wave) d += ` q${wave / 4} ${-amp} ${wave / 2} 0 t${wave / 2} 0`;
  return `<path transform="translate(${shift} 0)" d="${d} V${800 + FAR} H${-FAR}Z" fill="${fill}"/>`;
}

export const tree = (x, y, s = 1, leaf = '#4fc56a', dark = '#3fae5a') =>
  `<g transform="translate(${x} ${y}) scale(${s})">${R(-13, -70, 26, 80, 10, '#a8693a')}${R(-13, -70, 11, 80, 5, '#8f5630')}${C(-44, -96, 46, dark)}${C(44, -96, 46, leaf)}${C(0, -150, 54, leaf)}${e(0, -104, 56, 40, leaf)}` +
  `${c(-34, -124, 10, shade(leaf, 0.25))}${c(22, -160, 8, shade(leaf, 0.25))}${c(40, -100, 11, dark)}${c(-6, -84, 7, dark)}</g>`;

export const appleTree = (x, y, s = 1) =>
  tree(x, y, s) + `<g transform="translate(${x} ${y}) scale(${s})">${[[-48, -100], [30, -80], [0, -160], [52, -120], [-16, -124]].map(([ax, ay]) => C(ax, ay, 11, '#ff5a5a', 'stroke-width="3.500"')).join('')}</g>`;

export const pine = (x, y, s = 1, fill = '#4fb35a') =>
  `<g transform="translate(${x} ${y}) scale(${s})">${R(-11, -30, 22, 40, 6, '#a8744a')}${P('M0 -210 L58 -110 H30 L74 -40 H-74 L-30 -110 H-58Z', fill)}${p('M0 -210 L58 -110 H30 L74 -40 H0Z', shade(fill, -0.1))}</g>`;

export const bush = (x, y, s = 1, fill = '#5fc45a') =>
  `<g transform="translate(${x} ${y}) scale(${s})">${C(-46, -26, 34, shade(fill, -0.1))}${C(46, -26, 34, fill)}${C(0, -44, 46, fill)}${e(0, -10, 78, 28, fill)}${p('M-80 0 h160 v22 h-160z', fill)}` +
  `${c(-20, -50, 6, '#ff9ecb')}${c(30, -30, 6, '#fff')}${c(-50, -22, 5, '#ffe26a')}</g>`;

export const flower = (x, y, s = 1, petal = '#ff9ecb', mid = '#ffd447') => {
  let petals = '';
  for (let i = 0; i < 5; i++) petals += `<ellipse cx="0" cy="-13" rx="9.500" ry="12.500" fill="${petal}" transform="rotate(${i * 72})"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway" ${delay()}><path d="M0 0 q-4 22 0 44" fill="none" stroke="#3fae5a" stroke-width="5" stroke-linecap="round"/><path d="M0 30 q14 -14 24 -4 q-12 12 -24 4z" fill="#3fae5a"/>` +
    `<g transform="translate(0 -6)">${petals}<circle r="8" fill="${mid}"/></g></g></g>`;
};

export const tuft = (x, y, s = 1, fill = '#4fb35a') =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M-16 0 q0 -22 -10 -30 q16 4 16 22 q0 -26 10 -40 q4 20 0 40 q4 -16 18 -22 q-8 12 -8 30z" fill="${fill}"/>`;

export const rainbow = (x, y, r = 220) =>
  ['#ff7a8a', '#ffb347', '#ffe26a', '#8fd764', '#7fd3ff', '#b79cff'].map((col, i) =>
    `<path d="M${x - r + i * 16} ${y} a${r - i * 16} ${r - i * 16} 0 0 1 ${(r - i * 16) * 2} 0" fill="none" stroke="${col}" stroke-width="17"/>`).join('');

const FLOWERS = ['#ff9ecb', '#fff', '#ffd447', '#b79cff', '#ff8a7a'];

/** A sunny meadow: sky, clouds, far hills and a grassy foreground starting at `groundY`. */
export function meadow(W, groundY = 560, o = {}) {
  const { flowers = true, trees = true, sunX = W - 150 } = o;
  let out = sky(W, '#62d4ff', '#b5efff', groundY) + sun(sunX, 120, 62) +
    cloud(W * 0.18, 120, 1.1) + cloud(W * 0.5, 70, 0.8) + cloud(W * 0.72, 190, 1) + cloud(-160, 220, 1.2) + cloud(W + 180, 90, 1.1) +
    hills(W, groundY - 90, '#a6ecb0', 60, 700, 120) + hills(W, groundY - 40, '#84e08c', 46, 560, -80);
  if (trees) out += tree(W * 0.08, groundY - 6, 0.9) + pine(W * 0.9, groundY - 2, 0.8) + tree(W + 220, groundY, 1.1) + pine(-200, groundY, 1);
  out += hills(W, groundY, '#62d16f', 16, 800) + band(W, groundY + 60, '#56c765');
  if (flowers) {
    for (let i = 0; i < 16; i++) {
      const x = -300 + ((i * 197 + 60) % (W + 600)), y = groundY + 50 + ((i * 83) % 190);
      out += i % 3 === 0 ? tuft(x, y, 1.1, '#3fae5a') : flower(x, y - 20, 0.75, FLOWERS[i % 5]);
    }
  }
  return out;
}

/** The open sea with an island and a big low sun (the backdrop of the thinking games). */
export function island(W, seaY = 430) {
  const sx = W * 0.78;
  return band(W, -FAR, '#62d4ff', FAR + seaY) + `<circle cx="${sx}" cy="${seaY}" r="300" fill="#8be4ff"/><circle class="pulse-soft" cx="${sx}" cy="${seaY}" r="240" fill="#fff36b"/>` +
    cloud(W * 0.3, 150, 1.5, '#9ef0ff') + cloud(W * 0.05, 230, 1, '#9ef0ff') +
    `<g transform="translate(${W * 0.16} ${seaY})">${P('M-190 0 L-90 -150 L-40 -90 L20 -190 L120 -60 L170 -84 L250 0Z', '#8a6257')}${P('M-124 -100 L-90 -150 L-56 -108 L-74 -96 L-92 -112 L-106 -94Z', '#f3e3d3')}${P('M-12 -138 L20 -190 L56 -142 L36 -130 L20 -150 L4 -128Z', '#f3e3d3')}` +
    `${P('M-150 0 Q-60 -60 30 -14 Q110 -50 200 0Z', '#9ccc50')}${P('M-230 0 Q0 -22 290 0Z', '#ffe9a8')}</g>` +
    band(W, seaY, '#4db5f0') + hills(W, seaY + 8, '#5fc4f7', 7, 220) + band(W, seaY + 30, '#4db5f0') +
    Array.from({ length: 18 }, (_, i) => c(-200 + ((i * 229) % (W + 400)), seaY + 70 + ((i * 97) % 300), 4 + (i % 3) * 3, '#6fcaf7')).join('');
}

/** An indoor room: patterned wall above `floorY`, a floor below. */
export function room(W, wall = '#ffe3ee', dot = '#ffc9dd', floor = '#f4c9a0', floorY = 560, pattern = 'dots') {
  const id = nextId();
  const tile = pattern === 'dots' ? `<circle cx="30" cy="30" r="7" fill="${dot}"/><circle cx="0" cy="0" r="7" fill="${dot}"/><circle cx="60" cy="0" r="7" fill="${dot}"/><circle cx="0" cy="60" r="7" fill="${dot}"/><circle cx="60" cy="60" r="7" fill="${dot}"/>`
    : pattern === 'stripes' ? `<rect x="0" y="0" width="30" height="60" fill="${dot}"/>`
      : `<path d="M0 0h60v60h-60z" fill="none" stroke="${dot}" stroke-width="4"/>`;
  return `<defs><pattern id="${id}" width="60" height="60" patternUnits="userSpaceOnUse">${tile}</pattern></defs>` +
    band(W, -FAR, wall, FAR + floorY) + `<rect x="${-FAR}" y="${-FAR}" width="${W + FAR * 2}" height="${FAR + floorY}" fill="url(#${id})"/>` +
    band(W, floorY, floor) + band(W, floorY, 'rgba(90,59,46,.16)', 10) + band(W, floorY - 22, '#fff', 22) + band(W, floorY - 24, 'rgba(90,59,46,.12)', 4);
}

/** Under the sea: light rays, sand, seaweed and bubbles. */
export function seabed(W, sandY = 640) {
  let out = gradient(W, [[0, '#7fd9f5'], [0.5, '#4fb8e8'], [1, '#2f86c9']], -200, sandY + 40) + band(W, -FAR, '#7fd9f5', FAR - 198);
  for (let i = 0; i < 6; i++) out += `<path d="M${W * (0.1 + i * 0.17) - 40} -400 l-160 1400 h120 l160 -1400z" fill="#fff" opacity=".07"/>`;
  out += hills(W, sandY, '#f7e3ae', 22, 640) + band(W, sandY + 50, '#f1d795');
  for (let i = 0; i < 14; i++) out += c(-200 + ((i * 251) % (W + 400)), sandY + 50 + ((i * 67) % 120), 5 + (i % 3) * 2, '#e6c67a');
  return out;
}
export const seaweed = (x, y, s = 1, fill = '#3fbf8a') =>
  `<g class="sway" transform="translate(${x} ${y}) scale(${s})">${tube('M0 0 q-22 -40 0 -80 q22 -40 0 -80', fill, 12)}${tube('M30 0 q20 -30 0 -60 q-16 -26 0 -50', fill, 10)}</g>`;
export const coral = (x, y, s = 1, fill = '#ff8fa3') =>
  `<g transform="translate(${x} ${y}) scale(${s})">${tube('M0 0 v-70 M0 -30 q-34 -6 -34 -44 M0 -44 q30 -4 32 -40 M-34 -74 q-14 -6 -12 -26 M32 -84 q14 -8 10 -26', fill, 13)}</g>`;
export const bubbles = (W, n = 14) => {
  let out = '';
  for (let i = 0; i < n; i++) out += `<circle class="bubble-rise" style="animation-delay:${-(i * 1.300) % 9}s;animation-duration:${7 + (i % 5)}s" cx="${((i * 211 + 90) % (W + 200)) - 100}" cy="840" r="${6 + (i % 4) * 4}" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
  return out;
};

/** A starry night with a moon. */
export function night(W, groundY = 600) {
  let out = gradient(W, [[0, '#2b2f77'], [1, '#7b5fc9']], -100, groundY) + band(W, -FAR, '#2b2f77', FAR - 98);
  for (let i = 0; i < 40; i++) {
    const x = -300 + ((i * 173) % (W + 600)), y = -60 + ((i * 97) % (groundY - 40));
    out += `<path class="twinkle" style="animation-delay:${-(i % 7) * 0.4}s" d="${starPath(x, y, 5 + (i % 3) * 2.500)}" fill="#fff6c9"/>`;
  }
  out += `<circle cx="${W - 170}" cy="130" r="64" fill="#fff6c9"/><circle cx="${W - 146}" cy="112" r="56" fill="#3a3c8c" opacity=".0"/>` + c(W - 190, 112, 10, '#f1e3a0') + c(W - 150, 150, 14, '#f1e3a0') + c(W - 176, 160, 6, '#f1e3a0');
  out += hills(W, groundY - 30, '#4f4aa6', 50, 640, 100) + hills(W, groundY, '#3f8f6a', 18, 800) + band(W, groundY + 60, '#37805e');
  return out;
}

export { heartPath, starPath };
