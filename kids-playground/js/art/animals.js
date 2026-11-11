// The animal friends: chibi bodies with big heads, each with its tell-tale features pushed up front.
// Flat shapes, no outlines; heads tilt, tails wag and arms can cheer (see the a-* classes in the CSS).
import { INK, E, C, P, e, c, p, L, tube, rot, inside, insidePath, face, shade, shadow, delay, starPath, heartPath, wrap } from './base.js';

const mirror = (s) => `<g transform="translate(200 0) scale(-1 1)">${s}</g>`;
const both = (s) => s + mirror(s);
const part = (cls, inner) => (inner ? `<g class="${cls}" ${delay()}>${inner}</g>` : '');

/** The shared chibi body. Parts are layered back to front. */
function critter(o) {
  const {
    c: main, c2 = shade(main, 0.6), hx = 100, hy = 80, hrx = 60, hry = 52,
    tail = '', back = '', ears = '', collar = '', body = '', head = '', front = '', neck = '', f = {}, dy = 8, belly = true, arms = true,
  } = o;
  const limb = o.limb || shade(main, -0.09), foot = o.foot || (o.limb ? o.limb : shade(main, -0.17));
  return part('a-tail', tail) + back +
    E(76, 188, 19, 11, foot) + E(124, 188, 19, 11, foot) +
    E(100, 150, 41, 38, main) + (belly ? e(100, 158, 25, 25, c2) : '') + body +
    inside(100, 150, 41, 38, shadow(hx, hy + 12, hrx * 0.84, hry * 0.9, 0.11)) +
    (arms ? `<g class="a-arm a-arm-l">${E(62, 146, 11, 19, limb, rot(18, 62, 146))}</g><g class="a-arm a-arm-r">${E(138, 146, 11, 19, limb, rot(-18, 138, 146))}</g>` : '') +
    collar + part('a-head', ears + E(hx, hy, hrx, hry, main) + head + face(hx, hy + dy, f) + front) + neck;
}

const nose = (x, y, rx = 6, ry = 4.5, fill = INK) => e(x, y, rx, ry, fill);
const whiskers = L('M50 97 l-17 -4 M50 104 l-17 3 M150 97 l17 -4 M150 104 l17 3', 2.5, 'rgba(56,51,77,.55)');

const A = {};

A.rabbit = () => critter({
  c: '#ffffff', c2: '#ffdce8', limb: '#ece8f2', foot: '#ded9e8',
  tail: C(143, 172, 13, '#ece8f2'),
  ears: E(72, 18, 16, 38, '#ffffff', rot(-9, 72, 40)) + e(72, 21, 8, 27, '#ff9fba', rot(-9, 72, 40)) +
    E(128, 18, 16, 38, '#ffffff', rot(11, 128, 40)) + e(128, 21, 8, 27, '#ff9fba', rot(11, 128, 40)),
  head: nose(100, 97, 5, 3.6, '#ff6f91'),
  f: { mouth: 'w', my: 14, teeth: true },
});

A.cat = () => critter({
  c: '#ffb14a', c2: '#ffe9c4',
  tail: tube('M136 172 q36 4 32 -30 q-2 -14 -15 -9', '#f09a2c', 11),
  ears: both(P('M48 58 L44 6 L94 32 Z', '#ffb14a') + p('M56 46 L53 20 L78 35 Z', '#ff9fba')),
  head: L('M100 31 v13 M84 34 l3 11 M116 34 l-3 11', 6, '#e8912d') + nose(100, 97, 5, 3.6, '#ff6f91') + whiskers,
  body: L('M64 132 l10 3 M62 146 l10 1 M136 132 l-10 3 M138 146 l-10 1', 5, '#e8912d'),
  f: { mouth: 'w', my: 14 },
});

A.dog = () => critter({
  c: '#f8d9a8', c2: '#fff5e3',
  tail: tube('M138 168 q24 -6 22 -30', '#e9c38a', 10),
  collar: P('M66 122 Q100 146 134 122 L132 136 Q100 158 68 136Z', '#ff5470'),
  neck: C(100, 148, 8, '#ffd23f'),
  head: inside(100, 80, 60, 52, e(128, 86, 21, 24, '#d99a5b')) + e(100, 105, 25, 18, '#fff5e3') +
    both(E(42, 78, 18, 37, '#9c5a30', rot(12, 42, 50))) + nose(100, 96, 9, 6.5),
  f: { mouth: 'open', my: 14 },
});

