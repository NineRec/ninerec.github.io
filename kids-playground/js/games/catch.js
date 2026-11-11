// 接水果 — fruit falls from the trees. Slide Zoey under it to fill her basket, and let the smelly socks drop.
import { pick, rand, clamp, el } from '../core.js';
import { food, FRUITS } from '../art/food.js';
import { meadow } from '../art/scenes.js';
import { R, E, C, P, e, c, L, tube, shade } from '../art/base.js';
import { host } from './kit.js';

const GOAL = 15;
const sock = () => `<svg viewBox="0 0 100 100">${P('M34 8 h34 v44 q0 10 8 16 q16 12 6 24 q-10 10 -30 2 q-20 -10 -18 -34z', '#9aa7b8')}${R(32, 6, 38, 16, 6, '#ff6fa8')}${L('M36 34 h30 M36 46 h30', 6, '#fff')}${L('M12 30 q-8 -8 0 -16 M90 44 q8 -8 0 -16 M20 62 q-8 -6 -2 -14', 4, '#8fbf4f')}</svg>`;
const basket = () => `<svg viewBox="0 0 160 110">${P('M10 30 h140 l-16 70 q-54 12 -108 0z', '#e0a868')}${L('M26 52 h108 M32 74 h96 M50 34 l8 66 M80 34 v70 M110 34 l-8 66', 5, '#c98a4c')}${R(4, 22, 152, 18, 9, '#c98a4c')}</svg>`;
const canopy = (W) => Array.from({ length: Math.ceil((W + 400) / 110) }, (_, i) => C(-200 + i * 110, 10 + (i % 3) * 14, 92, i % 2 ? '#3fae5a' : '#4fc56a')).join('') +
  Array.from({ length: Math.ceil((W + 400) / 170) }, (_, i) => C(-140 + i * 170, 70 + (i % 2) * 22, 15, i % 3 ? '#ff5a5a' : '#ffb14a')).join('');

export default {
  id: 'catch', name: '接水果', colors: ['#ffe9c9', '#ffc078'], intro: 'catch-intro',
  icon: () => `<svg viewBox="0 0 230 200"><g transform="translate(40 96) scale(.95)">${basket().replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(26 8) scale(.34)">${food('apple').replace(/<\/?svg[^>]*>/g, '')}</g>
    <g transform="translate(132 0) scale(.3)">${food('orange').replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(88 40) scale(.28)">${food('strawberry').replace(/<\/?svg[^>]*>/g, '')}</g>${L('M60 0 v10 M162 -4 v8 M116 30 v8', 5, '#fff')}</svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(meadow(W, 610, { trees: false }));
    const zoey = host(ctx, W / 2, 796, 360);
    const bask = ctx.sprite(basket(), W / 2, 668, 150, 103);
    ctx.scene(canopy(W));
    let x = W / 2, target = W / 2, score = 0, spawn = 0.6, lastOops = 0, over = false;
    const items = [];
    ctx.progress(0, 5);
    ctx.rub((pt) => { target = clamp(pt.x, 90, W - 90); });

    ctx.loop((dt, t) => {
      if (over) return;
      x += (target - x) * Math.min(1, dt * 12);
      zoey.el.style.left = `${x - zoey.el.offsetWidth / 2}px`;
      bask.set(x, 668);
      spawn -= dt;
      if (spawn <= 0) {
        spawn = Math.max(0.5, 1.05 - score * 0.035);
        const bad = Math.random() < 0.2;
        const it = ctx.sprite(bad ? sock() : food(pick(FRUITS), { face: false }), rand(90, W - 90), 60, 86);
        Object.assign(it, { bad, vy: 210 + score * 9 + rand(0, 50), spin: rand(-90, 90), a: 0 });
        it.el.style.pointerEvents = 'none';
        items.push(it);
      }
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.set(it.cx, it.cy + it.vy * dt); it.a += it.spin * dt; it.el.style.transform = `rotate(${it.a}deg)`;
        const caught = it.cy > 610 && it.cy < 690 && Math.abs(it.cx - x) < 82;
        if (caught && it.bad) {
          items.splice(i, 1);
          ctx.sfx('bad'); bask.anim('shake', 350);
          it.vy = 0; it.glide(it.cx + (it.cx < x ? -260 : 260), 760, 500).then(() => it.remove());
          if (t - lastOops > 4) { lastOops = t; ctx.say('catch-oops'); }
        } else if (caught) {
          items.splice(i, 1); it.remove();
          score++; ctx.note(score - 1); ctx.sfx('pop');
          ctx.burst(x, 630, { n: 6, spread: 90, up: 40, size: 26 });
          bask.anim('pop', 220);
          ctx.progress(Math.floor(score / 3), 5);
          if (score % 5 === 0) zoey.hooray(900);
          if (score >= GOAL) {
            over = true;
            items.forEach((q) => q.remove());
            zoey.setPose('cheer');
            ctx.win();
          }
        } else if (it.cy > 760) {
          items.splice(i, 1);
          if (!it.bad) ctx.sfx('drop');
          it.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
          ctx.after(300, () => it.remove());
        }
      }
    });
  },
};
