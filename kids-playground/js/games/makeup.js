// 化妆间 — pick a colour and rub it on: lipstick, blush, eye shadow. Then lashes, sparkles, bows, earrings and a necklace.
import { pick, el, dist, anim } from '../core.js';
import { room, sceneSvg } from '../art/scenes.js';
import { INK, E, C, P, R, e, c, p, L, tube, rot, starPath, heartPath, nextId } from '../art/base.js';
import { tray } from './kit.js';

const SKIN = '#ffe2cc';
const HAIRS = [['bob', '#6b4433'], ['buns', '#3b2f3a'], ['long', '#e2a55a'], ['buns', '#ff9ecb'], ['long', '#8a5cd0']];
const PAL = {
  lip: ['#e8364f', '#ff5c8a', '#ff9ec0', '#c2185b', '#ff7043', '#b565d9'],
  blush: ['#ff8fa3', '#ffab91', '#f48fb1', '#ffc46b', '#ff7a8a', '#e6a0ff'],
  shadow: ['#b388ff', '#80d8ff', '#f48fb1', '#9be29f', '#ffd54f', '#ff8a65'],
};
// where each colour goes, in face units: [cx, cy, rx, ry]
const ZONES = { lip: [[300, 504, 72, 50]], blush: [[168, 452, 76, 60], [432, 452, 76, 60]], shadow: [[218, 316, 84, 62], [382, 316, 84, 62]] };

const LIPS = 'M266 496 Q283 481 300 491 Q317 481 334 496 Q319 528 300 528 Q281 528 266 496Z';
const lid = (cx, cy) => `M${cx - 56} ${cy - 2} C${cx - 52} ${cy - 70} ${cx + 52} ${cy - 70} ${cx + 56} ${cy - 2} C${cx + 32} ${cy - 44} ${cx - 32} ${cy - 44} ${cx - 56} ${cy - 2}Z`;
const eye = (cx, cy) => `<g class="eye"><ellipse cx="${cx}" cy="${cy}" rx="30" ry="36" fill="#3b2a25"/><ellipse cx="${cx}" cy="${cy + 8}" rx="19" ry="22" fill="#6b4433"/><circle cx="${cx - 10}" cy="${cy - 14}" r="12" fill="#fff"/><circle cx="${cx + 11}" cy="${cy + 14}" r="6" fill="#fff" opacity=".85"/></g>`;

const hairBack = (style, col) => (style === 'buns' ? C(140, 84, 64, col) + C(460, 84, 64, col) : '') +
  (style === 'long'
    ? P('M300 40 C120 40 66 190 76 360 C80 520 40 640 70 720 L530 720 C560 640 520 520 524 360 C534 190 480 40 300 40Z', col)
    : P('M300 40 C120 40 66 190 76 360 C80 470 96 560 134 604 L466 604 C504 560 520 470 524 360 C534 190 480 40 300 40Z', col));
const hairFront = (col) => P('M98 334 C86 170 188 70 300 70 C412 70 514 170 502 334 C496 292 482 268 462 256 Q440 276 414 262 Q388 278 360 262 Q330 278 300 262 Q270 278 240 262 Q212 278 186 262 Q160 276 138 256 C118 268 104 292 98 334Z', col) +
  L('M210 110 q-30 40 -34 96 M300 96 v110 M390 110 q30 40 34 96', 4, 'rgba(255,255,255,.22)');