A.bear = () => critter({
  c: '#b9743f', c2: '#f1cf9f',
  ears: both(C(52, 36, 21, '#b9743f') + c(52, 37, 11, '#f1cf9f')),
  head: e(100, 103, 23, 17, '#f1cf9f') + nose(100, 95, 8.5, 6),
  f: { my: 15 },
});

A.panda = () => critter({
  c: '#ffffff', limb: '#3f3a52', belly: false,
  ears: both(C(50, 36, 21, '#3f3a52')),
  head: both(e(73, 88, 17, 20, '#3f3a52', rot(20, 73, 88))) + nose(100, 99, 6, 4.2),
  f: { ring: '#fff', my: 17, r: 7, bx: 6 },
});

A.fox = () => {
  const tail = 'M130 182 Q196 186 186 122 Q180 108 168 118 Q170 150 128 158Z';
  return critter({
    c: '#ff8431', c2: '#fff3e6', limb: '#7a3f25',
    tail: P(tail, '#f07220') + insidePath(tail, e(180, 122, 22, 20, '#fff3e6')),
    ears: both(P('M44 62 L36 0 L94 34 Z', '#ff8431') + p('M52 46 L47 18 L76 36 Z', '#7a3f25')),
    head: inside(100, 80, 60, 52, p('M30 92 Q72 80 100 110 Q128 80 170 92 L170 140 L30 140Z', '#fff3e6')) + nose(100, 104, 7, 5),
    f: { my: 21 }, dy: 4,
  });
};

A.lion = () => {
  let mane = '';
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    mane += C(+(100 + 57 * Math.cos(a)).toFixed(1), +(80 + 53 * Math.sin(a)).toFixed(1), 23, i % 2 ? '#e8782a' : '#f08a3c');
  }
  return critter({
    c: '#ffc94d', c2: '#ffeebd', hrx: 48, hry: 44,
    tail: tube('M138 172 q28 -2 30 -30', '#f0b53c', 7) + C(169, 136, 12, '#e8782a'),
    ears: mane + e(100, 80, 58, 54, '#e8782a') + both(C(62, 44, 13, '#ffc94d') + c(62, 45, 6, '#ffe6a8')),
    head: e(100, 101, 19, 14, '#ffeebd') + nose(100, 94, 8, 5.5, '#8a4b2d'),
    f: { gap: 22, my: 15, r: 7.5 },
  });
};

A.tiger = () => critter({
  c: '#ff9a33', c2: '#fff3e0',
  tail: tube('M138 172 q30 0 30 -32', '#f08a22', 9) + L('M160 166 l8 -6 M164 152 l9 -3', 5, '#3f3a52'),
  ears: both(C(54, 36, 19, '#ff9a33') + c(54, 37, 9, '#fff3e0')),
  head: inside(100, 80, 60, 52, p('M100 26 l-7 20 h14z M38 66 l22 5 l-22 7z M38 88 l18 4 l-18 6z M162 66 l-22 5 l22 7z M162 88 l-18 4 l18 6z M76 28 l6 14 l6 -16z M124 28 l-6 14 l-6 -16z', '#3f3a52')) +
    e(100, 103, 22, 16, '#fff3e0') + nose(100, 96, 7, 5, '#f0607f'),
  body: inside(100, 150, 41, 38, p('M56 136 l16 4 l-16 6z M58 156 l14 3 l-14 5z M144 136 l-16 4 l16 6z M142 156 l-14 3 l14 5z', '#3f3a52')),
  f: { mouth: 'w', my: 15 },
});

A.elephant = () => critter({
  c: '#9cc3f0', c2: '#cfe2fa', hrx: 52, hry: 50,
  tail: tube('M138 172 q20 0 22 -16', '#86b1e2', 5),
  ears: both(E(36, 82, 35, 45, '#86b1e2') + e(38, 84, 22, 31, '#ffb5cf')),
  front: both(P('M84 102 q-6 14 -16 12 q10 -2 8 -14z', '#fff')) +
    tube('M100 94 q2 30 -4 44 q-8 18 -26 6', '#86b1e2', 15) + L('M90 116 h14 M88 128 h13', 2.5, '#6f9bd0'),
  f: { gap: 29, mouth: 'none', dy: 2 },
});

