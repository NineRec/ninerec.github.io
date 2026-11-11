// 宠物澡堂 — a muddy friend needs a bath: pick off the leaves, scrub with soap, rinse, dry, then dress up.
import { pick, el, rand, dist, anim } from '../core.js';
import { ANIMALS } from '../art/animals.js';
import { room } from '../art/scenes.js';
import { R, E, C, P, e, c, p, L, rot, wrap, star, heartPath, shade, tube } from '../art/base.js';
import { tray } from './kit.js';

const PETS = ['dog', 'cat', 'rabbit', 'pig', 'bear', 'panda', 'fox', 'unicorn', 'koala', 'mouse'];
const ACC = {
  bow: `<g transform="translate(142 30) scale(.5)">${P('M0 0 C-30 -46 -84 -44 -78 0 C-84 44 -30 46 0 0Z', '#ff6fa8')}${P('M0 0 C30 -46 84 -44 78 0 C84 44 30 46 0 0Z', '#ff6fa8')}${R(-17, -20, 34, 40, 12, '#e64f8b')}</g>`,
  crown: P('M66 36 L72 -2 L88 20 L100 -10 L112 20 L128 -2 L134 36 Q100 26 66 36Z', '#ffc21f') + C(100, -4, 5, '#ff6fa8') + C(72, 2, 4, '#3fb4ff') + C(128, 2, 4, '#3fb4ff'),
  flower: `<g transform="translate(58 36)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-12" rx="9" ry="11" fill="#ff8fc4" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#ffd23f"/></g>`,
  hat: P('M58 34 L104 -40 L142 30Z', '#3fb4ff') + L('M72 12 l52 -10 M84 -8 l34 -8', 8, '#ffe45c') + C(104, -40, 10, '#ff6fa8') + L('M56 36 Q100 22 144 32', 9, '#ff6fa8'),
  glasses: `<g fill="none" stroke="#38334d" stroke-width="5">${'<circle cx="73" cy="88" r="17"/><circle cx="127" cy="88" r="17"/><path d="M90 88 h20 M56 86 l-14 -6 M144 86 l14 -6"/>'}</g>` + c(73, 88, 15, 'rgba(159,220,255,.35)') + c(127, 88, 15, 'rgba(159,220,255,.35)'),
  scarf: P('M60 122 Q100 148 140 122 L138 138 Q100 162 62 138Z', '#4fc56a') + P('M118 142 l10 34 l16 -4 l-8 -34z', '#33a650') + L('M70 134 l4 8 M84 140 l3 9 M100 143 v9 M116 140 l-3 9', 3, '#fff36b'),
};
const mud = () => `<svg viewBox="0 0 100 100"><path d="M50 8 C70 4 92 22 88 44 C98 62 84 90 60 88 C44 100 14 90 14 66 C0 48 16 18 50 8Z" fill="#8a5a36"/>${c(34, 40, 8, '#a8744a')}${c(64, 62, 6, '#a8744a')}</svg>`;
const leafArt = () => `<svg viewBox="0 0 100 100">${P('M12 84 C8 36 40 10 90 14 C92 62 60 92 12 84Z', pick(['#4fc56a', '#9ccc50', '#e0a83c']))}${L('M18 78 C40 56 60 36 82 22', 4, 'rgba(31,26,58,.25)')}</svg>`;
const foam = () => `<svg viewBox="0 0 100 80">${C(30, 46, 26, '#fff')}${C(62, 40, 30, '#fff')}${C(46, 26, 20, '#fff')}${c(24, 38, 6, '#dff4ff')}${c(66, 30, 7, '#dff4ff')}</svg>`;
const wet = () => `<svg viewBox="0 0 40 50"><path d="M20 4 C30 20 34 28 34 34 a14 14 0 0 1 -28 0 C6 28 10 20 20 4Z" fill="#7fd3ff"/>${c(15, 32, 4, '#fff')}</svg>`;
const TOOL = {
  sponge: `<svg viewBox="0 0 120 100">${R(10, 26, 100, 62, 22, '#ffe45c')}${c(36, 50, 8, '#f0c62e')}${c(70, 64, 10, '#f0c62e')}${c(84, 42, 6, '#f0c62e')}${C(30, 26, 16, '#fff')}${C(56, 18, 20, '#fff')}${C(84, 26, 15, '#fff')}</svg>`,
  shower: `<svg viewBox="0 0 120 120">${tube('M96 108 V50 Q96 20 62 20', '#b6bfd3', 10)}${P('M18 44 Q60 -6 102 44Z', '#3fb4ff')}${R(14, 40, 92, 16, 8, '#1f94e0')}${L('M34 70 v16 M60 72 v22 M86 70 v16', 6, '#9fdcff')}</svg>`,
  towel: `<svg viewBox="0 0 120 110">${R(14, 10, 92, 92, 16, '#ff9ecb')}${R(14, 26, 92, 14, 0, '#fff')}${R(14, 72, 92, 14, 0, '#fff')}${R(60, 10, 46, 92, 16, 'rgba(31,26,58,.07)')}</svg>`,
};