const flowerAt = (x, y, col, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-15" rx="10" ry="13" fill="${col}" stroke="${INK}" stroke-width="3.500" transform="rotate(${a})"/>`).join('')}<circle r="9" fill="#ffd447" stroke="${INK}" stroke-width="3.500"/></g>`;
const bowAt = (x, y, col, s = 1, dark = '#ff5c8a') => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0 0 C-30 -46 -84 -44 -78 0 C-84 44 -30 46 0 0Z', col)}${P('M0 0 C30 -46 84 -44 78 0 C84 44 30 46 0 0Z', col)}${L('M-58 -14 q20 14 40 10 M58 -14 q-20 14 -40 10', 4, dark)}${R(-17, -20, 34, 40, 12, dark)}</g>`;

const ITEMS = {
  lash: {
    soft: (cx, s) => L(`M${cx + s * 34} 322 l${s * 14} -10 M${cx + s * 26} 314 l${s * 10} -14`, 5),
    long: (cx, s) => L(`M${cx + s * 36} 324 l${s * 18} -10 M${cx + s * 28} 314 l${s * 14} -18 M${cx + s * 14} 306 l${s * 6} -20 M${cx - s * 2} 304 l0 -18 M${cx - s * 18} 308 l${-s * 6} -16`, 5),
    wing: (cx, s) => P(`M${cx - s * 36} 326 Q${cx} 286 ${cx + s * 38} 322 L${cx + s * 66} 300 Q${cx + s * 50} 330 ${cx + s * 36} 332 Q${cx} 300 ${cx - s * 36} 326Z`, '#3b2a25', 'stroke-width="3"') +
      L(`M${cx + s * 20} 308 l${s * 10} -18 M${cx + s * 2} 302 l${s * 3} -18`, 5),
  },
  gem: {
    stars: () => [[150, 392, 14], [128, 420, 9], [450, 392, 14], [472, 420, 9]].map(([x, y, r]) => P(starPath(x, y, r, r * 0.45), '#ffd447', 'stroke-width="3"')).join(''),
    hearts: () => [[146, 396, 10], [454, 396, 10]].map(([x, y, s]) => P(heartPath(x, y, s), '#ff5c8a', 'stroke-width="3"')).join('') + c(124, 416, 5, '#ff9ec0') + c(476, 416, 5, '#ff9ec0'),
    pearls: () => [[172, 392], [196, 398], [220, 400], [428, 392], [404, 398], [380, 400]].map(([x, y]) => C(x, y, 7, '#fff', 'stroke-width="2.500"')).join(''),
    moon: () => P('M300 150 a26 26 0 1 0 22 40 a20 20 0 1 1 -22 -40Z', '#ffd447', 'stroke-width="3.500"') + P(starPath(336, 160, 9, 4), '#fff', 'stroke-width="2.500"'),
    rainbow: () => [[160, 400, -12], [440, 400, 12]].map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})">${['#ff7a8a', '#ffd447', '#7fd3ff'].map((col, i) => `<path d="M${x - 20 + i * 6} ${y + 8} a${20 - i * 6} ${20 - i * 6} 0 0 1 ${(20 - i * 6) * 2} 0" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`).join('')}</g>`).join(''),
  },
  hair: {
    bow: () => bowAt(430, 150, '#ff9ec0', 1.15),
    tiara: () => P('M200 132 L214 62 L250 104 L276 40 L300 96 L324 40 L350 104 L386 62 L400 132 Q300 108 200 132Z', '#ffd447') + C(276, 46, 9, '#ff5c8a') + C(324, 46, 9, '#7fd3ff') + C(300, 104, 11, '#b388ff') + C(214, 66, 7, '#fff') + C(386, 66, 7, '#fff'),
    flowers: () => [[150, 170, '#ff9ec0'], [212, 122, '#fff'], [300, 104, '#ff7a8a'], [388, 122, '#b388ff'], [450, 170, '#ffd447']].map(([x, y, col], i) => flowerAt(x, y, col, i === 2 ? 1.5 : 1.2)).join('') +
      [[180, 142], [256, 108], [344, 108], [420, 142]].map(([x, y]) => P(`M${x} ${y} q14 -18 30 -4 q-14 16 -30 4z`, '#7ed957', 'stroke-width="3"')).join(''),
    clips: () => [[160, 214], [196, 180]].map(([x, y]) => P(starPath(x, y, 24, 11), '#ffd447', 'stroke-width="4"')).join('') + P(heartPath(440, 196, 15), '#ff5c8a', 'stroke-width="4"'),
    ears: () => P('M150 150 Q300 44 450 150', 'none', 'stroke-width="16"') + L('M150 150 Q300 44 450 150', 8, '#ff9ec0') +
      P('M150 142 L136 40 L232 86Z', '#fff') + p('M160 122 L152 62 L208 90Z', '#ffc2d1') + P('M450 142 L464 40 L368 86Z', '#fff') + p('M440 122 L448 62 L392 90Z', '#ffc2d1'),
    band: () => L('M118 250 Q300 60 482 250', 26, INK) + L('M118 250 Q300 60 482 250', 17, '#7fd3ff') + bowAt(404, 140, '#ffd447', 0.7, '#ff9a3c'),
  },
  ear: {
    pearl: (x) => C(x, 420, 13, '#fff'),
    heart: (x) => P(heartPath(x, 424, 15), '#ff5c8a'),
    star: (x) => P(starPath(x, 426, 20, 9), '#ffd447'),
    drop: (x) => L(`M${x} 412 v16`, 4) + P(`M${x} 426 C${x + 16} 450 ${x + 16} 468 ${x} 468 C${x - 16} 468 ${x - 16} 450 ${x} 426Z`, '#7fd3ff'),
    hoop: (x) => `<circle cx="${x}" cy="440" r="24" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="${x}" cy="440" r="24" fill="none" stroke="#ffd447" stroke-width="6"/>`,
    cherry: (x) => L(`M${x} 412 v14`, 4, '#6fae3a') + C(x, 440, 16, '#ff4d5e') + e(x - 5, 434, 3.5, 5.5, '#fff', 'opacity=".6"'),
  },
  neck: {
    pearls: () => Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = 222 + t * 156, y = 590 + 54 * 4 * t * (1 - t) * 0.9; return C(+x.toFixed(1), +y.toFixed(1), 11, '#fff', 'stroke-width="3"'); }).join(''),
    heart: () => L('M226 588 Q300 660 374 588', 4, '#e0a100') + P(heartPath(300, 640, 22), '#ff5c8a'),
    star: () => L('M226 588 Q300 660 374 588', 4, '#9aa7b8') + P(starPath(300, 642, 28, 12), '#ffd447'),
    bow: () => bowAt(300, 612, '#b388ff', 0.75, '#8a5cd0'),
    gems: () => L('M226 588 Q300 660 374 588', 4, '#e0a100') + [[264, 620, '#7fd3ff'], [300, 630, '#ff5c8a'], [336, 620, '#9be29f']].map(([x, y, col]) => P(`M${x} ${y - 14} l12 14 l-12 16 l-12 -16z`, col, 'stroke-width="3.500"')).join(''),
  },
};
const ITEM_VIEW = { lash: '310 268 150 100', gem: '90 350 150 100', hair: '110 20 380 250', ear: '456 394 76 86', neck: '206 570 188 110' };
const draw = (cat, key) => !key ? '' : cat === 'lash' ? `<g transform="translate(0 18)">${ITEMS.lash[key](218, -1) + ITEMS.lash[key](382, 1)}</g>` : cat === 'gem' && key !== 'moon' ? `<g transform="translate(0 26)">${ITEMS.gem[key]()}</g>` : cat === 'ear' ? ITEMS.ear[key](92) + ITEMS.ear[key](508) : ITEMS[cat][key]();