A.giraffe = () => {
  const y = '#ffd257', y2 = '#f5c13c', spot = '#d98b3a', hoof = '#a8662f';
  return part('a-tail', tube('M132 176 q20 0 22 -20', y2, 4) + C(155, 152, 8, hoof)) +
    E(80, 190, 16, 10, hoof) + E(120, 190, 16, 10, hoof) +
    E(100, 160, 37, 33, y) + P('M84 152 L87 66 h26 L116 152Z', y) +
    e(97, 96, 6, 7, spot) + e(106, 116, 5, 6, spot) + e(94, 134, 6, 6, spot) +
    e(76, 158, 8, 9, spot) + e(122, 152, 7, 8, spot) + e(108, 176, 9, 6, spot) + e(86, 178, 5, 4, spot) +
    `<g class="a-arm a-arm-l">${E(63, 150, 10, 17, y2, rot(18, 63, 150))}</g><g class="a-arm a-arm-r">${E(137, 150, 10, 17, y2, rot(-18, 137, 150))}</g>` +
    part('a-head', both(E(54, 44, 16, 9, y2, rot(-22, 54, 44))) +
      both(tube('M86 22 v-13', y2, 3) + C(86, 6, 7, hoof)) +
      E(100, 50, 40, 33, y) + e(100, 66, 25, 14, '#fff0c2') + c(93, 63, 2.2, hoof) + c(107, 63, 2.2, hoof) +
      e(76, 30, 6, 5, spot) + e(126, 32, 5, 4, spot) +
      face(100, 46, { gap: 20, r: 7, my: 25, by: 9 }));
};

A.monkey = () => critter({
  c: '#a5673a', c2: '#f7d3a8',
  tail: tube('M138 172 q32 0 32 -32 q0 -24 -19 -19 q-10 4 -3 14', '#8f5630', 6),
  ears: both(C(40, 84, 21, '#a5673a') + c(40, 84, 12, '#f7d3a8')),
  head: c(77, 84, 25, '#f7d3a8') + c(123, 84, 25, '#f7d3a8') + e(100, 104, 33, 22, '#f7d3a8') + c(96, 101, 1.8, INK) + c(104, 101, 1.8, INK),
  f: { gap: 24, mouth: 'big', my: 19 },
});

A.pig = () => critter({
  c: '#ffb3c8', c2: '#ffd9e4',
  tail: L('M138 168 q18 -4 16 -16 q-2 -10 -11 -6 q-7 4 2 11', 6, '#ff8fae'),
  ears: both(P('M48 56 L42 12 L90 32 Z', '#ff8fae')),
  head: E(100, 100, 23, 17, '#ff8fae') + e(93, 100, 3.6, 5.5, '#d94f7c') + e(107, 100, 3.6, 5.5, '#d94f7c'),
  f: { mouth: 'smile', my: 34, by: 16 }, dy: -2,
});

A.cow = () => critter({
  c: '#ffffff', c2: '#ffe0ea', limb: '#ece8f2', foot: '#5b5670',
  tail: tube('M138 172 q22 0 24 -22', '#ece8f2', 3) + C(162, 146, 9, '#3f3a52'),
  ears: both(P('M64 38 q-16 -6 -14 -28 q12 4 22 16z', '#f5dca0') + E(38, 62, 20, 12, '#ffffff', rot(-22, 38, 62)) + e(38, 62, 12, 6, '#ffb5cf', rot(-22, 38, 62))),
  collar: L('M72 124 Q100 146 128 124', 8, '#ff5470'),
  body: inside(100, 150, 41, 38, e(132, 138, 18, 15, '#3f3a52') + e(70, 172, 14, 11, '#3f3a52')),
  head: inside(100, 80, 60, 52, e(62, 58, 30, 30, '#3f3a52')) + E(100, 107, 32, 20, '#ffb5cf') +
    e(89, 104, 4, 5.5, '#e0708f') + e(111, 104, 4, 5.5, '#e0708f') + L('M92 115 q8 6 16 0', 3),
  neck: C(100, 141, 9, '#ffd23f') + c(100, 144, 2.5, INK),
  f: { mouth: 'none', ring: '#fff', by: 9 }, dy: -2,
});

