// The girl: Zoey herself, and the doll in the dress-up game. One flat figure in a 400×700 box,
// with hair, outfits, shoes and things to wear or hold. Arms are separate groups so she can wave and cheer.
import { INK, E, C, P, R, e, c, p, L, tube, rot, shade, shadow, star, sparkle, starPath, heartPath, insidePath, nextId } from './base.js';
import { meadow, night, sky, cloud, sun, hills, band, rainbow, pine, gradient } from './scenes.js';

const SKIN = '#ffd6b3', CHEEK = '#ff9e8f';
const both = (fn) => fn(1) + fn(-1);          // fn(side): side 1 = her left hand side of the picture (x < 200)
const mx = (s, x) => 200 - s * (200 - x);     // mirror an x for the other side

const BANGS = 'M76 198 C68 110 130 62 200 62 C270 62 332 110 324 198 C318 168 306 152 292 146 Q276 160 258 150 Q240 162 220 150 Q200 162 180 150 Q160 162 142 150 Q124 160 108 146 C94 152 82 168 76 198Z';
const CAP = 'M200 56 C92 56 58 140 66 230 L334 230 C342 140 308 56 200 56Z';
const HAIR = {
  bob: { col: '#6b4433', back: (h) => P('M200 56 C80 56 54 150 62 250 C64 292 76 318 94 332 L306 332 C324 318 336 292 338 250 C346 150 320 56 200 56Z', h), front: (h) => P(BANGS, h) },
  pigtails: { col: '#3b2f3a', back: (h) => P(CAP, h) + both((s) => E(mx(s, 56), 262, 30, 74, h, rot(s * 10, mx(s, 56), 200))), front: (h) => P(BANGS, h) + both((s) => C(mx(s, 70), 192, 12, '#ff5c8a')) },
  long: { col: '#e8ac5c', back: (h) => P('M200 56 C80 56 48 150 56 262 C60 360 36 440 62 486 Q120 500 140 470 L260 470 Q280 500 338 486 C364 440 340 360 344 262 C352 150 320 56 200 56Z', h), front: (h) => P(BANGS, h) },
  buns: { col: '#ff9ecb', back: (h) => C(92, 66, 44, h) + C(308, 66, 44, h) + P(CAP, h), front: (h) => P(BANGS, h) + both((s) => L(`M${mx(s, 66)} 58 q${s * 22} -14 ${s * 44} 0`, 4, 'rgba(255,255,255,.4)')) },
  curly: { col: '#f08a4b', back: (h) => Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (0.92 + i * 1.16 / 12); return C(+(200 + 124 * Math.cos(a)).toFixed(0), +(190 + 118 * Math.sin(a)).toFixed(0), 40, h); }).join('') + C(74, 262, 36, h) + C(326, 262, 36, h) + e(200, 150, 120, 96, h),
    front: (h) => [100, 140, 180, 220, 260, 300].map((x, i) => C(x, 122 - Math.sin((i + 0.5) / 6 * Math.PI) * 22, 30, h)).join('') + e(200, 96, 100, 30, h) },
  ponytail: { col: '#8a6be0', back: (h) => P('M262 84 C360 30 420 150 372 262 C360 292 330 280 340 252 C356 190 330 130 262 116Z', h) + P(CAP, h) + C(286, 86, 15, '#ffd447'), front: (h) => P(BANGS, h) },
};

