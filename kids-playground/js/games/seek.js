// 捉迷藏 — friends peek out from behind bushes, rocks and corals. Find everyone on the list.
import { pick, sample, shuffle, el, anim } from '../core.js';
import { animal, LAND, SEA } from '../art/animals.js';
import { meadow, seabed, seaweed, coral, bush, tuft, bubbles, tree, pine } from '../art/scenes.js';
import { R, E, C, P, e, c, p, L, shade } from '../art/base.js';
import { tray } from './kit.js';

const rock = (x, y, s, fill = '#aab4c8') => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-90 0 C-96 -50 -50 -84 -10 -76 C30 -100 92 -60 90 0Z', fill)}${p('M-10 -76 C30 -100 92 -60 90 0 H30 C50 -30 30 -60 -10 -76Z', shade(fill, -0.1))}${e(-40, -40, 16, 9, shade(fill, 0.3))}</g>`;
const log = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${R(-100, -62, 200, 64, 32, '#a8693a')}${E(84, -30, 22, 32, '#e0b07a')}${E(84, -30, 11, 17, '#c98f55')}${L('M-70 -44 h50 M-40 -22 h70', 4, '#8f5630')}</g>`;
const grass = (x, y, s) => [-70, -35, 0, 35, 70].map((dx, i) => tuft(x + dx * s, y, s * (1.9 + (i % 2) * 0.5), i % 2 ? '#3fae5a' : '#4fc56a')).join('') + `<rect x="${x - 95 * s}" y="${y - 4}" width="${190 * s}" height="${16 * s}" rx="8" fill="#3fae5a"/>`;
const shell = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-80 0 C-90 -70 -30 -100 0 -100 C30 -100 90 -70 80 0Z', '#ff9ecb')}${L('M0 -96 V0 M-36 -90 L-20 0 M36 -90 L20 0 M-64 -66 L-44 0 M64 -66 L44 0', 5, '#f078b0')}${R(-86, -8, 172, 18, 9, '#f078b0')}</g>`;
const chest = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${R(-84, -70, 168, 72, 12, '#a8693a')}${P('M-84 -66 C-84 -110 84 -110 84 -66Z', '#c98a5c')}${R(-84, -72, 168, 12, 6, '#ffc21f')}${R(-14, -76, 28, 32, 8, '#ffc21f')}${C(0, -58, 5, '#a8693a')}</g>`;
const weeds = (x, y, s) => seaweed(x - 50 * s, y, s) + seaweed(x + 10 * s, y, s * 1.15, '#2fa57a') + seaweed(x + 60 * s, y, s * 0.9);

const WORLDS = [
  { names: LAND.filter((n) => !['giraffe'].includes(n)), bg: (W) => meadow(W, 470, { trees: false }) + tree(W * 0.5, 430, 1) + pine(W * 0.94, 440, 0.9) + pine(W * 0.03, 440, 0.8),
    covers: [bush, rock, log, grass, bush, (x, y, s) => bush(x, y, s, '#3fae5a'), rock, grass] },
  { names: SEA, bg: (W) => seabed(W, 600) + bubbles(W), covers: [(x, y, s) => coral(x - 40 * s, y, s * 1.3) + coral(x + 50 * s, y, s * 1.1, '#ffb347'), (x, y, s) => rock(x, y, s, '#8f9bc0'), weeds, shell, chest, (x, y, s) => rock(x, y, s, '#7f8fb8'), weeds, (x, y, s) => coral(x, y, s * 1.4, '#b79cff') + coral(x + 70 * s, y, s, '#ff8fa3')] },
];
const SPOTS = [[0.1, 500], [0.27, 620], [0.44, 520], [0.6, 640], [0.76, 510], [0.91, 620], [0.33, 380], [0.67, 390]];
const FIND = 5;

export default {
  id: 'seek', name: '捉迷藏', colors: ['#d9f7c4', '#8fe08a'], intro: 'seek-intro',
  icon: () => `<svg viewBox="0 0 230 200" class="calm"><g transform="translate(50 6) scale(.65)">${animal('fox').replace(/<\/?svg[^>]*>/g, '')}</g>${bush(115, 186, 1.25)}</svg>`,

  start(ctx) {
    const { W } = ctx;
    let round = 0;
    ctx.progress(0, WORLDS.length);
    let nodes = [];

    function play() {
      const world = WORLDS[round];
      nodes.forEach((n) => n.remove()); nodes = [];
      const bg = ctx.scene(world.bg(W));
      const spots = sample(SPOTS, FIND + 1), names = sample(world.names, FIND + 1), targets = names.slice(0, FIND);
      let found = 0, idle = 0;
      const hiders = spots.map(([fx, y], i) => {
        const size = 190, s = ctx.sprite(animal(names[i]), fx * W, y + size * 0.3, size);
        s.name = names[i];
        return s.tap(async () => {
          if (s.out) return;
          idle = 0;
          if (!targets.includes(s.name)) { ctx.sfx('boing'); s.anim('wiggle', 400); return; }
          s.out = true; found++;
          const last = found === FIND;
          ctx.sfx('pop'); ctx.note(found * 2);
          s.z(5); s.el.classList.add('happy');
          await s.glide(s.cx, y - 30, 350);
          ctx.burst(s.cx, y - 40, { n: 10, spread: 150 });
          ctx.say('seek-found', `wd-${s.name}`);
          const chip = bar.chips.get(s.name); chip.classList.add('on'); anim(chip, 'pop', 400);
          ctx.after(1500, () => s.el.classList.remove('happy'));
          if (!last) return;
          round++; ctx.progress(round, WORLDS.length); ctx.sfx('great');
          await ctx.sleep(2200);
          if (round === WORLDS.length) ctx.win(); else play();
        });
      });
      const front = ctx.scene(spots.map(([fx, y], i) => shuffle(world.covers)[0](fx * W, y + 130, 1.05)).join(''));
      const bar = tray(ctx, W / 2, 128, targets.map((n) => ({ key: n, html: animal(n) })), () => {}, { cls: 'seek-bar', select: false });
      nodes = [bg, front, bar.el, ...hiders.map((h) => h.el)];
      ctx.every(1000, () => {
        if (found >= FIND || ++idle < 9) return;
        idle = 0;
        const h = pick(hiders.filter((x) => !x.out && targets.includes(x.name)));
        if (h) { h.anim('wiggle', 600); ctx.burst(h.cx, h.cy - 70, { n: 5, shapes: ['star'], colors: ['#fff36b', '#fff'], spread: 70 }); ctx.sfx('sparkle'); }
      });
    }
    play();
  },
};