A.sheep = () => {
  const wool = '#ffffff', wool2 = '#ece8f2', skin = '#f8d6bd';
  let fluff = '';
  for (let i = 0; i < 9; i++) {
    const a = i * Math.PI * 2 / 9;
    fluff += C(+(100 + 32 * Math.cos(a)).toFixed(1), +(152 + 28 * Math.sin(a)).toFixed(1), 18, i % 2 ? wool : wool2);
  }
  let top = '';
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI + i * Math.PI / 6;
    top += C(+(100 + 46 * Math.cos(a)).toFixed(1), +(74 + 42 * Math.sin(a)).toFixed(1), 20, i % 2 ? wool2 : wool);
  }
  return E(78, 190, 15, 10, '#5b5670') + E(122, 190, 15, 10, '#5b5670') + fluff + e(100, 152, 36, 32, wool) +
    L('M88 150 q6 6 12 0 M104 164 q6 6 12 0', 2.5, '#d9d3e3') +
    part('a-head', top + e(100, 70, 50, 40, wool) +
      both(E(44, 88, 18, 10, skin, rot(24, 44, 88)) + e(44, 88, 10, 5, '#ffb5cf', rot(24, 44, 88))) +
      E(100, 88, 44, 40, skin) +
      C(82, 52, 16, wool2) + C(118, 52, 16, wool2) + C(100, 46, 18, wool) + e(100, 56, 28, 10, wool) +
      nose(100, 104, 5, 3.5, '#e0708f') + face(100, 92, { gap: 22, my: 17, r: 7.5 }));
};

A.koala = () => critter({
  c: '#aab4c8', c2: '#e9edf5',
  ears: both(C(42, 46, 29, '#97a2b8') + c(42, 47, 17, '#f4f1f7')),
  head: E(100, 98, 12, 16, '#3f3a52') + e(96, 91, 3.5, 4.5, '#7d7896') + L('M93 119 q7 5 14 0', 3),
  f: { gap: 31, mouth: 'none' }, dy: 4,
});

A.penguin = () => {
  const navy = '#3f5a99', dark = '#34497f';
  const body = 'M100 14 C150 14 166 62 166 112 C166 162 140 192 100 192 C60 192 34 162 34 112 C34 62 50 14 100 14Z';
  return part('a-bob', E(78, 193, 18, 9, '#ff9f1c') + E(122, 193, 18, 9, '#ff9f1c') +
    `<g class="a-arm a-arm-l">${E(32, 124, 12, 32, dark, rot(14, 32, 124))}</g><g class="a-arm a-arm-r">${E(168, 124, 12, 32, dark, rot(-14, 168, 124))}</g>` + P(body, navy) +
    insidePath(body, p('M100 62 C84 36 46 44 46 82 C46 102 54 106 58 118 C50 152 70 186 100 186 C130 186 150 152 142 118 C146 106 154 102 154 82 C154 44 116 36 100 62Z', '#ffffff')) +
    P('M88 97 h24 l-12 14z', '#ff9f1c') + face(100, 86, { gap: 26, mouth: 'none', by: 12 }) +
    P('M58 130 Q100 150 142 130 L140 144 Q100 164 60 144Z', '#ff5470') + P('M118 148 l10 26 l13 -4 l-8 -26z', '#e83e5c'));
};

A.chick = () => critter({
  c: '#ffe04d', c2: '#fff2a8', foot: '#ff9f1c', arms: false,
  ears: P('M100 32 q-14 -16 -4 -28 q4 8 7 12 q3 -12 13 -12 q-2 16 -8 28z', '#ffc93c'),
  body: `<g class="a-arm a-arm-l">${E(60, 148, 13, 21, '#ffc93c', rot(22, 60, 148))}</g><g class="a-arm a-arm-r">${E(140, 148, 13, 21, '#ffc93c', rot(-22, 140, 148))}</g>`,
  head: P('M88 96 h24 l-12 13z', '#ff9f1c'),
  f: { mouth: 'none', gap: 28 }, dy: 6,
});