const skirt = 'M146 384 Q200 372 254 384 C310 440 344 520 352 596 Q200 640 48 596 C56 520 90 440 146 384Z';
const OUTFIT = {
  zoey: () => P('M146 430 h108 l6 76 h-52 l-8 -34 l-8 34 h-52z', '#ffe7c4') + [[166, 452], [190, 478], [232, 450], [214, 486], [160, 492], [244, 488]].map(([x, y]) => c(x, y, 5, '#7fb6f0')).join('') +
    both((s) => E(mx(s, 142), 318, 24, 18, s > 0 ? '#fff' : '#f1eef5', rot(s * -30, mx(s, 142), 318))) + P('M146 300 Q200 286 254 300 L262 440 Q200 452 138 440Z', '#fff') +
    P('M178 296 Q200 318 222 296 Q200 304 178 296Z', '#e3ecfa') + star(200, 372, 30, '#5fa8f0') + sparkle(232, 344, 9, '#a8d4ff') + sparkle(168, 400, 7, '#a8d4ff'),
  princess: () => both((s) => C(mx(s, 140), 318, 27, '#ffb7d9')) + P(skirt, '#ff9ecb') +
    P('M146 384 Q200 372 254 384 C292 422 312 462 322 504 Q290 526 262 502 Q232 528 200 504 Q168 528 138 502 Q110 526 78 504 C88 462 108 422 146 384Z', '#ffc9e3') +
    P('M148 300 Q200 322 252 300 L258 390 Q200 404 142 390Z', '#ff7fb0') + R(142, 376, 116, 18, 9, '#ffd447') + P(heartPath(200, 346, 12), '#fff', 'stroke-width="3"') +
    [[96, 560], [150, 584], [200, 592], [250, 584], [304, 560]].map(([x, y]) => P(starPath(x, y, 10, 4.5), '#fff', 'stroke-width="2.500"')).join(''),
  snow: () => both((s) => tube(`M${mx(s, 146)} 322 Q${mx(s, 114)} 368 ${mx(s, 108)} 418`, '#c9f2ff', 20)) +
    P('M148 384 Q200 374 252 384 L322 606 Q200 642 78 606Z', '#8fdcf5') + P('M148 384 Q200 374 252 384 L282 480 Q200 520 118 480Z', '#bfefff') +
    P('M148 300 Q176 316 200 304 Q224 316 252 300 L256 390 Q200 402 144 390Z', '#4fc3e0') + L('M144 386 Q200 400 256 386', 5, '#fff') +
    [[130, 560, 12], [200, 590, 14], [270, 560, 12], [166, 520, 8], [236, 524, 8]].map(([x, y, r]) => L(`M${x - r} ${y} h${r * 2} M${x} ${y - r} v${r * 2} M${x - r * 0.7} ${y - r * 0.7} l${r * 1.4} ${r * 1.4} M${x + r * 0.7} ${y - r * 0.7} l${-r * 1.4} ${r * 1.4}`, 3, '#fff')).join(''),
  fairy: () => P('M146 372 Q200 362 254 372 L306 474 L272 454 L254 506 L226 464 L200 518 L174 464 L146 506 L128 454 L94 474Z', '#5fc45a') +
    P('M146 372 Q200 362 254 372 L276 430 L250 420 L232 458 L200 426 L168 458 L150 420 L124 430Z', '#9be27a') +
    P('M150 300 Q200 318 250 300 L256 382 Q200 394 144 382Z', '#7ed957') + L('M160 300 l-6 -14 M240 300 l6 -14', 6, '#5fc45a') +
    `<g transform="translate(200 378)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-13" rx="9" ry="12" fill="#ff9ecb" stroke="${INK}" stroke-width="3" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#ffd447" stroke="${INK}" stroke-width="3"/></g>`,
  tutu: () => P('M150 300 Q200 318 250 300 L258 430 Q200 446 142 430Z', '#ff8fbf') + L('M162 300 l-4 -12 M238 300 l4 -12', 6, '#ff8fbf') +
    E(200, 428, 136, 36, '#cdb4ff') + E(200, 414, 120, 30, '#dfcdff') + E(200, 402, 98, 22, '#f1e8ff') +
    [[110, 430], [160, 446], [240, 446], [290, 430], [200, 452]].map(([x, y]) => P(starPath(x, y, 8, 3.5), '#ffd447', 'stroke-width="2"')).join('') + P(heartPath(200, 348, 11), '#fff', 'stroke-width="3"'),
  rainbow: () => { const d = 'M146 380 Q200 370 254 380 L318 546 Q200 582 82 546Z';
    return P(d, '#ff7a8a') + insidePath(d, ['#ffb347', '#ffe26a', '#8fd764', '#7fd3ff', '#b79cff'].map((col, i) => `<path d="M40 ${428 + i * 30} Q200 ${466 + i * 30} 360 ${428 + i * 30} V700 H40Z" fill="${col}"/>`).join('')) + P(d, 'none') +
      P('M148 300 Q200 318 252 300 L256 388 Q200 400 144 388Z', '#fff') + both((s) => E(mx(s, 142), 316, 20, 15, '#fff', rot(s * -30, mx(s, 142), 316))) + P(heartPath(200, 348, 15), '#ff7a8a', 'stroke-width="3"'); },
  raincoat: () => both((s) => tube(`M${mx(s, 146)} 322 Q${mx(s, 114)} 368 ${mx(s, 108)} 414`, '#ffd84d', 22)) +
    P('M140 296 Q200 284 260 296 L296 506 Q200 528 104 506Z', '#ffd84d') + L('M200 300 V520', 4) + [340, 396, 452].map((y) => C(214, y, 8, '#ff9a3c', 'stroke-width="3"')).join('') +
    R(126, 430, 46, 44, 10, '#ffc93c') + R(228, 430, 46, 44, 10, '#ffc93c') + P('M160 296 Q200 330 240 296 Q200 306 160 296Z', '#ffc93c'),
  pajama: () => { const star = (x, y) => p(starPath(x, y, 7, 3.2), '#ffe26a');
    return R(154, 430, 44, 196, 16, '#8fb8ff') + R(202, 430, 44, 196, 16, '#8fb8ff') + both((s) => E(mx(s, 140), 320, 22, 17, '#8fb8ff', rot(s * -30, mx(s, 140), 320))) +
      P('M146 300 Q200 316 254 300 L264 452 Q200 468 136 452Z', '#a9c8ff') + P('M176 302 Q200 330 224 302 Q200 312 176 302Z', '#fff') +
      [[166, 350], [226, 370], [190, 410], [240, 428], [158, 430], [176, 500], [224, 520], [172, 580], [226, 590]].map(([x, y]) => star(x, y)).join('') + c(200, 350, 5, '#fff') + c(200, 390, 5, '#fff'); },
  mermaid: () => { const tail = 'M146 392 Q200 380 254 392 C262 470 240 548 216 596 Q256 612 290 664 Q234 674 200 636 Q166 674 110 664 Q144 612 184 596 C160 548 138 470 146 392Z';
    return P('M146 300 Q200 286 254 300 L258 400 Q200 412 142 400Z', SKIN) + P(tail, '#3fc8b8') +
      insidePath(tail, L('M150 430 q16 16 32 0 q16 16 32 0 q16 16 32 0 q16 16 32 0 M134 466 q16 16 32 0 q16 16 32 0 q16 16 32 0 q16 16 32 0 M150 502 q16 16 32 0 q16 16 32 0 q16 16 32 0 M166 538 q16 16 32 0 q16 16 32 0', 3.5, '#2aa598') + p('M100 600 h200 v80 h-200z', '#8fe8dc')) + P(tail, 'none') +
      R(142, 384, 116, 16, 8, '#ffd447') + both((s) => P(`M${mx(s, 176)} 356 q${-s * 34} -6 ${-s * 30} -40 q${s * 34} -4 ${s * 44} 16 q${s * 4} 16 ${-s * 14} 24z`, '#b79cff') + L(`M${mx(s, 176)} 354 l${-s * 18} -30 M${mx(s, 176)} 354 l${-s * 4} -32`, 2.5, '#8a6be0')); },
};
const HIDE_LEGS = ['mermaid', 'pajama'];