function bathroom(W, cx) {
  let out = room(W, '#d6f1ff', '#bfe6fa', '#a9dcec', 650, 'check');
  out += R(W * 0.82 - 90, 90, 180, 170, 26, '#8be4ff') + R(W * 0.82 - 90, 90, 180, 170, 26, 'none') + L(`M${W * 0.82} 96 v158 M${W * 0.82 - 84} 175 h168`, 8, '#fff') +
    R(W * 0.12 - 70, 150, 140, 16, 8, '#ffffff') + R(W * 0.12 - 54, 96, 34, 54, 10, '#ff9ecb') + R(W * 0.12 - 10, 110, 30, 40, 10, '#9be27a') + R(W * 0.12 + 28, 100, 26, 50, 10, '#ffe45c');
  out += E(cx, 520, 320, 46, '#eaf3fa');
  return out;
}
const tubFront = (cx) => R(cx - 330, 500, 660, 200, 90, '#ffffff') + R(cx - 350, 486, 700, 44, 22, '#ffffff') + R(cx - 350, 510, 700, 12, 6, '#e3ecf5') + R(cx - 250, 600, 500, 22, 11, '#9fdcff') +
  E(cx - 240, 706, 34, 22, '#ffc21f') + E(cx + 240, 706, 34, 22, '#ffc21f') + [[-200, 500], [-120, 490], [0, 496], [140, 488], [220, 502]].map(([dx, y]) => C(cx + dx, y, 26, '#fff') + C(cx + dx + 30, y + 6, 18, '#eef7ff')).join('');