const CATS = [
  { key: 'lip', voice: 'mk-lip', icon: `<svg viewBox="0 0 100 100">${R(34, 54, 32, 40, 6, '#ffd447')}${R(38, 38, 24, 20, 3, '#f1f1f1')}${P('M40 40 V18 Q54 4 60 22 V40Z', '#e8364f')}</svg>` },
  { key: 'blush', voice: 'mk-blush', icon: `<svg viewBox="0 0 100 100">${C(42, 56, 32, '#ffc2d1')}${C(42, 56, 20, '#ff8fa3')}${R(60, 14, 16, 46, 7, '#b88a5e', rot(34, 68, 36))}${E(84, 16, 13, 16, '#ffe2cc', rot(34, 84, 16))}</svg>` },
  { key: 'shadow', voice: 'mk-shadow', icon: `<svg viewBox="0 0 100 100">${R(10, 26, 80, 52, 12, '#5a4a66')}${C(30, 52, 12, '#b388ff')}${C(54, 52, 12, '#80d8ff')}${C(76, 52, 9, '#f48fb1')}</svg>` },
  { key: 'lash', voice: 'mk-lash', icon: `<svg viewBox="0 0 100 100">${L('M16 62 Q50 26 84 62', 7)}${L('M22 50 l-8 -14 M36 40 l-4 -16 M50 36 v-18 M64 40 l4 -16 M78 50 l8 -14', 5)}</svg>` },
  { key: 'gem', voice: 'mk-gem', icon: `<svg viewBox="0 0 100 100">${P(starPath(40, 44, 30, 13), '#ffd447')}${P(heartPath(74, 72, 13), '#ff5c8a')}</svg>` },
  { key: 'hair', voice: 'mk-hair', icon: `<svg viewBox="-90 -60 180 120">${bowAt(0, 0, '#ff9ec0', 1)}</svg>` },
  { key: 'ear', voice: 'mk-ear', icon: `<svg viewBox="0 0 100 100">${L('M30 10 v22 M70 10 v22', 4)}${P('M30 30 C46 54 46 72 30 72 C14 72 14 54 30 30Z', '#7fd3ff')}${P('M70 30 C86 54 86 72 70 72 C54 72 54 54 70 30Z', '#7fd3ff')}</svg>` },
  { key: 'neck', voice: 'mk-neck', icon: `<svg viewBox="0 0 100 100">${L('M14 20 Q50 84 86 20', 4, '#e0a100')}${P(heartPath(50, 66, 17), '#ff5c8a')}</svg>` },
];