const shoeAt = (x, s, kind) => ({
  mary: () => R(x - 13, 606, 26, 30, 6, '#fff') + P(`M${x - 26} 652 q0 -24 26 -24 q${s * -8} 0 26 24 q0 8 -8 8 h-36 q-8 0 -8 -8z`, '#e8364f') + L(`M${x - 16} 638 h32`, 5, '#b3243b') + c(x, 638, 4, '#ffd447'),
  boots: () => P(`M${x - 20} 578 h40 v60 q${-s * -14} 2 ${-s * -18} 14 q0 8 -8 8 h-46 q-8 0 -8 -8 z`.replace(/--/g, ''), '#ff5d5d') + R(x - 22, 572, 44, 16, 7, '#fff'),
  sneakers: () => R(x - 13, 612, 26, 24, 6, '#fff') + P(`M${x - 28} 654 q0 -26 28 -26 q28 0 28 26 q0 6 -6 6 h-44 q-6 0 -6 -6z`, '#fff') + L(`M${x - 26} 652 h52`, 6, '#4fb0f0') + L(`M${x - 8} 636 h16 M${x - 8} 644 h16`, 3, '#ff7fb0'),
  glass: () => P(`M${x - 26} 652 q0 -22 26 -22 q26 0 26 22 q0 8 -8 8 h-36 q-8 0 -8 -8z`, '#bfefff') + e(x - 8, 642, 7, 4, '#fff') + P(starPath(x, 632, 9, 4), '#fff', 'stroke-width="2.500"'),
  ballet: () => L(`M${x - 13} 600 l26 14 M${x + 13} 600 l-26 14 M${x - 13} 616 l26 12 M${x + 13} 616 l-26 12`, 4, '#ff9ecb') + P(`M${x - 24} 652 q0 -20 24 -20 q24 0 24 20 q0 8 -8 8 h-32 q-8 0 -8 -8z`, '#ff9ecb') + c(x, 636, 5, '#ff5c8a'),
}[kind]());
const SHOES = ['mary', 'boots', 'sneakers', 'glass', 'ballet'];

