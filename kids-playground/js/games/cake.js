// 蛋糕店 — bake a birthday cake in four steps: choose it, spread the cream, decorate, then candles to blow out.
import { pick, sample, el, anim, rand } from '../core.js';
import { animal } from '../art/animals.js';
import { food } from '../art/food.js';
import { room } from '../art/scenes.js';
import { R, E, C, P, e, c, p, L, shade, star, heartPath, nextId, sparkle } from '../art/base.js';
import { tray } from './kit.js';

const FLAVORS = ['#ffe2a0', '#9a6240', '#ffb3cf', '#bfe38f'];
const CREAMS = ['#ffffff', '#ff9ecb', '#9fdcff', '#fff0a0', '#7a4a2c', '#a8ecc8'];
const CANDLES = ['#ff6fa8', '#3fb4ff', '#ffc21f', '#9a7bf5'];
const WIDTHS = [380, 290, 200], TH = 104, BASE = 610;
const TOPPINGS = ['strawberry', 'cherry', 'blueberry', 'candy', 'cookie', 'star', 'heart', 'flower'];
const toppingArt = (k) => k === 'star' ? `<svg viewBox="-30 -30 60 60">${star(0, 0, 26, '#ffc21f')}</svg>`
  : k === 'heart' ? `<svg viewBox="-30 -30 60 60"><path d="${heartPath(0, 0, 19)}" fill="#ff5c8a"/></svg>`
    : k === 'flower' ? `<svg viewBox="-30 -30 60 60">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-14" rx="10" ry="13" fill="#b79cff" transform="rotate(${a})"/>`).join('')}<circle r="9" fill="#ffd23f"/></svg>`
      : food(k, { face: false });

/** The cake in its own 440×450 box; (220, 410) is the middle of the plate. */
function cakeSvg(s) {
  let out = E(220, 418, 215, 20, '#ffffff') + e(220, 414, 190, 12, '#eef1f7') + R(200, 420, 40, 26, 8, '#e3e7f0') + E(220, 446, 80, 10, '#e3e7f0');
  for (let i = 0; i < s.tiers; i++) {
    const w = WIDTHS[i], x = 220 - w / 2, y = 410 - (i + 1) * TH;
    out += R(x, y, w, TH + (i ? 20 : 0), 22, s.flavor) + R(x, y + TH * 0.52, w, 10, 5, shade(s.flavor, 0.35)) + R(x + w * 0.7, y, w * 0.3, TH + (i ? 20 : 0), 22, 'rgba(31,26,58,.05)');
    const pr = s.cream[i];
    if (pr > 0) {
      const id = nextId();
      let cream = R(x - 6, y - 8, w + 12, 40, 20, s.creamColor);
      for (let k = 0, dx = x + 6; dx < x + w - 26; k++, dx += 44) cream += R(dx, y + 12, 28, 22 + ((k * 37) % 30), 14, s.creamColor);
      out += `<clipPath id="${id}"><rect x="${x - 10}" y="${y - 20}" width="${(w + 20) * pr}" height="${TH + 20}"/></clipPath><g clip-path="url(#${id})">${cream}${e(x + w * 0.3, y, w * 0.18, 5, '#fff', 'opacity=".5"')}</g>`;
    }
  }
  return `<svg viewBox="0 0 440 460">${out}</svg>`;
}
const candle = (col, lit) => `<svg viewBox="0 0 40 110">${R(13, 40, 14, 66, 6, col)}${L('M13 56 l14 -8 M13 74 l14 -8 M13 92 l14 -8', 4, 'rgba(255,255,255,.6)')}${L('M20 40 v-8', 3)}` +
  (lit ? `<g class="flame"><path d="M20 4 C30 18 30 32 20 34 C10 32 10 18 20 4Z" fill="#ff9d2e"/><path d="M20 16 C25 24 25 31 20 32 C15 31 15 24 20 16Z" fill="#fff36b"/></g>` : `<circle class="smoke" cx="20" cy="22" r="6" fill="#d9d6e3"/>`) + `</svg>`;

function bakery(W) {
  let out = room(W, '#fff0d6', '#ffe2b3', '#e9b98a', 660, 'check');
  for (const x of [W * 0.14, W * 0.86]) out += R(x - 90, 170, 180, 16, 8, '#c98a5c') + R(x - 70, 110, 44, 60, 12, '#ff9ecb') + R(x - 14, 96, 44, 74, 12, '#9fdcff') + R(x + 38, 120, 34, 50, 10, '#ffe45c');
  out += Array.from({ length: 9 }, (_, i) => `<path d="M${W / 2 - 360 + i * 80} 40 h80 l-40 54z" fill="${['#ff9ecb', '#ffe45c', '#9fdcff', '#b79cff', '#9be27a'][i % 5]}"/>`).join('');
  return out + R(W * 0.42 - 330, 650, 660, 34, 17, '#c98a5c') + R(W * 0.42 - 290, 684, 580, 200, 0, '#b3764a');
}

export default {
  id: 'cake', name: '蛋糕店', colors: ['#fff3c9', '#ffd38a'], intro: 'cake-intro',
  icon: () => `<svg viewBox="0 20 440 440">${cakeSvg({ tiers: 2, flavor: '#ffe2a0', cream: [1, 1, 0], creamColor: '#ff9ecb' }).replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(200 110)">${candle('#3fb4ff', true).replace(/<\/?svg[^>]*>/g, '')}</g>
    <g transform="translate(120 250) scale(.3)">${food('strawberry', { face: false }).replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(260 250) scale(.3)">${food('strawberry', { face: false }).replace(/<\/?svg[^>]*>/g, '')}</g></svg>`,

  start(ctx) {
    const { W } = ctx;
    const cx = W * 0.42;
    ctx.scene(bakery(W));
    const s = { tiers: 2, flavor: FLAVORS[0], cream: [0, 0, 0], creamColor: CREAMS[1] };
    const cake = ctx.sprite('', cx, 430, 440, 460);
    const draw = () => cake.html(cakeSvg(s));
    draw();
    const topY = () => BASE - s.tiers * TH;
    let step = 0, panel = [], candles = [], placed = [], lastFx = 0;
    ctx.progress(0, 4);
    const clearPanel = () => { panel.forEach((x) => (x.el || x).remove()); panel = []; };
    const px = Math.min(W - 150, cx + 420);

    const STEPS = [
      () => {
        const sizes = tray(ctx, px, 250, [1, 2, 3].map((n) => ({ key: n, html: `<svg viewBox="0 ${330 - n * 104} 440 ${n * 104 + 120}">${cakeSvg({ tiers: n, flavor: s.flavor, cream: [0, 0, 0] }).replace(/<\/?svg[^>]*>/g, '')}</svg>` })),
          (item) => { s.tiers = item.key; draw(); ctx.sfx('pop'); cake.anim('pop', 300); }, { width: 130, cls: 'cake-side' });
        sizes.select(s.tiers);
        const flav = tray(ctx, px, 560, FLAVORS.map((col) => ({ key: col, color: col })), (item) => { s.flavor = item.key; draw(); ctx.sfx('tap'); cake.anim('pop', 300); }, { width: 190 });
        flav.select(s.flavor);
        panel = [sizes, flav];
      },
      () => {
        const colors = tray(ctx, px, 380, CREAMS.map((col) => ({ key: col, color: col })), (item) => { s.creamColor = item.key; draw(); ctx.sfx('tap'); }, { width: 190 });
        colors.select(s.creamColor);
        panel = [colors];
      },
      () => {
        const back = ctx.add(el('div', { class: 'tray cake-toppings', style: { left: `${px - 100}px`, top: '150px', width: '200px', height: '470px' } }));
        panel = [back];
        TOPPINGS.forEach((k, i) => {
          const src = ctx.sprite(toppingArt(k), px - 46 + (i % 2) * 92, 212 + Math.floor(i / 2) * 112, 76);
          panel.push(src);
          ctx.drag(src, {
            end: () => {
              const onCake = Math.abs(src.cx - cx) < 215 && src.cy > topY() - 50 && src.cy < BASE + 10;
              if (onCake && placed.length < 40) {
                const t = ctx.sprite(toppingArt(k), src.cx, src.cy, 62);
                t.el.style.pointerEvents = 'none'; t.anim('in', 280); placed.push(t);
                ctx.sfx('pop'); ctx.burst(src.cx, src.cy, { n: 4, spread: 60, size: 22 });
              } else ctx.sfx('drop');
              src.set(src.home.cx, src.home.cy); src.anim('in', 220);
            },
          });
        });
      },
      () => {
        const picks = tray(ctx, px, 380, CANDLES.map((col) => ({ key: col, html: candle(col, true) })), (item) => {
          if (candles.length >= 5) { ctx.sfx('bad'); return; }
          const sp = ctx.sprite(candle(item.key, true), 0, topY() - 44, 44, 121);
          sp.col = item.key; sp.lit = true; candles.push(sp);
          const w = WIDTHS[s.tiers - 1] - 70;
          candles.forEach((cd, i) => cd.set(cx + (candles.length === 1 ? 0 : (i / (candles.length - 1) - 0.5) * w), topY() - 44));
          sp.anim('in', 300); ctx.sfx('pop'); ctx.note(candles.length);
        }, { width: 190, select: false });
        panel = [picks];
      },
    ];
    const VOICE = [null, 'cake-cream', 'cake-top', 'cake-candle'];

    ctx.rub((pt) => {
      if (step !== 1 || Math.abs(pt.x - cx) > 230) return;
      const i = Math.floor((BASE - pt.y) / TH);
      if (i < 0 || i >= s.tiers || s.cream[i] >= 1) return;
      const before = s.cream[i];
      s.cream[i] = Math.min(1, before + 0.035);
      draw();
      const now = performance.now();
      if (now - lastFx > 140) { lastFx = now; ctx.sfx('brush'); ctx.burst(pt.x, pt.y, { n: 1, shapes: ['dot'], colors: [s.creamColor, '#fff'], spread: 40, size: 20, ms: 450 }); }
      if (s.cream[i] >= 1) { ctx.sfx('sparkle'); ctx.burst(cx, BASE - (i + 0.5) * TH, { n: 10, spread: 200 }); }
    });

    const next = ctx.button('next', W - 90, 716, 'green', '下一步', async () => {
      if (step === 1 && s.cream.slice(0, s.tiers).some((v) => v < 0.5)) { ctx.sfx('bad'); ctx.say('cake-cream'); cake.anim('wiggle', 400); return; }
      if (step === 3) {
        if (!candles.length) { ctx.sfx('bad'); ctx.say('cake-candle'); return; }
        clearPanel(); next.remove(); ctx.progress(4, 4);
        ctx.say('cake-blow');
        candles.forEach((cd) => { cd.el.classList.add('pulse'); cd.tap(async () => {
          if (!cd.lit) return;
          cd.lit = false; cd.el.classList.remove('pulse'); cd.html(candle(cd.col, false)); ctx.sfx('puff');
          if (candles.some((x) => x.lit)) return;
          await ctx.sleep(500);
          sample(['rabbit', 'cat', 'bear', 'panda', 'pig', 'unicorn', 'dog'], 3).forEach((name, i) => {
            const g = ctx.sprite(animal(name), [cx - 330, cx + 330, W - 150][i], 900, 230);
            g.el.classList.add('happy'); g.glide(g.cx, 610, 500 + i * 120);
          });
          ctx.sfx('great');
          ctx.win({ voice: 'cake-done', delay: 1500 });
        }); });
        return;
      }
      step++; ctx.progress(step, 4); clearPanel(); STEPS[step](); ctx.say(VOICE[step]); ctx.sfx('whoosh');
      ctx.help = () => ctx.say(VOICE[step]);
    });
    STEPS[0]();
  },
};