function faceMarkup(style, hair, blurId) {
  const z = (cat, i) => { const [cx, cy, rx, ry] = ZONES[cat][i]; return `<ellipse class="guide guide-${cat}" cx="${cx}" cy="${cy}" rx="${rx * 0.8}" ry="${ry * 0.8}" fill="none" stroke="#ff5c8a" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>`; };
  return `<defs><filter id="${blurId}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="13"/></filter></defs>` +
    hairBack(style, hair) + R(262, 520, 76, 110, 30, SKIN) +
    P('M110 730 C110 640 200 604 300 604 C400 604 490 640 490 730Z', '#ff9ec0') + P('M236 608 Q300 664 364 608 Q300 632 236 608Z', '#fff') +
    `<g class="slot" data-slot="neck"></g>` +
    E(96, 380, 28, 38, SKIN) + E(504, 380, 28, 38, SKIN) + e(96, 382, 13, 20, '#ffc9b0') + e(504, 382, 13, 20, '#ffc9b0') +
    P('M300 110 C440 110 508 214 508 350 C508 482 420 568 300 568 C180 568 92 482 92 350 C92 214 160 110 300 110Z', SKIN) +
    e(168, 452, 42, 27, '#ffb3a8', 'opacity=".5"') + e(432, 452, 42, 27, '#ffb3a8', 'opacity=".5"') +
    `<g filter="url(#${blurId})"><ellipse class="paint paint-blush" cx="168" cy="452" rx="56" ry="38" opacity="0"/><ellipse class="paint paint-blush" cx="432" cy="452" rx="56" ry="38" opacity="0"/></g>` +
    `<path class="paint paint-shadow" d="${lid(218, 346)}" opacity="0"/><path class="paint paint-shadow" d="${lid(382, 346)}" opacity="0"/>` +
    eye(218, 364) + eye(382, 364) + `<g class="slot" data-slot="lash"></g>` +
    L('M291 440 q9 8 18 0', 4, '#e3a58c') +
    P(LIPS, '#f4a3a3', 'stroke-width="4"') + `<path class="paint paint-lip" d="${LIPS}" opacity="0"/>` + L('M268 497 Q300 510 332 497', 3.5) + `<ellipse class="lip-shine" cx="290" cy="514" rx="9" ry="4" fill="#fff" opacity="0"/>` +
    `<g class="slot" data-slot="gem"></g>` + hairFront(hair) + `<g class="slot" data-slot="hair"></g><g class="slot" data-slot="ear"></g>` +
    z('lip', 0) + z('blush', 0) + z('blush', 1) + z('shadow', 0) + z('shadow', 1);
}

