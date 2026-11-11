// 拼图 — jigsaw pictures cut into 4, then 6, then 9 pieces. Drag each piece to its place; it snaps when close.
import { pick, sample, shuffle, rand, dist, el } from '../core.js';
import { animalG } from '../art/animals.js';
import { meadow, seabed, seaweed, coral, night, island, rainbow, flower, room } from '../art/scenes.js';
import { R, nextId } from '../art/base.js';

const PW = 600, PH = 450;
const PICTURES = [
  () => meadow(PW, 300, { sunX: 500 }) + rainbow(190, 300, 150) + animalG('rabbit', 70, 190, 190) + animalG('unicorn', 300, 150, 240) + flower(280, 400, 1.2, '#ff8fc4') + flower(540, 380, 1, '#fff'),
  () => seabed(PW, 370) + seaweed(70, 400, 1.1) + coral(520, 410, 1.1) + animalG('whale', 40, 40, 250) + animalG('fish', 340, 70, 150) + animalG('octopus', 330, 220, 190) + animalG('starfish', 110, 320, 100),
  () => night(PW, 330) + animalG('owl', 50, 110, 210) + animalG('fox', 280, 180, 220) + animalG('hedgehog', 450, 290, 140),
  () => meadow(PW, 280, { sunX: 90, trees: false }) + animalG('cow', 30, 130, 230) + animalG('pig', 240, 200, 200) + animalG('chick', 430, 270, 150) + animalG('sheep', 400, 90, 170),
  () => island(PW, 250) + animalG('dolphin', 60, 190, 220) + animalG('crab', 400, 300, 150) + animalG('turtle', 300, 130, 150),
  () => meadow(PW, 300, { sunX: 520 }) + animalG('lion', 30, 150, 230) + animalG('elephant', 230, 110, 260) + animalG('monkey', 450, 240, 160),
  () => meadow(PW, 320, { sunX: 80, trees: false }) + animalG('panda', 40, 170, 220) + animalG('koala', 250, 200, 190) + animalG('penguin', 420, 190, 180) + flower(240, 420, 1.1, '#b79cff'),
];
const ROUNDS = [[2, 2], [3, 2], [3, 3]];

function edge(x0, y0, x1, y1, sign) {
  if (!sign) return `L${x1} ${y1}`;
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), r = len * 0.13;
  return `L${x0 + dx * 0.4} ${y0 + dy * 0.4} A${r} ${r} 0 1 ${sign > 0 ? 1 : 0} ${x0 + dx * 0.6} ${y0 + dy * 0.6} L${x1} ${y1}`;
}

export default {
  id: 'puzzle', name: '拼图', colors: ['#e6f9d9', '#a8e68a'], intro: 'puzzle-intro',
  icon: () => { const id = nextId(); return `<svg viewBox="0 0 230 200"><clipPath id="${id}"><rect x="20" y="24" width="190" height="150" rx="20"/></clipPath><g clip-path="url(#${id})" class="calm"><g transform="translate(20 24) scale(.3167 .3333)">${PICTURES[0]()}</g>
    <path d="M115 24 V80 a14 14 0 1 0 0 28 V174 M20 99 H68 a14 14 0 1 1 28 0 H210" fill="none" stroke="#fff" stroke-width="5"/></g></svg>`; },

  start(ctx) {
    const { W } = ctx;
    ctx.scene(room(W, '#e3f6ff', '#cdeeff', '#bfe3f5', 720));
    const k = Math.min(1, (W - 470) / PW), bw = PW * k, bh = PH * k;
    const bx = Math.max(36, W * 0.36 - bw / 2), by = 430 - bh / 2;
    const pictures = sample(PICTURES, ROUNDS.length);
    let round = 0;
    ctx.progress(0, ROUNDS.length);

    function deal() {
      const [cols, rows] = ROUNDS[round], cw = PW / cols, ch = PH / rows, m = Math.min(cw, ch) * 0.3;
      const pic = pictures[round](), clipAll = nextId();
      const frame = ctx.add(el('div', { class: 'pz-board calm', style: { left: `${bx - 14}px`, top: `${by - 14}px`, width: `${bw + 28}px`, height: `${bh + 28}px` },
        html: `<svg viewBox="0 0 ${PW} ${PH}"><clipPath id="${clipAll}"><rect width="${PW}" height="${PH}" rx="16"/></clipPath><g clip-path="url(#${clipAll})" opacity=".2">${pic}</g></svg>` }));
      const h = Array.from({ length: rows + 1 }, () => Array.from({ length: cols }, () => (Math.random() < 0.5 ? 1 : -1)));
      const v = Array.from({ length: rows }, () => Array.from({ length: cols + 1 }, () => (Math.random() < 0.5 ? 1 : -1)));
      let left = cols * rows;
      const pieces = [];
      const homes = shuffle(Array.from({ length: cols * rows }, (_, i) => i));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = c * cw, y = r * ch;
        const d = `M${x} ${y}` + edge(x, y, x + cw, y, r ? -h[r][c] : 0) + edge(x + cw, y, x + cw, y + ch, c < cols - 1 ? v[r][c + 1] : 0) +
          edge(x + cw, y + ch, x, y + ch, r < rows - 1 ? h[r + 1][c] : 0) + edge(x, y + ch, x, y, c ? -v[r][c] : 0) + 'Z';
        const id = nextId();
        const tx = bx + (x + cw / 2) * k, ty = by + (y + ch / 2) * k;
        const slot = homes[r * cols + c], right = W - (bx + bw) - 60;
        const sx = bx + bw + 40 + ((slot % 2) + 0.5) * ((right + 20) / 2) + rand(-12, 12);
        const sy = 150 + (Math.floor(slot / 2) + 0.5) * (600 / Math.ceil(cols * rows / 2)) + rand(-8, 8);
        const s = ctx.sprite(`<svg viewBox="${x - m} ${y - m} ${cw + m * 2} ${ch + m * 2}"><clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${pic}</g><path class="hit" d="${d}" fill="transparent" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>`,
          tx, ty, (cw + m * 2) * k, (ch + m * 2) * k, 'piece calm');
        s.el.style.rotate = `${rand(-10, 10)}deg`;
        s.z(10 + slot);
        ctx.after(500 + slot * 70, () => { ctx.sfx('whoosh'); s.glide(sx, sy, 500); });
        ctx.drag(s, {
          start: () => { s.el.style.rotate = '0deg'; s.z(100 + (pieces.top = (pieces.top || 0) + 1)); },
          end: async () => {
            if (dist(s.cx, s.cy, tx, ty) > 80) { ctx.sfx('drop'); return; }
            s.locked = true; s.el.classList.add('placed'); s.z(1);
            await s.glide(tx, ty, 160);
            ctx.sfx('good'); ctx.note(cols * rows - left); ctx.burst(tx, ty, { n: 6, spread: 90, size: 26 });
            if (--left) return;
            round++; ctx.progress(round, ROUNDS.length);
            frame.classList.add('solved'); ctx.sfx('great');
            ctx.burst(bx + bw / 2, by + bh / 2, { n: 22, spread: 360, size: 42 });
            await ctx.sleep(1900);
            if (round === ROUNDS.length) { ctx.win(); return; }
            pieces.forEach((q) => q.remove()); frame.remove();
            deal();
          },
        });
        pieces.push(s);
      }
    }
    deal();
  },
};
