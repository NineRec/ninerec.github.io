// 迷宫 — lead the hungry friend through the hedge maze to its snack. Three mazes, each a little bigger.
import { pick, sample, shuffle, el } from '../core.js';
import { animal } from '../art/animals.js';
import { food } from '../art/food.js';
import { meadow } from '../art/scenes.js';
import { R, star } from '../art/base.js';

const PAIRS = [['rabbit', 'carrot'], ['monkey', 'banana'], ['mouse', 'cheese'], ['bear', 'honey'], ['dog', 'bone'], ['panda', 'bamboo'], ['cat', 'fishy'], ['unicorn', 'cupcake']];
const SIZES = [[4, 3], [5, 4], [6, 4]];
const DIRS = [[0, -1, 'n', 's'], [1, 0, 'e', 'w'], [0, 1, 's', 'n'], [-1, 0, 'w', 'e']];

/** A perfect maze by depth-first carving: cells[y][x] = set of open sides. */
function carve(cols, rows) {
  const cells = Array.from({ length: rows }, () => Array.from({ length: cols }, () => new Set()));
  const seen = new Set(['0,0']), stack = [[0, 0]];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const next = shuffle(DIRS).find(([dx, dy]) => x + dx >= 0 && y + dy >= 0 && x + dx < cols && y + dy < rows && !seen.has(`${x + dx},${y + dy}`));
    if (!next) { stack.pop(); continue; }
    const [dx, dy, a, b] = next;
    cells[y][x].add(a); cells[y + dy][x + dx].add(b);
    seen.add(`${x + dx},${y + dy}`); stack.push([x + dx, y + dy]);
  }
  return cells;
}

export default {
  id: 'maze', name: '迷宫', colors: ['#dff7c9', '#9fe07a'], intro: 'maze-intro',
  icon: () => `<svg viewBox="0 0 230 200">${R(22, 18, 186, 164, 24, '#e9f7d0')}<path d="M22 72 h70 v54 M92 18 v0 M146 18 v60 h-0 M146 126 h62 M92 182 v-0 M60 126 v56 M146 126 v0" fill="none" stroke="#3fae5a" stroke-width="12" stroke-linecap="round"/>
    <g transform="translate(26 20) scale(.26)" class="calm">${animal('rabbit').replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(150 126) scale(.26)">${food('carrot', { face: false }).replace(/<\/?svg[^>]*>/g, '')}</g>${star(120, 100, 13, '#ffc21f')}</svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(meadow(W, 640, { trees: false, flowers: false }));
    const pairs = sample(PAIRS, SIZES.length);
    let round = 0, nodes = [];
    ctx.progress(0, SIZES.length);
    let state = null;

    ctx.rub((pt) => {
      const s = state;
      if (!s || s.busy || s.done) return;
      const tx = Math.floor((pt.x - s.ox) / s.cell), ty = Math.floor((pt.y - s.oy) / s.cell);
      if (tx === s.x && ty === s.y) return;
      const dx = tx - s.x, dy = ty - s.y;
      const order = Math.abs(dx) >= Math.abs(dy) ? [[Math.sign(dx), 0], [0, Math.sign(dy)]] : [[0, Math.sign(dy)], [Math.sign(dx), 0]];
      for (const [sx, sy] of order) {
        if (!sx && !sy) continue;
        const dir = DIRS.find(([ax, ay]) => ax === sx && ay === sy);
        if (s.cells[s.y][s.x].has(dir[2])) { s.step(sx, sy); return; }
      }
    });

    function play() {
      nodes.forEach((n) => n.remove()); nodes = [];
      const [cols, rows] = SIZES[round], [who, snack] = pairs[round];
      const cell = Math.min((W - 220) / cols, 590 / rows, 170), ox = W / 2 - cols * cell / 2, oy = 440 - rows * cell / 2;
      const cells = carve(cols, rows);
      let walls = '';
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        if (!cells[y][x].has('e') && x < cols - 1) walls += `M${ox + (x + 1) * cell} ${oy + y * cell} v${cell} `;
        if (!cells[y][x].has('s') && y < rows - 1) walls += `M${ox + x * cell} ${oy + (y + 1) * cell} h${cell} `;
      }
      const board = ctx.scene(R(ox - 22, oy - 22, cols * cell + 44, rows * cell + 44, 40, '#3fae5a') + R(ox - 8, oy - 8, cols * cell + 16, rows * cell + 16, 28, '#e9f7d0') +
        `<path d="${walls}" fill="none" stroke="#2f9049" stroke-width="20" stroke-linecap="round" transform="translate(0 5)"/><path d="${walls}" fill="none" stroke="#4fc56a" stroke-width="20" stroke-linecap="round"/>`);
      const at = (x, y) => [ox + (x + 0.5) * cell, oy + (y + 0.5) * cell];
      const goal = ctx.sprite(food(snack, { face: false }), ...at(cols - 1, rows - 1), cell * 0.62);
      goal.el.classList.add('pulse');
      const gems = sample(Array.from({ length: cols * rows - 2 }, (_, i) => i + 1), 3).map((i) => {
        const g = ctx.sprite(`<svg viewBox="-20 -20 40 40">${star(0, 0, 16, '#ffc21f')}</svg>`, ...at(i % cols, Math.floor(i / cols)), cell * 0.36);
        g.gx = i % cols; g.gy = Math.floor(i / cols); g.el.classList.add('float');
        return g;
      });
      const pet = ctx.sprite(animal(who), ...at(0, 0), cell * 0.82);
      pet.z(5);
      nodes = [board, goal.el, pet.el, ...gems.map((g) => g.el)];
      const s = state = { cells, cell, ox, oy, x: 0, y: 0, busy: false, done: false };
      s.step = async (dx, dy) => {
        s.busy = true; s.x += dx; s.y += dy;
        ctx.sfx('step');
        await pet.glide(...at(s.x, s.y), 130, 'ease-out');
        s.busy = false;
        const gem = gems.find((g) => !g.got && g.gx === s.x && g.gy === s.y);
        if (gem) { gem.got = true; gem.remove(); ctx.sfx('star'); ctx.burst(pet.cx, pet.cy, { n: 6, shapes: ['star'], colors: ['#ffc21f', '#fff36b'], spread: 80 }); }
        if (s.x !== cols - 1 || s.y !== rows - 1) return;
        s.done = true;
        goal.el.classList.remove('pulse');
        goal.el.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }], { duration: 350, fill: 'forwards' });
        ctx.sfx('chomp'); pet.el.classList.add('happy');
        ctx.burst(pet.cx, pet.cy - 30, { n: 14, shapes: ['heart', 'star'], spread: 160 });
        ctx.say('feed-yum');
        round++; ctx.progress(round, SIZES.length);
        await ctx.sleep(1900);
        if (round === SIZES.length) ctx.win(); else play();
      };
    }
    play();
  },
};