const flowerAt = (x, y, col, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-13" rx="9" ry="12" fill="${col}" stroke="${INK}" stroke-width="3" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#ffd447" stroke="${INK}" stroke-width="3"/></g>`;
const bow = (x, y, col, s = 1, dark = '#ff5c8a') => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0 0 C-30 -46 -84 -44 -78 0 C-84 44 -30 46 0 0Z', col)}${P('M0 0 C30 -46 84 -44 78 0 C84 44 30 46 0 0Z', col)}${R(-17, -20, 34, 40, 12, dark)}</g>`;
const HEAD = {
  crown: () => P('M132 92 L142 30 L174 66 L200 14 L226 66 L258 30 L268 92 Q200 74 132 92Z', '#ffd447') + C(200, 24, 8, '#ff5c8a') + C(142, 36, 6, '#7fd3ff') + C(258, 36, 6, '#7fd3ff') + C(200, 72, 8, '#b79cff'),
  bow: () => bow(276, 86, '#ff9ecb', 0.82),
  wreath: () => [[104, 122, '#ff9ecb'], [146, 86, '#fff'], [200, 72, '#ff7a8a'], [254, 86, '#b79cff'], [296, 122, '#ffd447']].map(([x, y, col], i) => flowerAt(x, y, col, i === 2 ? 1.25 : 1)).join(''),
  bunny: () => both((s) => E(mx(s, 150), 26, 24, 62, '#fff', rot(s * -10, mx(s, 150), 80)) + e(mx(s, 150), 30, 11, 44, '#ffc2d1', rot(s * -10, mx(s, 150), 80))) + L('M108 110 Q200 40 292 110', 14, INK) + L('M108 110 Q200 40 292 110', 6, '#ff9ecb'),
  party: () => { const d = 'M146 96 L212 -34 L262 80Z'; return P(d, '#7fd3ff') + insidePath(d, L('M150 60 l120 -30 M150 30 l120 -30 M150 90 l120 -30', 12, '#ffe26a')) + P(d, 'none') + C(212, -34, 14, '#ff7a8a') + L('M144 98 Q204 70 264 82', 9, '#ff7a8a'); },
  stars: () => L('M96 132 Q200 36 304 132', 14, INK) + L('M96 132 Q200 36 304 132', 6, '#ffd447') + P(starPath(200, 70, 28, 12), '#ffd447') + P(starPath(140, 92, 16, 7), '#fff') + P(starPath(260, 92, 16, 7), '#fff'),
};
const HAND = {
  wand: () => L('M298 446 L344 320', 13, INK) + L('M298 446 L344 320', 5, '#ffb7d9') + P(starPath(350, 300, 34, 15), '#ffd447') + L('M384 268 l10 -10 M392 300 h14 M370 262 v-14', 3.5, '#ffd447'),
  balloon: () => L('M296 436 Q330 340 344 250', 3, INK) + E(348, 180, 50, 62, '#ff7a8a') + P('M340 240 h16 l-8 14z', '#ff7a8a') + e(330, 158, 9, 16, '#fff', `opacity=".6" ${rot(24, 330, 158)}`),
  bouquet: () => P('M286 440 l18 70 l22 -8 l-10 -70z', '#fff3c9') + flowerAt(290, 404, '#ff9ecb', 1.1) + flowerAt(326, 396, '#b79cff', 1.1) + flowerAt(308, 374, '#ff7a8a', 1.2) + L('M290 470 l30 -8', 5, '#ff5c8a'),
  teddy: () => both(() => '') + C(292, 412, 12, '#bb7b4c') + C(336, 412, 12, '#bb7b4c') + E(314, 480, 30, 34, '#bb7b4c') + e(314, 486, 16, 18, '#f3d6ae') + E(314, 432, 32, 28, '#bb7b4c') + e(314, 442, 12, 9, '#f3d6ae') + c(302, 428, 3.5, INK) + c(326, 428, 3.5, INK) + e(314, 438, 4, 3, INK),
  umbrella: () => L('M298 450 V200', 12, INK) + L('M298 450 V200', 5, '#b88a5e') + P('M186 214 C196 120 400 120 410 214 Q382 196 354 214 Q326 196 298 214 Q270 196 242 214 Q214 196 186 214Z', '#b79cff') + C(298, 132, 7, '#ffd447'),
  lollipop: () => L('M298 450 L326 356', 12, INK) + L('M298 450 L326 356', 5, '#fff') + C(332, 330, 36, '#ff9ecb') + L('M332 330 m0 -5 a5 5 0 0 1 0 10 a12 12 0 0 1 0 -24 a20 20 0 0 1 0 40', 5, '#fff'),
};
const BACK = {
  fairy: () => both((s) => `<g opacity=".88">${E(mx(s, 86), 300, 70, 96, '#c9f2ff', rot(s * 24, mx(s, 86), 300))}${E(mx(s, 104), 440, 46, 62, '#e3d0ff', rot(s * -24, mx(s, 104), 440))}</g>`),
  butterfly: () => both((s) => E(mx(s, 78), 296, 78, 100, '#ff9ecb', rot(s * 20, mx(s, 78), 296)) + e(mx(s, 74), 290, 46, 64, '#ffd447', rot(s * 20, mx(s, 74), 290)) + c(mx(s, 70), 270, 16, '#7fd3ff') +
    E(mx(s, 100), 446, 52, 62, '#b79cff', rot(s * -24, mx(s, 100), 446)) + c(mx(s, 96), 450, 18, '#fff')),
  cape: () => P('M140 300 Q200 284 260 300 C320 420 340 520 330 600 Q200 560 70 600 C60 520 80 420 140 300Z', '#ff5d5d') + L('M120 420 q-10 80 -14 150 M280 420 q10 80 14 150', 4, '#d63c4a'),
  angel: () => both((s) => P(`M${mx(s, 150)} 330 C${mx(s, 60)} 230 ${mx(s, -10)} 280 ${mx(s, 16)} 356 C${mx(s, -8)} 380 ${mx(s, 20)} 420 ${mx(s, 44)} 410 C${mx(s, 40)} 446 ${mx(s, 84)} 460 ${mx(s, 100)} 436 C${mx(s, 110)} 460 ${mx(s, 150)} 440 ${mx(s, 150)} 400Z`, '#fff') +
    L(`M${mx(s, 40)} 340 q${s * 30} 20 ${s * 70} 14 M${mx(s, 60)} 390 q${s * 30} 14 ${s * 60} 8`, 3, '#d9e6f2')),
};

const palm = (x, y) => `<g transform="translate(${x} ${y})">${tube('M0 0 q-20 -120 14 -240', '#c98a5c', 22)}${[[-110, -10], [-70, -70], [70, -70], [110, -10], [0, -90]].map(([dx, dy]) => P(`M14 -240 Q${14 + dx / 2} ${-260 + dy} ${14 + dx} ${-200 + dy} Q${14 + dx / 2} ${-220 + dy / 2} 14 -240Z`, '#5fc45a')).join('')}${C(4, -232, 13, '#a8744a')}${C(26, -226, 13, '#a8744a')}</g>`;
const castle = (x, y) => `<g transform="translate(${x} ${y})">${R(-150, -200, 300, 200, 8, '#ffd9ec')}${R(-200, -280, 80, 280, 8, '#ffc4e0')}${R(120, -280, 80, 280, 8, '#ffc4e0')}${R(-50, -330, 100, 330, 8, '#ffe9f4')}` +
  `${P('M-210 -280 L-160 -370 L-110 -280Z', '#b79cff')}${P('M110 -280 L160 -370 L210 -280Z', '#b79cff')}${P('M-62 -330 L0 -440 L62 -330Z', '#ff7fb0')}${P('M-36 0 v-70 a36 36 0 0 1 72 0 v70z', '#b88a5e')}` +
  `${R(-176, -230, 32, 46, 16, '#7fd3ff')}${R(144, -230, 32, 46, 16, '#7fd3ff')}${R(-18, -270, 36, 50, 18, '#7fd3ff')}${L('M0 -440 v-36', 4)}${P('M0 -476 l34 12 l-34 12z', '#ffd447')}</g>`;
const SCENES = {
  castle: (W) => meadow(W, 600, { trees: false }) + castle(W * 0.72, 600) + rainbow(W * 0.3, 600, 300),
  beach: (W) => sky(W, '#8fd6ff', '#e9f9ff', 430) + sun(W - 160, 120, 56) + cloud(W * 0.3, 110, 1) + cloud(W * 0.62, 190, 0.8) + band(W, 420, '#4fc3e8', 230) + hills(W, 440, '#7fd9f5', 8, 160) + hills(W, 600, '#ffe9a8', 22, 700) + band(W, 640, '#ffe09a') + palm(W * 0.84, 640) +
    [[0.12, 700, '#ff9ecb'], [0.6, 720, '#fff']].map(([fx, y, col]) => P(starPath(W * fx, y, 22, 10), col, 'stroke-width="4"')).join(''),
  snow: (W) => sky(W, '#a9d8ff', '#f1f9ff', 560) + hills(W, 520, '#e3f1ff', 60, 700, 100) + pine(W * 0.1, 590, 1, '#5fb38f') + pine(W * 0.86, 580, 1.2, '#5fb38f') + pine(W * 0.7, 570, 0.7, '#7cc7a6') + hills(W, 590, '#fff', 20, 800) + band(W, 640, '#fff') +
    Array.from({ length: 34 }, (_, i) => `<circle class="twinkle" style="animation-delay:${-(i % 6) * 0.4}s" cx="${-200 + ((i * 163) % (W + 400))}" cy="${(i * 97) % 600}" r="${4 + (i % 3) * 2}" fill="#fff"/>`).join(''),
  night: (W) => night(W, 620),
  rainbow: (W) => gradient(W, [[0, '#ffd9ec'], [0.5, '#e3d9ff'], [1, '#bfe8ff']], -200, 800) + band(W, -1400, '#ffd9ec', 1202) + rainbow(W / 2, 640, Math.min(520, W * 0.42)) + cloud(W / 2 - Math.min(520, W * 0.42) + 30, 640, 2.2) + cloud(W / 2 + Math.min(520, W * 0.42) - 60, 640, 2.2) +
    cloud(W * 0.2, 160, 1.2) + cloud(W * 0.8, 120, 1) + band(W, 690, '#fff') + cloud(W * 0.5, 720, 3) + cloud(W * 0.1, 730, 2.6) + cloud(W * 0.9, 730, 2.6),
};


const eyes = () => both((s) => `<g class="eye eyes-open"><ellipse cx="${mx(s, 156)}" cy="204" rx="12" ry="14" fill="${INK}"/><circle cx="${mx(s, 156) - 4}" cy="198" r="4.500" fill="#fff"/></g>`) +
  `<g class="eyes-joy">${L('M142 196 l22 9 l-22 9 M258 196 l-22 9 l22 9', 6)}</g>`;
const mouth = () => { const id = nextId(), d = 'M176 232 h48 a24 26 0 0 1 -48 0z';
  return `<g class="mouth-open"><clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${INK}"/><ellipse clip-path="url(#${id})" cx="200" cy="258" rx="16" ry="11" fill="#ff7f9c"/></g>`; };

/** The whole girl for a look: { hair, outfit, shoes, head, hand, back }. */
export function doll(look) {
  const hair = HAIR[look.hair], legs = !HIDE_LEGS.includes(look.outfit), arm2 = shade(SKIN, -0.06);
  const arm = (s) => tube(`M${mx(s, 148)} 322 Q${mx(s, 114)} 370 ${mx(s, 106)} 428`, s > 0 ? SKIN : arm2, 16) + C(mx(s, 106), 436, 15, s > 0 ? SKIN : arm2);
  return (look.back ? `<g class="a-wings">${BACK[look.back]()}</g>` : '') + hair.back(hair.col) +
    (legs ? R(162, 440, 32, 204, 16, SKIN) + R(206, 440, 32, 204, 16, arm2) + (look.shoes ? shoeAt(176, 1, look.shoes) + shoeAt(224, -1, look.shoes) : E(172, 646, 26, 14, SKIN) + E(228, 646, 26, 14, arm2))
      : look.outfit === 'pajama' ? E(172, 642, 26, 14, '#fff') + E(228, 642, 26, 14, '#f1eef5') : '') +
    `<g class="a-arm a-arm-l">${arm(1)}</g><g class="a-arm a-arm-r">${arm(-1)}${look.hand ? HAND[look.hand]() : ''}</g>` +
    R(184, 268, 32, 44, 12, shade(SKIN, -0.1)) + P('M146 300 Q200 286 254 300 L262 456 Q200 470 138 456Z', '#fff') +
    (look.outfit ? OUTFIT[look.outfit]() : '') +
    `<g class="a-head">` + both((s) => E(mx(s, 82), 198, 18, 24, SKIN) + e(mx(s, 82), 198, 8, 12, CHEEK, 'opacity=".5"')) + E(200, 180, 122, 112, SKIN) +
    both((s) => c(mx(s, 124), 234, 19, CHEEK, 'opacity=".8"')) + e(200, 222, 6, 4.500, shade(SKIN, -0.14)) + eyes() + mouth() +
    hair.front(hair.col) + L('M118 132 Q136 96 172 84', 9, 'rgba(255,255,255,.25)') + (look.head ? HEAD[look.head]() : '') + `</g>`;
}

export const ZOEY_LOOK = { hair: 'bob', outfit: 'zoey', shoes: null, head: null, hand: null, back: null };
/** Zoey as a standalone picture. Poses come from a data-pose attribute on a parent (see the CSS). */
export const zoeySvg = (look = ZOEY_LOOK) => `<svg class="art girl" viewBox="-70 -30 540 720" xmlns="http://www.w3.org/2000/svg">${e(200, 668, 130, 16, 'rgba(31,26,58,.12)')}<g class="girl-body">${doll(look)}</g></svg>`;

export { HAIR, OUTFIT, SHOES, HEAD, HAND, BACK, SCENES, SKIN, shoeAt };
