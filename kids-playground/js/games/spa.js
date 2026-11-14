// 宠物澡堂 — a messy friend needs a bath. Every visit is a little different: muddy with leaves,
// splashed with paint, or sticky with sweets — and the steps change with it (shower or bubbles to pop,
// towel or hair dryer, sometimes a comb). At the end, dress the friend up; everything is fitted per animal.
import { pick, el, rand, dist, anim } from '../core.js';
import { ANIMALS } from '../art/animals.js';
import { food } from '../art/food.js';
import { room } from '../art/scenes.js';
import { R, E, C, P, e, c, p, L, rot, wrap, star, tube } from '../art/base.js';
import { tray } from './kit.js';

/**
 * Where things sit on each friend, in the animal's own 200-box:
 * top = top of the head, eyes = [height, half the distance between them, size], and optional
 * placements for single accessories: [dx, dy, turn, scale] relative to the usual spot.
 */
const FIT = {
  dog:      { top: 28, eyes: [88, 27, 8] },
  cat:      { top: 30, eyes: [88, 27, 8], bow: [0, 10], flower: [4, 8] },
  rabbit:   { top: 30, eyes: [88, 27, 8], crown: [0, 4, 0, 0.8], hat: [0, 6, 0, 0.8], bow: [-8, 22], flower: [8, 16] },
  pig:      { top: 28, eyes: [78, 27, 8], bow: [0, 8], flower: [2, 8] },
  bear:     { top: 28, eyes: [88, 27, 8], bow: [4, 4], flower: [-4, 2] },
  panda:    { top: 28, eyes: [88, 27, 9.5], bow: [4, 4], flower: [-4, 2] },
  fox:      { top: 30, eyes: [84, 27, 8], bow: [-2, 14], flower: [6, 12] },
  unicorn:  { top: 28, eyes: [86, 27, 8], crown: [34, 6, 20, 0.62], hat: [36, 8, 22, 0.66], bow: [2, 12], flower: [84, 6] },
  koala:    { top: 28, eyes: [84, 31, 8], bow: [10, 2], flower: [-12, 0] },
  mouse:    { top: 28, eyes: [88, 27, 8], bow: [8, 0], flower: [-10, -2] },
  lion:     { top: 34, eyes: [88, 22, 7.5], crown: [0, -4, 0, 0.9], hat: [0, -4, 0, 0.9], bow: [-10, 12], flower: [12, 10], specs: 0.86 },
  tiger:    { top: 28, eyes: [88, 27, 8], bow: [4, 4], flower: [-4, 2] },
  monkey:   { top: 28, eyes: [88, 24, 8], bow: [-4, 8], flower: [4, 6] },
  elephant: { top: 30, eyes: [82, 29, 8], bow: [-12, 8], flower: [12, 6], crown: [0, 0, 0, 0.9], hat: [0, 0, 0, 0.9] },
  hippo:    { top: 28, eyes: [68, 31, 7], bow: [-6, 6], flower: [6, 4] },
  sheep:    { top: 30, eyes: [92, 22, 7.5], crown: [0, -2, 0, 0.9], hat: [0, -2, 0, 0.9], bow: [-8, 10], flower: [10, 8], specs: 0.86 },
};
const PETS = Object.keys(FIT);