A.frog = () => {
  const g = '#7ed957', g2 = '#63c244';
  return part('a-bob', E(70, 188, 24, 11, g2) + E(130, 188, 24, 11, g2) + E(100, 152, 42, 36, g) + e(100, 158, 27, 24, '#e2f7c2') +
    `<g class="a-arm a-arm-l">${E(62, 150, 11, 19, g2, rot(18, 62, 150))}</g><g class="a-arm a-arm-r">${E(138, 150, 11, 19, g2, rot(-18, 138, 150))}</g>` +
    both(C(66, 42, 25, g)) + E(100, 86, 62, 48, g) + both(c(66, 42, 16, '#fff')) +
    face(100, 42, { gap: 34, r: 8.5, mouth: 'none', blush: false }) +
    e(52, 96, 10, 9, '#ff8fa3', 'opacity=".75"') + e(148, 96, 10, 9, '#ff8fa3', 'opacity=".75"') +
    L('M70 98 Q100 124 130 98', 4) + c(94, 82, 1.8, '#4f9a37') + c(106, 82, 1.8, '#4f9a37'));
};

A.owl = () => {
  const b = '#b07f52', body = 'M100 20 C150 20 168 70 168 118 C168 166 140 192 100 192 C60 192 32 166 32 118 C32 70 50 20 100 20Z';
  return part('a-bob', E(80, 193, 15, 8, '#ff9f1c') + E(120, 193, 15, 8, '#ff9f1c') +
    both(P('M50 52 L40 6 L86 30 Z', b)) + P(body, b) +
    insidePath(body, e(100, 152, 42, 42, '#f8e3c2')) + L('M82 138 q6 6 12 0 M106 138 q6 6 12 0 M70 156 q6 6 12 0 M94 156 q6 6 12 0 M118 156 q6 6 12 0 M82 174 q6 6 12 0 M106 174 q6 6 12 0', 3, '#dcbb8c') +
    `<g class="a-arm a-arm-l">${E(34, 128, 14, 35, '#8e6238', rot(10, 34, 128))}</g><g class="a-arm a-arm-r">${E(166, 128, 14, 35, '#8e6238', rot(-10, 166, 128))}</g>` +
    both(C(73, 82, 29, '#fff4dc')) + face(100, 82, { gap: 27, r: 10.5, mouth: 'none', by: 27, bx: -6 }) +
    P('M91 98 h18 l-9 14z', '#ff9f1c'));
};

A.unicorn = () => critter({
  c: '#ffffff', c2: '#ffe0ee', limb: '#ece8f2', foot: '#ffb5d6',
  tail: tube('M138 164 q30 -4 30 -36', '#ff8fc4', 5) + tube('M138 174 q38 2 40 -26', '#a98bff', 5) + tube('M138 182 q30 8 44 -8', '#5fc8ff', 4),
  back: C(46, 66, 18, '#a98bff') + C(40, 94, 17, '#5fc8ff') + C(46, 120, 16, '#ff8fc4'),
  ears: both(P('M54 48 L50 10 L86 32 Z', '#ffffff') + p('M60 40 L58 24 L74 34 Z', '#ffb5cf')) +
    P('M90 34 L100 -12 L110 34 Z', '#ffd23f') + L('M95 20 l9 -5 M93 29 l13 -6 M97 9 l5 -3', 2.5, '#f0a800'),
  head: C(84, 34, 16, '#ff8fc4') + C(110, 31, 15, '#a98bff') + C(64, 44, 13, '#5fc8ff') +
    e(100, 106, 25, 16, '#ffdcea') + c(93, 103, 2, '#f078a8') + c(107, 103, 2, '#f078a8'),
  body: p(heartPath(124, 160, 7), '#ff8fc4'),
  f: { my: 24 }, dy: 6,
});