function vanity(W) {
  const cx = W * 0.5;
  let out = room(W, '#ffe3ee', '#ffd0e2', '#f6cfe0', 700);
  out += R(cx - 330, 60, 660, 700, 120, '#ffd447') + R(cx - 300, 90, 600, 640, 96, '#fdf6ff');
  for (let i = 0; i < 9; i++) { out += C(cx - 330, 140 + i * 68, 15, '#fff6c9') + C(cx + 330, 140 + i * 68, 15, '#fff6c9'); }
  out += `<path d="M${cx - 250} 130 l60 0 l-150 220 l-30 0z" fill="#fff" opacity=".5"/>`;
  return out;
}

export default {
  id: 'makeup', name: '化妆间', colors: ['#ffe0ee', '#ffb3d1'], intro: 'makeup-intro',
  icon: () => `<svg viewBox="0 0 230 200"><g transform="translate(46 6) scale(.27)">${faceMarkup('bob', '#6b4433', 'kpicon').replace(/<ellipse class="guide[^>]*>/g, '')}${bowAt(430, 150, '#ff9ec0', 1.15)}</g>
    <g transform="translate(150 96) rotate(18) scale(.95)">${R(34, 54, 32, 40, 6, '#ffd447')}${R(38, 38, 24, 20, 3, '#f1f1f1')}${P('M40 40 V18 Q54 4 60 22 V40Z', '#e8364f')}</g>
    <path d="${starPath(30, 40, 16, 7)}" fill="#ffd447" stroke="${INK}" stroke-width="3.500" stroke-linejoin="round"/></svg>`,

  start(ctx) {
    const { W } = ctx;
    const first = !ctx.constructor.madeUp; ctx.constructor.madeUp = true;
    const [style, hair] = first ? HAIRS[0] : pick(HAIRS);
    ctx.scene(vanity(W));
    const FW = 520, FH = 632, fx = W * 0.5, fy = 425, k = FW / 600;
    const face = ctx.sprite(`<svg viewBox="0 0 600 730">${faceMarkup(style, hair, nextId())}</svg>`, fx, fy, FW, FH);
    const svg = face.el.firstElementChild;
    const toFace = (pt) => ({ x: (pt.x - (fx - FW / 2)) / k, y: (pt.y - (fy - FH / 2)) / k });
    const state = { cat: 'lip', color: PAL.lip[0], amount: { lip: 0, blush: 0, shadow: 0 }, worn: {}, used: new Set() };
    const paints = (cat) => [...svg.querySelectorAll(`.paint-${cat}`)];
    const guides = (cat) => svg.querySelectorAll('.guide').forEach((g) => { g.style.display = cat && g.classList.contains(`guide-${cat}`) && state.amount[cat] < 0.35 ? '' : 'none'; });

    const brush = ctx.sprite('', 0, 0, 90, 90, 'brush-cursor');
    brush.el.style.display = 'none';

    let options = null;
    function openCat(cat) {
      state.cat = cat.key;
      options?.el.remove();
      ctx.say(cat.voice);
      if (PAL[cat.key]) {
        options = tray(ctx, W - 122, 330, PAL[cat.key].map((col) => ({ key: col, color: col })), (item) => { state.color = item.key; ctx.sfx('tap'); guides(cat.key); }, { width: 196, cls: 'mk-options' });
        state.color = PAL[cat.key].includes(state.color) ? state.color : PAL[cat.key][0];
        options.select(state.color);
        brush.html(cat.icon);
      } else {
        const keys = Object.keys(ITEMS[cat.key]);
        options = tray(ctx, W - 122, 330, keys.map((key) => ({ key, html: `<svg viewBox="${ITEM_VIEW[cat.key]}">${cat.key === 'lash' ? ITEMS.lash[key](374, 1) + L('M338 328 Q374 298 410 328', 6) : cat.key === 'ear' ? ITEMS.ear[key](494).replace(/translate/g, 'translate') : cat.key === 'gem' && (key === 'moon') ? '' : ITEMS[cat.key][key]()}</svg>` })), (item, chip) => {
          const on = state.worn[cat.key] !== item.key;
          state.worn[cat.key] = on ? item.key : null;
          svg.querySelector(`[data-slot="${cat.key}"]`).innerHTML = draw(cat.key, state.worn[cat.key]);
          if (!on) options.clear();
          ctx.sfx(on ? 'sparkle' : 'drop');
          if (on) { state.used.add(cat.key); anim(svg.querySelector(`[data-slot="${cat.key}"]`), 'fade', 300); ctx.burst(fx, fy - 60, { n: 7, spread: 240 }); }
        }, { width: 214, cls: 'mk-options' });
        if (cat.key === 'gem') options.chips.get('moon').innerHTML = `<svg viewBox="262 136 100 80">${ITEMS.gem.moon()}</svg>`;
        if (state.worn[cat.key]) options.select(state.worn[cat.key]);
      }
      guides(PAL[cat.key] ? cat.key : null);
    }
    const cats = tray(ctx, 84, 440, CATS.map((cat) => ({ key: cat.key, html: cat.icon })), (item) => { ctx.sfx('tap'); openCat(CATS.find((x) => x.key === item.key)); }, { width: 104, cls: 'mk-cats' });
    cats.select('lip');
    openCat(CATS[0]);

    let lastFx = 0;
    ctx.rub((pt, ev, first) => {
      const cat = state.cat;
      if (!PAL[cat]) return;
      brush.el.style.display = ''; brush.set(pt.x + 30, pt.y - 34);
      const f = toFace(pt);
      const zone = ZONES[cat].find(([cx, cy, rx, ry]) => ((f.x - cx) / rx) ** 2 + ((f.y - cy) / ry) ** 2 < 1.5);
      if (!zone) return;
      const els = paints(cat);
      if (els[0].getAttribute('fill') !== state.color) { els.forEach((n) => n.setAttribute('fill', state.color)); state.amount[cat] = Math.min(state.amount[cat], 0.3); }
      const before = state.amount[cat];
      state.amount[cat] = Math.min(1, before + (first ? 0.08 : 0.03));
      const strength = cat === 'lip' ? 0.92 : cat === 'blush' ? 0.75 : 0.8;
      els.forEach((n) => n.setAttribute('opacity', (state.amount[cat] * strength).toFixed(2)));
      if (cat === 'lip') svg.querySelector('.lip-shine').setAttribute('opacity', (state.amount.lip * 0.7).toFixed(2));
      guides(cat);
      const now = performance.now();
      if (now - lastFx > 130) { lastFx = now; ctx.sfx('brush'); if (Math.random() < 0.5) ctx.burst(pt.x, pt.y, { n: 1, shapes: ['star'], colors: ['#fff', '#ffe26a', state.color], spread: 50, size: 22, ms: 500 }); }
      if (before < 1 && state.amount[cat] >= 1) { state.used.add(cat); ctx.sfx('sparkle'); ctx.burst(pt.x, pt.y, { n: 10 }); ctx.say(pick(['mk-pretty', 'mk-lovely'])); }
    }, () => { brush.el.style.display = 'none'; });

    ctx.button('eraser', W - 180, 716, 'blue', '擦掉重来', () => {
      ctx.sfx('water');
      for (const cat of Object.keys(PAL)) { state.amount[cat] = 0; paints(cat).forEach((n) => n.setAttribute('opacity', 0)); }
      svg.querySelector('.lip-shine').setAttribute('opacity', 0);
      svg.querySelectorAll('.slot').forEach((g) => { g.innerHTML = ''; });
      state.worn = {}; state.used.clear(); options.clear(); guides(PAL[state.cat] ? state.cat : null);
    });
    ctx.button('camera', W - 72, 716, 'pink', '拍照', async () => {
      if (state.used.size < 1 && !Object.values(state.amount).some((a) => a > 0.3)) { ctx.sfx('bad'); ctx.say('makeup-intro'); return; }
      guides(null);
      ctx.sfx('camera');
      const flash = ctx.add(el('div', { class: 'flash' }));
      await ctx.sleep(450); flash.remove();
      face.anim('pop', 500);
      ctx.burst(fx, fy, { n: 22, spread: 380, size: 44 });
      ctx.win({ voice: 'makeup-done', delay: 900 });
    });
  },
};
