// 拼图 — a real jigsaw: choose 12, 20, 30 or 48 pieces, then drag every piece to its place.
// The busier the level, the fainter the picture underneath; the eye button shows it for a moment.
import { pick, shuffle, rand, dist, el, store } from '../core.js';
import { animalG } from '../art/animals.js';
import { foodG } from '../art/food.js';
import { meadow, seabed, seaweed, coral, night, rainbow, flower, room, tree, pine, bush, cloud, appleTree, hills, band } from '../art/scenes.js';
import { R, C, E, P, e, c, L, star, sparkle, nextId } from '../art/base.js';
import { castle } from '../art/girl.js';

const PW = 600, PH = 450;
const LEVELS = [{ cols: 4, rows: 3, guide: 0.24 }, { cols: 5, rows: 4, guide: 0.17 }, { cols: 6, rows: 5, guide: 0.1 }, { cols: 8, rows: 6, guide: 0.05 }];

// little props that fill a picture with things to recognise
const balloon = (x, y, col) => L(`M${x} ${y + 30} q8 30 -4 62`, 2, '#fff') + E(x, y, 22, 28, col) + e(x - 7, y - 9, 5, 8, '#fff', 'opacity=".45"');
const butterfly = (x, y, col) => `<g transform="translate(${x} ${y})">${E(-9, -5, 10, 12, col, 'transform="rotate(-20)"')}${E(9, -5, 10, 12, col, 'transform="rotate(20)"')}${E(-6, 8, 6, 7, '#fff')}${E(6, 8, 6, 7, '#fff')}${R(-2, -10, 4, 22, 2, '#38334d')}</g>`;
const bird = (x, y, col = '#fff') => L(`M${x - 14} ${y} q7 -10 14 0 q7 -10 14 0`, 4, col);
const fence = (x, y, n) => Array.from({ length: n }, (_, i) => R(x + i * 26, y - 40, 14, 44, 5, '#fff3dc')).join('') + R(x - 6, y - 30, n * 26 + 4, 8, 4, '#f3dfb8') + R(x - 6, y - 14, n * 26 + 4, 8, 4, '#f3dfb8');
const barn = (x, y) => `<g transform="translate(${x} ${y})">${R(-70, -90, 140, 90, 6, '#ff5f52')}${P('M-84 -86 L0 -150 L84 -86Z', '#c93f36')}${R(-24, -56, 48, 56, 4, '#8a3a32')}${L('M-24 -56 L24 0 M24 -56 L-24 0', 4, '#fff')}${C(0, -108, 13, '#fff3dc')}</g>`;
const igloo = (x, y) => `<g transform="translate(${x} ${y})">${P('M-80 0 A80 74 0 0 1 80 0Z', '#eaf6ff')}${L('M-74 -30 H74 M-56 -56 H56 M-30 0 V-30 M20 0 V-30 M-6 -30 V-56 M40 -30 V-56', 3, '#bcdcf2')}${P('M-24 0 v-22 a24 24 0 0 1 48 0 v22z', '#5f83b8')}</g>`;
const fruit = (name, x, y, s) => foodG(name, x, y, s, { face: false });