A.mouse = () => critter({
  c: '#c4bdd6', c2: '#f3eef8', foot: '#ffb5cf',
  tail: L('M138 176 q32 8 36 -14 q2 -16 -11 -13', 5, '#ff9fba'),
  ears: both(C(46, 42, 29, '#b3abc8') + c(46, 43, 18, '#ffb5cf')),
  head: nose(100, 97, 5.5, 4, '#ff6f91') + whiskers,
  f: { mouth: 'smile', my: 14, teeth: true },
});

A.hippo = () => critter({
  c: '#b9a5e8', c2: '#dcd0f5',
  ears: both(C(58, 34, 13, '#a691dc') + c(58, 35, 6, '#ffb5cf')),
  head: E(100, 104, 46, 27, '#d3c5f3') + e(88, 94, 3.6, 5, '#8a72c4') + e(112, 94, 3.6, 5, '#8a72c4') +
    L('M80 112 Q100 124 120 112', 3.5) + P('M84 118 h9 v10 q-4.500 3 -9 0z', '#fff') + P('M107 118 h9 v10 q-4.500 3 -9 0z', '#fff'),
  f: { gap: 31, mouth: 'none', by: 9, r: 7 }, dy: -12,
});

A.zebra = () => critter({
  c: '#ffffff', c2: '#f1eef5', limb: '#ece8f2', foot: '#3f3a52',
  tail: tube('M138 172 q22 0 24 -22', '#ece8f2', 3) + C(162, 146, 9, '#3f3a52'),
  back: P('M86 34 L90 6 L98 24 L104 2 L110 24 L118 8 L116 36Z', '#3f3a52'),
  ears: both(P('M52 52 L48 10 L86 32 Z', '#ffffff') + p('M52 28 L49 10 L66 20Z', '#3f3a52')),
  head: inside(100, 80, 60, 52, p('M38 60 l24 6 l-24 6z M38 80 l20 5 l-20 5z M162 60 l-24 6 l24 6z M162 80 l-20 5 l20 5z M92 26 l8 22 l8 -22z M70 28 l8 16 l5 -18z M130 28 l-8 16 l-5 -18z', '#3f3a52')) +
    E(100, 108, 29, 20, '#5b5670') + e(91, 105, 3.5, 5, '#2c2840') + e(109, 105, 3.5, 5, '#2c2840') + L('M92 117 q8 5 16 0', 3, '#fff'),
  body: inside(100, 150, 41, 38, p('M56 134 l20 5 l-20 6z M58 154 l18 4 l-18 6z M144 134 l-20 5 l20 6z M142 154 l-18 4 l18 6z', '#3f3a52')),
  f: { mouth: 'none', by: 9 }, dy: -2,
});

A.deer = () => critter({
  c: '#d99a5b', c2: '#fff0d9', foot: '#7a4a2a',
  tail: C(142, 172, 11, '#fff0d9'),
  ears: both(tube('M72 34 q-10 -14 -6 -32 M69 20 q-12 0 -18 -12 M68 8 q4 -8 12 -10', '#9a6238', 1) +
    E(40, 58, 20, 12, '#d99a5b', rot(-28, 40, 58)) + e(40, 58, 12, 6, '#ffd3b5', rot(-28, 40, 58))),
  head: e(100, 103, 21, 15, '#fff0d9') + nose(100, 96, 7, 5) + c(72, 50, 3, '#fff0d9') + c(86, 44, 2.5, '#fff0d9') + c(128, 50, 3, '#fff0d9') + c(114, 44, 2.5, '#fff0d9'),
  body: c(70, 140, 3.5, '#fff0d9') + c(130, 140, 3.5, '#fff0d9') + c(66, 158, 3, '#fff0d9') + c(134, 158, 3, '#fff0d9'),
  f: { my: 15 },
});

A.hedgehog = () => {
  let d = '';
  for (let i = 0; i <= 26; i++) {
    const a = (150 + i * 240 / 26) * Math.PI / 180, r = i % 2 ? 78 : 100;
    d += `${i ? 'L' : 'M'}${(100 + r * Math.cos(a)).toFixed(1)} ${(112 + r * 0.95 * Math.sin(a)).toFixed(1)}`;
  }
  return critter({
    c: '#fbdfb8', c2: '#fff4e0', hrx: 52, hry: 46, hy: 88, foot: '#e6ae7a',
    back: `<path d="${d} L150 180 L50 180Z" fill="#8a5a36" stroke="#8a5a36" stroke-width="5" stroke-linejoin="round"/>`,
    ears: both(C(58, 54, 13, '#fbdfb8') + c(58, 55, 6, '#ffb5cf')),
    head: inside(100, 88, 52, 46, p('M40 30 h120 v34 l-12 12 l-12 -14 l-12 14 l-12 -14 l-12 14 l-12 -14 l-12 14 l-12 -14 l-12 14 l-12 -12z', '#8a5a36')) + nose(100, 104, 7, 5.5),
    f: { gap: 23, my: 16, r: 7.5 }, dy: 10,
  });
};