const at = (place = [], x, y, inner) => { const [dx = 0, dy = 0, turn = 0, s = 1] = place; return `<g transform="translate(${x + dx} ${y + dy}) rotate(${turn}) scale(${s})">${inner}</g>`; };
const WEAR = {
  bow: (f) => at(f.bow, 142, f.top + 2, `<g transform="scale(.5)">${P('M0 0 C-30 -46 -84 -44 -78 0 C-84 44 -30 46 0 0Z', '#ff6fa8')}${P('M0 0 C30 -46 84 -44 78 0 C84 44 30 46 0 0Z', '#ff6fa8')}${R(-17, -20, 34, 40, 12, '#e64f8b')}</g>`),
  crown: (f) => at(f.crown, 100, f.top + 8, P('M-34 0 L-28 -38 L-12 -16 L0 -46 L12 -16 L28 -38 L34 0 Q0 -10 -34 0Z', '#ffc21f') + C(0, -40, 5, '#ff6fa8') + C(-28, -34, 4, '#3fb4ff') + C(28, -34, 4, '#3fb4ff')),
  flower: (f) => at(f.flower, 58, f.top + 8, [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-12" rx="9" ry="11" fill="#ff8fc4" transform="rotate(${a})"/>`).join('') + '<circle r="8" fill="#ffd23f"/>'),
  hat: (f) => at(f.hat, 100, f.top + 6, P('M-42 0 L4 -74 L42 -4Z', '#3fb4ff') + L('M-28 -22 l52 -10 M-16 -42 l34 -8', 8, '#ffe45c') + C(4, -74, 10, '#ff6fa8') + L('M-44 2 Q0 -12 44 -2', 9, '#ff6fa8')),
  glasses: (f) => { const [y, gap, size] = f.eyes, r = (size + 9) * (f.specs || 1);
    return `<g fill="none" stroke="#38334d" stroke-width="5"><circle cx="${100 - gap}" cy="${y}" r="${r}"/><circle cx="${100 + gap}" cy="${y}" r="${r}"/><path d="M${100 - gap + r} ${y} h${2 * (gap - r)} M${100 - gap - r} ${y - 2} l-12 -6 M${100 + gap + r} ${y - 2} l12 -6"/></g>` +
      c(100 - gap, y, r - 2, 'rgba(159,220,255,.3)') + c(100 + gap, y, r - 2, 'rgba(159,220,255,.3)'); },
  scarf: () => P('M60 122 Q100 148 140 122 L138 138 Q100 162 62 138Z', '#4fc56a') + P('M118 142 l10 34 l16 -4 l-8 -34z', '#33a650') + L('M70 134 l4 8 M84 140 l3 9 M100 143 v9 M116 140 l-3 9', 3, '#fff36b'),
};
const HEADWEAR = ['bow', 'crown', 'flower', 'hat'];
const CHIP_VIEW = { scarf: '40 100 120 90', glasses: '36 56 128 64', bow: '98 2 88 56', crown: '56 -22 88 66', flower: '30 8 56 56', hat: '46 -58 108 104' };
const PLAIN = { top: 28, eyes: [88, 27, 8] };

/** A friend wearing things — also used by the picture gallery. */
export const dressed = (name, worn = []) => wrap(ANIMALS[name]() + worn.map((k) => WEAR[k](FIT[name])).join(''));

// ---- what is on the friend ----
const blob = (fill, light) => `<svg viewBox="0 0 100 100"><path d="M50 8 C70 4 92 22 88 44 C98 62 84 90 60 88 C44 100 14 90 14 66 C0 48 16 18 50 8Z" fill="${fill}"/>${c(34, 40, 8, light)}${c(64, 62, 6, light)}</svg>`;
const leafArt = () => `<svg viewBox="0 0 100 100">${P('M12 84 C8 36 40 10 90 14 C92 62 60 92 12 84Z', pick(['#4fc56a', '#9ccc50', '#e0a83c']))}${L('M18 78 C40 56 60 36 82 22', 4, 'rgba(31,26,58,.25)')}</svg>`;
const foam = () => `<svg viewBox="0 0 100 80">${C(30, 46, 26, '#fff')}${C(62, 40, 30, '#fff')}${C(46, 26, 20, '#fff')}${c(24, 38, 6, '#dff4ff')}${c(66, 30, 7, '#dff4ff')}</svg>`;
const wet = () => `<svg viewBox="0 0 40 50"><path d="M20 4 C30 20 34 28 34 34 a14 14 0 0 1 -28 0 C6 28 10 20 20 4Z" fill="#7fd3ff"/>${c(15, 32, 4, '#fff')}</svg>`;
const bubble = () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="rgba(255,255,255,.45)" stroke="#fff" stroke-width="5"/>${e(34, 32, 10, 15, '#fff', 'opacity=".9" transform="rotate(-35 34 32)"')}${c(66, 68, 5, '#fff')}</svg>`;
const tuft = () => `<svg viewBox="0 0 100 100">${L('M20 90 Q30 40 14 14 M50 92 Q52 44 50 8 M80 90 Q70 40 88 16', 9, '#6b6680')}</svg>`;
const TOOL = {
  sponge: `<svg viewBox="0 0 120 100">${R(10, 26, 100, 62, 22, '#ffe45c')}${c(36, 50, 8, '#f0c62e')}${c(70, 64, 10, '#f0c62e')}${c(84, 42, 6, '#f0c62e')}${C(30, 26, 16, '#fff')}${C(56, 18, 20, '#fff')}${C(84, 26, 15, '#fff')}</svg>`,
  shower: `<svg viewBox="0 0 120 120">${tube('M96 108 V50 Q96 20 62 20', '#b6bfd3', 10)}${P('M18 44 Q60 -6 102 44Z', '#3fb4ff')}${R(14, 40, 92, 16, 8, '#1f94e0')}${L('M34 70 v16 M60 72 v22 M86 70 v16', 6, '#9fdcff')}</svg>`,
  towel: `<svg viewBox="0 0 120 110">${R(14, 10, 92, 92, 16, '#ff9ecb')}${R(14, 26, 92, 14, 0, '#fff')}${R(14, 72, 92, 14, 0, '#fff')}${R(60, 10, 46, 92, 16, 'rgba(31,26,58,.07)')}</svg>`,
  dryer: `<svg viewBox="0 0 120 110">${R(52, 50, 26, 54, 10, '#7a5bdb')}${R(20, 14, 86, 50, 24, '#9a7bf5')}${R(4, 24, 24, 30, 6, '#7a5bdb')}${C(72, 39, 13, '#c9b8ff')}${L('M-8 30 h-10 M-8 40 h-14 M-8 50 h-10', 5, '#fff')}</svg>`,
  comb: `<svg viewBox="0 0 120 100">${R(10, 14, 100, 30, 12, '#ff9d2e')}${[20, 34, 48, 62, 76, 90].map((x) => R(x, 40, 8, 44, 4, '#ff9d2e')).join('')}${R(10, 14, 100, 10, 5, '#ffc078')}</svg>`,
};

// ---- three kinds of visit ----
const VISITS = [
  { intro: 'spa-intro', dirt: () => blob('#8a5a36', '#a8744a'), stuck: leafArt, stuckVoice: 'spa-leaf', steps: ['pick', 'sponge', 'shower', 'towel'] },
  { intro: 'spa-paint', dirt: () => { const col = pick(['#ff5a5a', '#3fb4ff', '#ffc21f', '#7ed957', '#9a7bf5']); return blob(col, '#fff'); }, steps: ['sponge', 'shower', 'dryer', 'comb'] },
  { intro: 'spa-sticky', dirt: () => (Math.random() < 0.5 ? blob('#ff8fc4', '#ffc4e0') : blob('#9a6240', '#b98058')), stuck: () => food(pick(['candy', 'lollipop', 'cookie', 'donut']), { face: false }), stuckVoice: 'spa-candy', steps: ['pick', 'sponge', 'bubbles', 'towel', 'comb'] },
];
const VOICE = { sponge: 'spa-soap', shower: 'spa-shower', bubbles: 'spa-bubbles', towel: 'spa-towel', dryer: 'spa-dryer', comb: 'spa-brush' };
let lastVisit = -1, lastPet = '';

function bathroom(W, cx) {
  let out = room(W, '#d6f1ff', '#bfe6fa', '#a9dcec', 650, 'check');
  out += R(W * 0.8 - 90, 90, 180, 170, 26, '#8be4ff') + L(`M${W * 0.8} 96 v158 M${W * 0.8 - 84} 175 h168`, 8, '#fff') +
    R(W * 0.12 - 70, 150, 140, 16, 8, '#ffffff') + R(W * 0.12 - 54, 96, 34, 54, 10, '#ff9ecb') + R(W * 0.12 - 10, 110, 30, 40, 10, '#9be27a') + R(W * 0.12 + 28, 100, 26, 50, 10, '#ffe45c');
  return out + E(cx, 520, 320, 46, '#eaf3fa');
}
const tubFront = (cx) => R(cx - 330, 500, 660, 200, 90, '#ffffff') + R(cx - 350, 486, 700, 44, 22, '#ffffff') + R(cx - 350, 510, 700, 12, 6, '#e3ecf5') + R(cx - 250, 600, 500, 22, 11, '#9fdcff') +
  E(cx - 240, 706, 34, 22, '#ffc21f') + E(cx + 240, 706, 34, 22, '#ffc21f') + [[-200, 500], [-120, 490], [0, 496], [140, 488], [220, 502]].map(([dx, y]) => C(cx + dx, y, 26, '#fff') + C(cx + dx + 30, y + 6, 18, '#eef7ff')).join('');

export default {
  id: 'spa', name: '宠物澡堂', colors: ['#d6f1ff', '#9fdcff'],
  icon: () => `<svg viewBox="0 0 230 200"><g transform="translate(52 0) scale(.62)">${ANIMALS.dog()}</g>${R(26, 112, 178, 70, 34, '#fff')}${R(18, 104, 194, 20, 10, '#fff')}${R(60, 150, 110, 10, 5, '#9fdcff')}
    ${C(44, 100, 16, '#fff')}${C(70, 92, 20, '#eef7ff')}${C(180, 98, 18, '#fff')}${C(156, 90, 14, '#eef7ff')}<circle cx="196" cy="40" r="12" fill="none" stroke="#fff" stroke-width="4"/><circle cx="170" cy="22" r="7" fill="none" stroke="#fff" stroke-width="3"/></svg>`,

  start(ctx) {
    const { W } = ctx;
    const cx = W * 0.44, cy = 366, worn = new Set();
    let name = pick(PETS); while (name === lastPet) name = pick(PETS);
    let which = Math.floor(Math.random() * VISITS.length); while (which === lastVisit) which = Math.floor(Math.random() * VISITS.length);
    lastPet = name; lastVisit = which;
    const visit = VISITS[which], steps = visit.steps;
    ctx.stage.dataset.visit = which;
    ctx.scene(bathroom(W, cx));
    const pet = ctx.sprite('', cx, cy, 400, 407);
    const drawPet = () => pet.html(dressed(name, [...worn]));
    pet.el.classList.add('still-head');   // what the friend wears must not slide while the head sways
    drawPet();
    const onPet = ctx.add(el('div', { class: 'layer' }));
    ctx.scene(tubFront(cx));
    let spots = 0;
    const spot = (near = 1) => { const a = (spots++ * 2.4) % 6.283, r = rand(90, 150) * near; return { x: cx + Math.cos(a) * r * 0.95, y: cy - 30 + Math.sin(a) * r * 0.8 }; };
    const put = (html, size, turn = true) => { const q = spot(); const s = ctx.sprite(html, q.x, q.y, size); onPet.append(s.el); if (turn) s.el.style.transform = `rotate(${rand(-40, 40)}deg)`; return s; };
    const passive = (s) => { s.el.style.pointerEvents = 'none'; return s; };

    let index = -1, foams = [], drops = [], tufts = [], lastSpawn = 0;
    const dirt = Array.from({ length: 6 }, () => { const m = passive(put(visit.dirt(), rand(56, 84))); m.hp = 1; return m; });
    const total = steps.length + 1;
    ctx.progress(0, total);

    // the tools this visit needs, in the order they are used
    const tools = {};
    steps.filter((k) => TOOL[k]).forEach((k, i, list) => {
      const t = ctx.sprite(TOOL[k], W - 120, 400 + (i - (list.length - 1) / 2) * 150, 130, 120, 'tool shadowed');
      t.el.classList.add('off');
      t.el.dataset.tool = k;
      tools[k] = ctx.drag(t, { enabled: () => steps[index] === k, move: (s) => use(k, s), end: (s) => s.goHome() });
    });

    function say(step) {
      const key = step === 'pick' ? visit.stuckVoice : step === 'dress' ? 'spa-dress' : VOICE[step];
      ctx.help = () => ctx.say(key);
      return key;
    }

    function next() {
      index += 1;
      const step = steps[index] || 'dress';
      ctx.progress(index, total);
      if (index > 0) { ctx.sfx('great'); ctx.burst(cx, cy - 60, { n: 10, spread: 220 }); }
      Object.entries(tools).forEach(([k, t]) => { t.el.classList.toggle('off', k !== step); t.el.classList.toggle('pulse', k === step); });
      ctx.after(index ? 500 : 2600, () => ctx.say(say(step)));
      if (step === 'pick') {
        const stuck = Array.from({ length: 4 }, () => {
          const s = put(visit.stuck(), 66);
          s.el.classList.add('pulse');
          return s.tap(() => {
            if (s.gone) return;
            s.gone = true; ctx.sfx('pop'); ctx.note(stuck.filter((x) => x.gone).length);
            s.el.classList.remove('pulse');
            s.glide(s.cx + rand(-200, 200), -120, 600, 'ease-in').then(() => s.remove());
            if (stuck.every((x) => x.gone)) next();
          });
        });
      } else if (step === 'bubbles') {
        // the foam gathers into big bubbles to pop
        foams.forEach((f) => { f.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }); ctx.after(300, () => f.remove()); });
        foams = [];
        const bubbles = Array.from({ length: 8 }, (_, i) => {
          const b = ctx.sprite(bubble(), cx + (i - 3.5) * 62 + rand(-14, 14), cy - 140 + ((i * 53) % 190), rand(84, 108));
          onPet.append(b.el); b.el.classList.add('float'); b.el.style.animationDelay = `${-i * 0.4}s`; b.anim('in', 300);
          return b.tap(() => {
            if (b.gone) return;
            b.gone = true; ctx.sfx('pop'); ctx.note(bubbles.filter((x) => x.gone).length);
            ctx.burst(b.cx, b.cy, { n: 6, shapes: ['drop', 'dot'], colors: ['#fff', '#9fdcff'], spread: 80, size: 24 });
            b.remove();
            if (bubbles.every((x) => x.gone)) next();
          });
        });
      } else if (step === 'towel' || step === 'dryer') {
        drops = Array.from({ length: 9 }, () => { const d = passive(put(wet(), 44, false)); d.anim('in', 300); return d; });
      } else if (step === 'comb') {
        // fur sticking out around the head
        tufts = Array.from({ length: 7 }, (_, i) => {
          const a = Math.PI * (1.08 + i * 0.14), t = passive(ctx.sprite(tuft(), cx + Math.cos(a) * 128, cy - 60 + Math.sin(a) * 118, 56));
          onPet.append(t.el); t.el.style.transform = `rotate(${(a * 180) / Math.PI + 90}deg)`; t.anim('in', 300);
          return t;
        });
      } else if (step === 'dress') dress();
    }

    function use(kind, tool) {
      if (kind !== steps[index]) return;
      const x = tool.cx, y = tool.cy, now = performance.now();
      const near = Math.abs(x - cx) < 210 && y > cy - 230 && y < cy + 150;
      const clear = (list, radius, fx) => list.filter((s) => {
        if (dist(s.cx, s.cy, x, y) > radius) return true;
        fx(s); return false;
      });
      if (kind === 'sponge' && near) {
        for (const m of dirt) if (m.hp > 0 && dist(m.cx, m.cy, x, y) < 90) { m.hp -= 0.07; m.el.style.opacity = Math.max(0, m.hp); }
        if (now - lastSpawn > 110 && foams.length < 26) {
          lastSpawn = now; ctx.sfx('bubble');
          const f = passive(ctx.sprite(foam(), x + rand(-30, 30), Math.min(y + rand(-20, 30), cy + 90), rand(70, 110), 80));
          onPet.append(f.el); f.anim('in', 250); foams.push(f);
        }
        if (dirt.every((m) => m.hp <= 0) && foams.length >= 14) next();
      } else if (kind === 'shower' && Math.abs(x - cx) < 260) {
        if (now - lastSpawn > 90) { lastSpawn = now; ctx.sfx('water'); ctx.burst(x - 20 + rand(-30, 30), y + 60, { n: 3, shapes: ['drop'], spread: 30, up: -160, size: 26, ms: 600 }); }
        foams = foams.filter((f) => {
          if (Math.abs(f.cx - x) > 80) return true;
          f.el.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(80px)' }], { duration: 400, fill: 'forwards' });
          ctx.after(400, () => f.remove());
          return false;
        });
        if (!foams.length) next();
      } else if (kind === 'towel' && near) {
        if (now - lastSpawn > 150) { lastSpawn = now; ctx.sfx('brush'); }
        drops = clear(drops, 100, (d) => { d.remove(); ctx.burst(d.cx, d.cy, { n: 2, shapes: ['star'], colors: ['#fff', '#fff36b'], spread: 50, size: 24, ms: 500 }); });
        if (!drops.length) next();
      } else if (kind === 'dryer' && near) {
        if (now - lastSpawn > 120) { lastSpawn = now; ctx.sfx('whoosh'); ctx.burst(x - 70, y, { n: 2, shapes: ['dot'], colors: ['#fff'], spread: 40, size: 16, ms: 400 }); }
        // the warm air blows the drops off to the side
        drops = clear(drops, 130, (d) => { d.glide(d.cx - rand(160, 260), d.cy - rand(20, 80), 420, 'ease-out').then(() => d.remove()); d.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, fill: 'forwards' }); });
        if (!drops.length) next();
      } else if (kind === 'comb' && near) {
        if (now - lastSpawn > 150) { lastSpawn = now; ctx.sfx('brush'); }
        tufts = clear(tufts, 90, (t) => { t.remove(); ctx.burst(t.cx, t.cy, { n: 3, shapes: ['star'], colors: ['#fff', '#fff36b', '#ff8fc4'], spread: 50, size: 24, ms: 500 }); });
        if (!tufts.length) next();
      }
    }

    function dress() {
      Object.values(tools).forEach((t) => t.remove());
      pet.el.classList.add('happy');
      ctx.after(1600, () => pet.el.classList.remove('happy'));
      const keys = Object.keys(WEAR);
      const picks = tray(ctx, W - 130, 360, keys.map((k) => ({ key: k, html: `<svg viewBox="${CHIP_VIEW[k]}">${WEAR[k](PLAIN)}</svg>` })), (item) => {
        const on = !worn.has(item.key);
        if (on && HEADWEAR.includes(item.key)) HEADWEAR.forEach((k) => worn.delete(k));
        if (on) worn.add(item.key); else worn.delete(item.key);
        keys.forEach((k) => picks.chips.get(k).classList.toggle('on', worn.has(k)));
        drawPet(); pet.anim('pop', 300); ctx.sfx(on ? 'sparkle' : 'drop');
      }, { width: 210, select: false });
      ctx.button('check', W - 130, 716, 'green', '完成', () => {
        picks.el.remove();
        ctx.progress(total, total);
        pet.el.classList.add('happy'); ctx.sfx('great');
        ctx.burst(cx, cy - 80, { n: 20, shapes: ['heart', 'star'], spread: 320, size: 42 });
        ctx.win({ voice: 'spa-done', delay: 1300 });
      });
    }

    ctx.after(350, () => ctx.say(visit.intro));
    next();
  },
};