const PICTURES = [
  // a party in the meadow
  () => meadow(PW, 285, { sunX: 520, trees: false }) + rainbow(300, 290, 215) + cloud(120, 70, 0.7, '#fff') + cloud(430, 50, 0.6, '#fff') +
    balloon(60, 120, '#ff5c8a') + balloon(104, 150, '#ffc21f') + balloon(545, 190, '#9a7bf5') + tree(30, 300, 0.7) + pine(570, 300, 0.6) +
    animalG('unicorn', 220, 120, 170) + animalG('rabbit', 60, 210, 150) + animalG('cat', 400, 205, 150) + animalG('bear', 150, 270, 140) + animalG('pig', 300, 285, 135) + animalG('chick', 470, 310, 110) +
    butterfly(200, 110, '#ff8fc4') + butterfly(420, 150, '#7fd3ff') + flower(30, 420, 1, '#ff8fc4') + flower(560, 410, 1, '#fff') + flower(280, 430, 0.9, '#b79cff') + fruit('cupcake', 20, 330, 70) + fruit('lollipop', 540, 320, 64),
  // under the sea
  () => seabed(PW, 370) + seaweed(40, 400, 1.1) + seaweed(560, 410, 0.9, '#2fa57a') + coral(120, 420, 1, '#ff8fa3') + coral(470, 425, 1.1, '#ffb347') + coral(300, 440, 0.8, '#b79cff') +
    animalG('whale', 20, 20, 210) + animalG('dolphin', 370, 20, 180) + animalG('octopus', 230, 150, 160) + animalG('fish', 440, 190, 120) + animalG('jellyfish', 60, 200, 120) +
    animalG('turtle', 180, 290, 120) + animalG('crab', 400, 320, 120) + animalG('starfish', 30, 340, 90) + animalG('starfish', 520, 360, 70) +
    [[250, 60], [330, 110], [200, 250], [560, 120], [350, 280], [120, 150]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${7 + (i % 3) * 4}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`).join(''),
  // the forest at night
  () => night(PW, 320) + pine(40, 330, 0.9, '#2f7a5c') + pine(560, 330, 1, '#2f7a5c') + pine(300, 320, 0.7, '#3a8f6a') + tree(160, 330, 0.7, '#3f9f6f', '#2f8a5c') +
    animalG('owl', 210, 60, 150) + animalG('fox', 40, 220, 170) + animalG('deer', 400, 190, 170) + animalG('hedgehog', 230, 290, 130) + animalG('mouse', 110, 320, 100) + animalG('rabbit', 500, 310, 110) +
    fruit('mushroom', 20, 370, 70) + fruit('mushroom', 360, 380, 60) + fruit('acorn', 470, 400, 44) + sparkle(100, 150, 9, '#fff36b') + sparkle(360, 120, 7, '#fff36b') + sparkle(520, 200, 8, '#fff36b') + sparkle(250, 250, 6, '#fff36b'),
  // the farm
  () => meadow(PW, 270, { sunX: 80, trees: false }) + barn(470, 276) + appleTree(250, 280, 0.75) + cloud(300, 60, 0.7, '#fff') + bird(380, 90) + bird(420, 70) + fence(20, 300, 7) +
    animalG('cow', 30, 150, 190) + animalG('sheep', 330, 230, 150) + animalG('pig', 190, 260, 150) + animalG('dog', 470, 290, 130) + animalG('chick', 110, 330, 95) + animalG('chick', 380, 350, 80) + animalG('cat', 520, 180, 80) +
    fruit('apple', 290, 380, 50) + fruit('carrot', 30, 390, 50) + fruit('corn', 560, 380, 54) + flower(170, 430, 0.9, '#ff8fc4') + flower(450, 425, 0.9, '#fff'),
  // a day at the zoo
  () => meadow(PW, 280, { sunX: 300, trees: false }) + tree(40, 290, 0.8) + tree(560, 290, 0.9) + cloud(120, 60, 0.7, '#fff') + cloud(480, 80, 0.7, '#fff') + bird(200, 110) +
    animalG('giraffe', 20, 90, 210) + animalG('elephant', 170, 120, 210) + animalG('lion', 380, 150, 190) + animalG('zebra', 110, 280, 140) + animalG('monkey', 260, 300, 130) + animalG('hippo', 400, 300, 140) + animalG('tiger', 500, 250, 100) +
    fruit('banana', 220, 400, 50) + fruit('watermelon', 540, 400, 54) + bush(60, 440, 0.5) + flower(360, 432, 0.9, '#ffd447'),
  // snow day
  () => band(PW, -400, '#a9d8ff', 700) + cloud(110, 70, 0.8, '#fff') + cloud(470, 50, 0.7, '#fff') + hills(PW, 250, '#e3f1ff', 50, 520, 80) + pine(60, 290, 0.9, '#5fb38f') + pine(540, 280, 1, '#5fb38f') + pine(330, 262, 0.6, '#7cc7a6') + igloo(450, 300) +
    hills(PW, 300, '#ffffff', 14, 600) + band(PW, 330, '#ffffff') +
    animalG('penguin', 40, 200, 170) + animalG('penguin', 200, 250, 110) + animalG('fox', 300, 240, 150) + animalG('rabbit', 190, 330, 110) + animalG('deer', 460, 290, 140) + animalG('owl', 520, 110, 80) +
    Array.from({ length: 22 }, (_, i) => c(((i * 173) % 590) + 5, ((i * 97) % 300) + 10, 3 + (i % 3) * 1.5, '#fff')).join('') + fruit('carrot', 120, 392, 44),
  // the castle garden
  () => meadow(PW, 300, { sunX: 80, trees: false }) + `<g transform="translate(410 300) scale(.62)">${castle(0, 0)}</g>` + rainbow(170, 300, 150) + cloud(250, 60, 0.7, '#fff') + balloon(300, 150, '#ff5c8a') + balloon(560, 120, '#7fd3ff') +
    animalG('unicorn', 30, 190, 190) + animalG('panda', 220, 260, 150) + animalG('koala', 370, 300, 120) + animalG('mouse', 500, 320, 100) + animalG('frog', 140, 340, 90) +
    butterfly(240, 180, '#ffc21f') + butterfly(520, 230, '#ff8fc4') + flower(30, 425, 1, '#ff8fc4') + flower(300, 430, 1, '#fff') + flower(580, 425, 0.9, '#b79cff') + fruit('strawberry', 470, 400, 48) + star(110, 60, 14, '#fff36b'),
];

/** Draw the picture once into a bitmap, so dozens of pieces can show it without redrawing vectors. */
function rasterize(inner) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PW * 2}" height="${PH * 2}" viewBox="0 0 ${PW} ${PH}">${inner}</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return new Promise((done) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = PW * 2; canvas.height = PH * 2;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => done(blob ? URL.createObjectURL(blob) : src), 'image/png');
      } catch { done(src); }
    };
    img.onerror = () => done(src);
    img.src = src;
  });
}

/** One side of a piece from (x0,y0) to (x1,y1): straight, or with a round tab (sign 1) or blank (sign -1). */
function edge(x0, y0, x1, y1, sign) {
  const f = (v) => v.toFixed(1);
  if (!sign) return `L${f(x1)} ${f(y1)}`;
  const dx = x1 - x0, dy = y1 - y0, r = Math.hypot(dx, dy) * 0.13;
  return `L${f(x0 + dx * 0.4)} ${f(y0 + dy * 0.4)} A${f(r)} ${f(r)} 0 1 ${sign > 0 ? 1 : 0} ${f(x0 + dx * 0.6)} ${f(y0 + dy * 0.6)} L${f(x1)} ${f(y1)}`;
}

const levelIcon = ({ cols, rows }) => `<svg viewBox="0 0 120 90">${R(2, 2, 116, 86, 12, '#fff')}` +
  Array.from({ length: cols * rows }, (_, i) => R(6 + (i % cols) * (108 / cols) + 1, 6 + Math.floor(i / cols) * (78 / rows) + 1, 108 / cols - 2, 78 / rows - 2, 3, ['#ff8fc4', '#ffc21f', '#7fd3ff', '#9be27a', '#b79cff'][(i + Math.floor(i / cols)) % 5])).join('') + `</svg>`;

export default {
  id: 'puzzle', name: '拼图', colors: ['#e6f9d9', '#a8e68a'], intro: 'puzzle-pick',
  icon: () => { const id = nextId(); return `<svg viewBox="0 0 230 200"><clipPath id="${id}"><rect x="20" y="24" width="190" height="150" rx="20"/></clipPath><g clip-path="url(#${id})" class="calm"><g transform="translate(20 24) scale(.3167 .3333)">${PICTURES[0]()}</g>
    <path d="M67 24 V70 a10 10 0 1 0 0 20 V174 M115 24 V60 a10 10 0 1 1 0 20 V110 a10 10 0 1 0 0 20 V174 M163 24 V100 a10 10 0 1 0 0 20 V174 M20 74 H50 a10 10 0 1 1 20 0 H150 a10 10 0 1 0 20 0 H210 M20 124 H90 a10 10 0 1 0 20 0 H180 a10 10 0 1 1 20 0 H210" fill="none" stroke="#fff" stroke-width="4"/></g></svg>`; },

  start(ctx) {
    const { W } = ctx;
    ctx.scene(room(W, '#e3f6ff', '#cdeeff', '#bfe3f5', 760));
    let url = null;
    ctx.cleanups.push(() => { if (url && url.startsWith('blob:')) URL.revokeObjectURL(url); });

    // ---- how many pieces? ----
    const chooser = ctx.add(el('div', { class: 'pz-levels' }));
    LEVELS.forEach((level, i) => {
      const b = el('button', { class: `pz-level ${i === store.data.puzzleLevel ? 'last' : ''}`, type: 'button', style: { animationDelay: `${i * 0.07}s` }, html: `${levelIcon(level)}<span>${level.cols * level.rows}</span>` });
      b.addEventListener('click', () => {
        ctx.sfx('pop');
        store.data.puzzleLevel = i; store.save();
        chooser.remove();
        deal(level);
      });
      chooser.append(b);
    });

    async function deal({ cols, rows, guide }) {
      ctx.help = () => ctx.say('puzzle-intro');
      ctx.say('puzzle-intro');
      const count = cols * rows;
      ctx.progress(0, 5);
      url = await rasterize(pick(PICTURES)());
      if (!ctx.alive) return;

      // the board on the left, loose pieces to its right and underneath
      const bw = Math.min(W * 0.56, 660), k = bw / PW, bh = PH * k, bx = 34, by = 116;
      const cw = PW / cols, ch = PH / rows, m = Math.min(cw, ch) * 0.3;
      const board = ctx.add(el('div', { class: 'pz-board', style: { left: `${bx - 12}px`, top: `${by - 12}px`, width: `${bw + 24}px`, height: `${bh + 24}px` } }));
      const hint = el('div', { class: 'pz-guide', style: { backgroundImage: `url(${url})`, opacity: guide } });
      board.append(hint);
      board.dataset.cols = cols; board.dataset.rows = rows;

      let size = 96, slots = [];
      for (; size >= 58; size -= 4) {
        slots = [];
        for (let y = 108 + size / 2; y <= 782 - size / 2; y += size) for (let x = bx + bw + 30 + size / 2; x <= W - 10 - size / 2; x += size) slots.push([x, y]);
        for (let y = by + bh + 26 + size / 2; y <= 782 - size / 2; y += size) for (let x = bx + 104 + size / 2; x <= bx + bw + 10 - size / 2; x += size) slots.push([x, y]);
        if (slots.length >= count) break;
      }
      slots = shuffle(slots).slice(0, count);
      const pile = Math.min(1, (size * 0.86) / (Math.max(cw, ch) * k));   // how small a loose piece is drawn
      const snap = Math.max(30, Math.min(cw, ch) * k * 0.42);

      const h = Array.from({ length: rows + 1 }, () => Array.from({ length: cols }, () => (Math.random() < 0.5 ? 1 : -1)));
      const v = Array.from({ length: rows }, () => Array.from({ length: cols + 1 }, () => (Math.random() < 0.5 ? 1 : -1)));
      let left = count, top = 100;
      const pieces = [];
      for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
        // the outline in the piece's own box (pixels), which is the cell plus a margin for the tabs
        const x0 = m * k, y0 = m * k, x1 = (m + cw) * k, y1 = (m + ch) * k;
        const d = `M${x0.toFixed(1)} ${y0.toFixed(1)}` + edge(x0, y0, x1, y0, r ? -h[r][col] : 0) + edge(x1, y0, x1, y1, col < cols - 1 ? v[r][col + 1] : 0) +
          edge(x1, y1, x0, y1, r < rows - 1 ? h[r + 1][col] : 0) + edge(x0, y1, x0, y0, col ? -v[r][col] : 0) + 'Z';
        const w = (cw + m * 2) * k, hgt = (ch + m * 2) * k;
        const tx = bx + (col + 0.5) * cw * k, ty = by + (r + 0.5) * ch * k;
        const [sx, sy] = slots[r * cols + col];
        const s = ctx.sprite(`<div class="pz-cut" style="background-image:url(${url});background-size:${bw.toFixed(1)}px ${bh.toFixed(1)}px;background-position:${(-(col * cw - m) * k).toFixed(1)}px ${(-(r * ch - m) * k).toFixed(1)}px;clip-path:path('${d}');-webkit-clip-path:path('${d}')">` +
          `<svg viewBox="0 0 ${w.toFixed(1)} ${hgt.toFixed(1)}"><path d="${d}" fill="none" stroke="#fff" stroke-width="${count > 20 ? 3 : 4}" stroke-linejoin="round"/></svg></div>`, tx, ty, w, hgt, 'pz');
        s.el.dataset.tx = tx; s.el.dataset.ty = ty;
        s.el.style.setProperty('--pile', pile);
        s.el.style.rotate = `${rand(-9, 9)}deg`;
        s.z(10 + ((r * cols + col) * 7) % count);
        s.el.animate([{ opacity: 0 }, { opacity: 1 }], 300);
        ctx.after(350 + ((r * cols + col) % 12) * 40, () => s.glide(sx + rand(-4, 4), sy + rand(-4, 4), 520));
        ctx.drag(s, {
          start: () => { s.el.style.rotate = '0deg'; s.z(++top); },
          end: async () => {
            if (dist(s.cx, s.cy, tx, ty) > snap) { ctx.sfx('drop'); return; }
            s.locked = true; s.el.classList.add('placed'); s.z(1);
            await s.glide(tx, ty, 140);
            left--;
            ctx.sfx('good'); ctx.note((count - left) % 11);
            ctx.burst(tx, ty, { n: 5, spread: 70, size: 24 });
            ctx.progress(Math.floor(((count - left) / count) * 5), 5);
            if (left) return;
            board.classList.add('solved'); hint.style.opacity = 1;
            ctx.sfx('great');
            ctx.burst(bx + bw / 2, by + bh / 2, { n: 26, spread: 380, size: 44 });
            ctx.win({ delay: 1800 });
          },
        });
        pieces.push(s);
      }
      ctx.after(1200, () => ctx.sfx('whoosh'));

      // a peek at the whole picture
      let peeking = 0;
      ctx.button('eye', bx + 40, 736, 'yellow', '看一眼', () => {
        hint.style.opacity = 0.75; board.classList.add('peek');
        const token = ++peeking;
        ctx.after(2600, () => { if (token === peeking && left) { hint.style.opacity = guide; board.classList.remove('peek'); } });
      });
    }
  },
};