/* ---------- sea friends ---------- */

A.whale = () => {
  const b = '#5fb0f5', body = 'M22 122 C22 72 70 50 118 56 C154 60 172 88 172 118 C172 152 136 172 96 172 C52 172 22 158 22 122Z';
  return part('a-bob', `<g class="a-spout">${tube('M88 46 q-2 -22 -20 -26 M88 46 q2 -22 20 -26', '#a8e4ff', 2)}</g>` +
    part('a-fin', P('M162 112 Q188 104 190 72 Q176 76 170 88 Q164 72 150 72 Q148 98 162 112Z', '#4a9ae6')) +
    P(body, b) + insidePath(body, e(92, 178, 78, 34, '#e3f3ff')) + L('M60 152 h70 M70 162 h50', 2.5, '#b5d8f5') +
    E(118, 150, 10, 20, '#4a9ae6', rot(42, 118, 150)) +
    face(78, 116, { gap: 30, my: 14, by: 12 }));
};

A.dolphin = () => {
  const b = '#58b4ee', b2 = '#3f9bdb', body = 'M20 106 C36 60 96 40 138 62 C162 76 172 104 168 132 C150 122 136 128 126 142 C96 168 44 150 20 106Z';
  return part('a-bob', part('a-fin', P('M160 122 Q190 124 194 152 Q176 148 168 140 Q166 158 150 164 Q146 140 160 122Z', b2)) +
    P('M96 48 Q114 14 132 20 Q124 38 128 60Z', b2) +
    P(body, b) + insidePath(body, p('M20 106 Q70 132 126 142 L110 180 L20 160Z', '#e3f3ff')) +
    P('M22 104 Q4 108 2 118 Q14 124 32 118Z', b) +
    E(98, 142, 9, 20, b2, rot(50, 98, 142)) +
    face(64, 98, { gap: 20, r: 7, my: 14, by: 11 }));
};

A.octopus = () => {
  const k = '#ff8fc4', k2 = '#f578b2';
  return part('a-bob', tube('M58 116 q-18 34 -40 22', k2, 9) + tube('M72 126 q-10 44 -34 46', k, 9) + tube('M92 130 q-2 46 -18 54', k2, 9) +
    tube('M108 130 q2 46 18 54', k2, 9) + tube('M128 126 q10 44 34 46', k, 9) + tube('M142 116 q18 34 40 22', k2, 9) +
    E(100, 78, 60, 56, k) + c(64, 46, 7, '#ffbadb') + c(82, 34, 5, '#ffbadb') + c(134, 44, 8, '#ffbadb') + c(118, 32, 4, '#ffbadb') +
    face(100, 88, { mouth: 'o', my: 12, cheek: '#ff5c8a' }));
};

A.crab = () => {
  const r = '#ff5f52', r2 = '#e84a3f';
  return part('a-bob', tube('M56 140 l-22 20 M50 126 l-28 8 M144 140 l22 20 M150 126 l28 8', r2, 4) +
    `<g class="a-arm a-arm-l">${tube('M52 104 q-18 -16 -14 -40', r2, 6) + E(36, 48, 18, 23, r, rot(-24, 36, 48)) + E(56, 56, 9, 16, r2, rot(34, 56, 56))}</g>` +
    `<g class="a-arm a-arm-r">${mirror(tube('M52 104 q-18 -16 -14 -40', r2, 6) + E(36, 48, 18, 23, r, rot(-24, 36, 48)) + E(56, 56, 9, 16, r2, rot(34, 56, 56)))}</g>` +
    both(tube('M80 86 v-22', r2, 2)) + E(100, 124, 60, 42, r) + both(C(80, 56, 14, '#fff')) +
    face(100, 58, { gap: 20, r: 6.5, mouth: 'none', blush: false }) +
    e(62, 128, 10, 9, '#ff9c91') + e(138, 128, 10, 9, '#ff9c91') + L('M86 128 q14 14 28 0', 4) + c(78, 100, 3, '#ff9c91') + c(122, 100, 3, '#ff9c91') + c(100, 94, 3, '#ff9c91'));
};

