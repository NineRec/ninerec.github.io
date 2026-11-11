// 翻翻乐 — flip two cards, find the pairs. Three rounds, each with more cards.
import { shuffle, sample, pick } from '../core.js';
import { animal, animalG, LAND, SEA } from '../art/animals.js';
import { food, FRUITS, VEGGIES } from '../art/food.js';
import { room, cloud } from '../art/scenes.js';
import { R, P, starPath, INK } from '../art/base.js';

const THEMES = [
  { names: LAND, art: animal },
  { names: SEA, art: animal },
  { names: FRUITS, art: food },
  { names: VEGGIES, art: food },
];
const ROUNDS = [{ pairs: 3, cols: 3 }, { pairs: 4, cols: 4 }, { pairs: 6, cols: 4 }];
const BACKS = [['#ff9ecb', '#ff7fb0'], ['#8fd6ff', '#4fb0f0'], ['#c9a7ff', '#a37bf0']];

const back = ([a, b]) => `<svg viewBox="0 0 100 120" preserveAspectRatio="none"><rect width="100" height="120" rx="14" fill="${a}"/><rect x="7" y="7" width="86" height="106" rx="10" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/></svg>` +
  `<svg class="back-star" viewBox="-30 -30 60 60"><path d="${starPath(0, 0, 24, 11)}" fill="#fff" stroke="${b}" stroke-width="4" stroke-linejoin="round"/></svg>`;

function bunting(W) {
  let out = `<path d="M-200 60 Q${W / 2} 190 ${W + 200} 60" fill="none" stroke="${INK}" stroke-width="4"/>`;
  const cols = ['#ff9ecb', '#ffe26a', '#8fd6ff', '#b79cff', '#8fd764'];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, x = -200 + t * (W + 400), y = 60 + 130 * (1 - (2 * t - 1) ** 2) * 0.5 + 0;
    const yy = 60 + (190 - 60) * 2 * t * (1 - t);
    out += `<path d="M${x - 24} ${yy} h48 l-24 46z" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  }
  return out;
}

export default {
  id: 'memory', name: '翻翻乐', colors: ['#ffe3f0', '#ffb8d6'], intro: 'memory-intro',
  icon: () => `<svg viewBox="0 0 230 200">
    <g transform="rotate(-10 70 110)">${R(22, 38, 96, 124, 16, '#8fd6ff')}<path d="${starPath(70, 100, 26, 12)}" fill="#fff" stroke="#4fb0f0" stroke-width="4" stroke-linejoin="round"/></g>
    <g transform="rotate(8 160 100)">${R(110, 30, 100, 130, 16, '#fff')}${animalG('rabbit', 116, 44, 88)}</g></svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(room(W, '#fff3d9', '#ffe6b3', '#f6cfa3', 640) + bunting(W));
    let round = 0;
    ctx.progress(0, ROUNDS.length);

    const deal = () => {
      const { pairs, cols } = ROUNDS[round];
      const theme = pick(THEMES), names = sample(theme.names, pairs);
      const deck = shuffle([...names, ...names]);
      const rows = deck.length / cols;
      const areaW = Math.min(W - 160, 1150), areaH = 570, top = 165;
      const cw = Math.min(areaW / cols - 22, (areaH / rows - 22) * 0.86, 230), ch = cw / 0.86;
      const gx = cw + 22, gy = ch + 22;
      const colors = BACKS[round % BACKS.length];
      let open = [], found = 0, busy = false;
      const cards = deck.map((name, i) => {
        const cx = W / 2 + (i % cols - (cols - 1) / 2) * gx, cy = top + areaH / 2 + (Math.floor(i / cols) - (rows - 1) / 2) * gy;
        const s = ctx.sprite(`<div class="flip"><div class="side back">${back(colors)}</div><div class="side front">${theme.art(name)}</div></div>`, cx, cy, cw, ch, 'mcard');
        s.name = name;
        s.el.animate([{ transform: 'translateY(-700px) rotate(-20deg)' }, { transform: 'none' }], { duration: 450, delay: i * 60, easing: 'cubic-bezier(.3,1.2,.5,1)', fill: 'backwards' });
        s.tap(async () => {
          if (busy || s.done || open.includes(s)) return;
          s.el.classList.add('open'); ctx.sfx('flip');
          open.push(s);
          if (open.length < 2) return;
          busy = true;
          const [a, b] = open;
          await ctx.sleep(520);
          if (a.name === b.name) {
            a.done = b.done = true; found++;
            ctx.sfx('good'); ctx.say(`wd-${a.name}`);
            for (const c of [a, b]) { c.el.classList.add('matched'); c.anim('jump', 520); ctx.burst(c.cx, c.cy, { n: 6 }); }
            open = []; busy = false;
            if (found === pairs) {
              round++;
              ctx.progress(round, ROUNDS.length);
              await ctx.sleep(1100);
              if (round === ROUNDS.length) { ctx.win(); return; }
              ctx.sfx('whoosh');
              cards.forEach((c, k) => c.el.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(700px) rotate(20deg)', opacity: 0 }], { duration: 380, delay: k * 30, fill: 'forwards' }));
              await ctx.sleep(700);
              cards.forEach((c) => c.remove());
              deal();
            }
          } else {
            ctx.sfx('bad');
            a.anim('shake', 380); b.anim('shake', 380);
            await ctx.sleep(650);
            a.el.classList.remove('open'); b.el.classList.remove('open');
            open = []; busy = false;
          }
        });
        return s;
      });
    };
    deal();
  },
};