export default {
  id: 'spa', name: '宠物澡堂', colors: ['#d6f1ff', '#9fdcff'], intro: 'spa-intro',
  icon: () => `<svg viewBox="0 0 230 200"><g transform="translate(52 0) scale(.62)">${ANIMALS.dog()}</g>${R(26, 112, 178, 70, 34, '#fff')}${R(18, 104, 194, 20, 10, '#fff')}${R(60, 150, 110, 10, 5, '#9fdcff')}
    ${C(44, 100, 16, '#fff')}${C(70, 92, 20, '#eef7ff')}${C(180, 98, 18, '#fff')}${C(156, 90, 14, '#eef7ff')}<circle cx="196" cy="40" r="12" fill="none" stroke="#fff" stroke-width="4"/><circle cx="170" cy="22" r="7" fill="none" stroke="#fff" stroke-width="3"/></svg>`,

  start(ctx) {
    const { W } = ctx;
    const cx = W * 0.44, cy = 400, name = pick(PETS), worn = new Set();
    ctx.scene(bathroom(W, cx));
    const pet = ctx.sprite('', cx, cy, 400, 407);
    const drawPet = () => pet.html(wrap(ANIMALS[name]() + [...worn].map((k) => ACC[k]).join('')));
    drawPet();
    const onPet = ctx.add(el('div', { class: 'layer' }));
    ctx.scene(tubFront(cx));
    let spots = 0;
    const spot = () => { const a = (spots++ * 2.4) % 6.283, r = rand(90, 150); return { x: cx + Math.cos(a) * r * 0.95, y: cy - 30 + Math.sin(a) * r * 0.8 }; };
    const put = (html, size, cls) => { const q = spot(); const s = ctx.sprite(html, q.x, q.y, size, size, cls); onPet.append(s.el); s.el.style.transform = `rotate(${rand(-40, 40)}deg)`; return s; };

    let step = 0, foams = [], drops = [], lastSpawn = 0;
    const muds = Array.from({ length: 6 }, () => { const m = put(mud(), rand(56, 84)); m.hp = 1; m.el.style.pointerEvents = 'none'; return m; });
    let leaves = Array.from({ length: 4 }, () => {
      const l = put(leafArt(), 66);
      return l.tap(() => {
        if (l.gone) return;
        l.gone = true; ctx.sfx('pop'); ctx.note(4 - leaves.filter((x) => !x.gone).length);
        l.glide(l.cx + rand(-200, 200), -120, 600, 'ease-in').then(() => l.remove());
        if (leaves.every((x) => x.gone)) goto(1);
      });
    });
    leaves.forEach((l) => l.el.classList.add('pulse'));
    ctx.progress(0, 5);

    const tools = {};
    ['sponge', 'shower', 'towel'].forEach((k, i) => {
      const t = ctx.sprite(TOOL[k], W - 120, 230 + i * 160, 130, 120, 'tool shadowed');
      t.el.classList.add('off');
      tools[k] = ctx.drag(t, { enabled: () => step === i + 1, move: (s, pt) => use(k, s), end: (s) => s.goHome() });
    });
    const VOICE = ['spa-leaf', 'spa-soap', 'spa-shower', 'spa-towel', 'spa-dress'];
    function goto(n) {
      step = n; ctx.progress(n, 5); ctx.sfx('great'); ctx.burst(cx, cy - 60, { n: 10, spread: 220 });
      Object.values(tools).forEach((t, i) => { t.el.classList.toggle('off', i + 1 !== n); t.el.classList.toggle('pulse', i + 1 === n); });
      ctx.after(500, () => ctx.say(VOICE[n]));
      ctx.help = () => ctx.say(VOICE[n]);
      if (n === 3) drops = Array.from({ length: 9 }, () => { const d = put(wet(), 44); d.el.style.transform = ''; d.el.style.pointerEvents = 'none'; d.anim('in', 300); return d; });
      if (n === 4) dress();
    }

    function use(kind, tool) {
      if (kind !== ['', 'sponge', 'shower', 'towel'][step]) return;
      const x = tool.cx, y = tool.cy, now = performance.now();
      const near = Math.abs(x - cx) < 210 && y > cy - 230 && y < cy + 150;
      if (kind === 'sponge' && near) {
        for (const m of muds) if (m.hp > 0 && dist(m.cx, m.cy, x, y) < 90) { m.hp -= 0.07; m.el.style.opacity = Math.max(0, m.hp); }
        if (now - lastSpawn > 110 && foams.length < 26) {
          lastSpawn = now; ctx.sfx('bubble');
          const f = ctx.sprite(foam(), x + rand(-30, 30), Math.min(y + rand(-20, 30), cy + 90), rand(70, 110), 80);
          onPet.append(f.el); f.el.style.pointerEvents = 'none'; f.anim('in', 250); foams.push(f);
        }
        if (muds.every((m) => m.hp <= 0) && foams.length >= 14) goto(2);
      } else if (kind === 'shower' && Math.abs(x - cx) < 260) {
        if (now - lastSpawn > 90) { lastSpawn = now; ctx.sfx('water'); ctx.burst(x - 20 + rand(-30, 30), y + 60, { n: 3, shapes: ['drop'], spread: 30, up: -160, size: 26, ms: 600 }); }
        foams = foams.filter((f) => {
          if (Math.abs(f.cx - x) > 80) return true;
          f.el.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(80px)' }], { duration: 400, fill: 'forwards' });
          ctx.after(400, () => f.remove());
          return false;
        });
        if (!foams.length) goto(3);
      } else if (kind === 'towel' && near) {
        if (now - lastSpawn > 150) { lastSpawn = now; ctx.sfx('brush'); }
        drops = drops.filter((d) => {
          if (dist(d.cx, d.cy, x, y) > 100) return true;
          d.remove(); ctx.burst(d.cx, d.cy, { n: 2, shapes: ['star'], colors: ['#fff', '#fff36b'], spread: 50, size: 24, ms: 500 });
          return false;
        });
        if (!drops.length) goto(4);
      }
    }

    function dress() {
      Object.values(tools).forEach((t) => t.remove());
      pet.el.classList.add('happy');
      ctx.after(1600, () => pet.el.classList.remove('happy'));
      const keys = Object.keys(ACC);
      const picks = tray(ctx, W - 130, 360, keys.map((k) => ({ key: k, html: `<svg viewBox="${{ scarf: '40 100 120 90', glasses: '36 56 128 64', bow: '98 2 88 56', crown: '56 -22 88 66', flower: '30 8 56 56', hat: '46 -58 108 104' }[k]}">${ACC[k]}</svg>` })), (item, chip) => {
        const on = !worn.has(item.key);
        if (on) { for (const k of ['bow', 'crown', 'flower', 'hat']) if (['bow', 'crown', 'flower', 'hat'].includes(item.key)) worn.delete(k); worn.add(item.key); } else worn.delete(item.key);
        keys.forEach((k) => picks.chips.get(k).classList.toggle('on', worn.has(k)));
        drawPet(); pet.anim('pop', 300); ctx.sfx(on ? 'sparkle' : 'drop');
      }, { width: 210, select: false });
      ctx.button('check', W - 130, 716, 'green', '完成', () => {
        picks.el.remove();
        pet.el.classList.add('happy'); ctx.sfx('great');
        ctx.burst(cx, cy - 80, { n: 20, shapes: ['heart', 'star'], spread: 320, size: 42 });
        ctx.win({ voice: 'spa-done', delay: 1300 });
      });
    }
    ctx.after(2600, () => ctx.say('spa-leaf'));
  },
};