A.fish = () => {
  const o = '#ff8431', o2 = '#f06d1c';
  return part('a-bob', part('a-fin', P('M148 104 L190 70 Q180 104 190 138Z', o2) + p('M176 82 L190 70 Q182 104 190 138 L176 126Z', '#fff')) +
    P('M70 66 Q96 30 126 62Z', o2) + P('M84 140 q10 22 26 6z', o2) +
    E(92, 104, 66, 44, o) + inside(92, 104, 66, 44, p('M116 56 q14 48 0 96 h20 q14 -48 0 -96z', '#fff')) +
    face(66, 100, { gap: 21, r: 7.5, my: 14 }));
};

A.turtle = () => critter({
  c: '#a8e06a', c2: '#e2f7c2', hrx: 54, hry: 48,
  back: E(100, 148, 64, 54, '#3fae5a') + L('M100 98 v24 M66 110 l14 16 M134 110 l-14 16 M44 150 h16 M156 150 h-16', 4, '#2f9049'),
  f: { my: 14 },
});

A.starfish = () => {
  const d = starPath(100, 104, 90, 46);
  return part('a-bob', `<path d="${d}" fill="#ffab2e" stroke="#ffab2e" stroke-width="12" stroke-linejoin="round"/>` +
    c(100, 44, 4, '#ffd48a') + c(48, 96, 4, '#ffd48a') + c(152, 96, 4, '#ffd48a') + c(66, 162, 4, '#ffd48a') + c(134, 162, 4, '#ffd48a') +
    c(100, 62, 3, '#ffd48a') + c(66, 100, 3, '#ffd48a') + c(134, 100, 3, '#ffd48a') +
    face(100, 104, { gap: 17, r: 7, my: 13, by: 10, cheek: '#ff7a5c' }));
};

A.jellyfish = () => {
  const v = '#b993ff';
  return part('a-bob', `<g class="a-tentacles">${tube('M66 104 q-10 24 0 42 q8 16 -2 34', '#dcc8ff', 3) + tube('M90 108 q-8 28 2 48 q6 14 0 30', '#ffb5dc', 3) +
    tube('M112 108 q8 28 -2 48 q-6 14 0 30', '#dcc8ff', 3) + tube('M134 104 q10 24 0 42 q-8 16 2 34', '#ffb5dc', 3)}</g>` +
    P('M36 102 C36 32 164 32 164 102 Q154 116 142 102 Q132 116 121 102 Q111 116 100 102 Q89 116 79 102 Q68 116 58 102 Q46 116 36 102Z', v) +
    e(70, 58, 12, 7, '#fff', `opacity=".4" ${rot(-30, 70, 58)}`) +
    face(100, 82, { gap: 24, my: 12 }));
};

export const ANIMALS = A;
export const LAND = ['rabbit', 'cat', 'dog', 'bear', 'panda', 'fox', 'lion', 'tiger', 'elephant', 'giraffe', 'monkey', 'pig', 'cow', 'sheep', 'koala', 'penguin', 'chick', 'frog', 'owl', 'unicorn', 'mouse', 'hippo', 'zebra', 'deer', 'hedgehog'];
export const SEA = ['whale', 'dolphin', 'octopus', 'crab', 'fish', 'turtle', 'starfish', 'jellyfish'];

/** A whole animal as a standalone <svg> string. */
export const animal = (name, cls = '') => wrap(A[name](), `animal ${cls}`);
/** Just the drawing, to nest inside a bigger scene: <g transform=...>. */
export const animalG = (name, x, y, size, extra = '') =>
  `<g class="animal" transform="translate(${x} ${y}) scale(${size / 200})" ${extra}>${A[name]()}</g>`;
