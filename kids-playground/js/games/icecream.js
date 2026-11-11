// 冰淇淋店 — animal customers order an ice cream; build it bottom-up exactly like the picture, then ring the bell.
import { pick, sample, shuffle, el } from '../core.js';
import { animal, animalG } from '../art/animals.js';
import { room, band } from '../art/scenes.js';
import { INK, C, P, R, E, e, c, L, tube, rot, insidePath } from '../art/base.js';
import { bubble, tray, host } from './kit.js';

const FLAVORS = { vanilla: '#fff3c4', chocolate: '#9a6240', strawberry: '#ff9ec0', mint: '#a8ecc8', blueberry: '#a6a2f7', mango: '#ffc04d' };
const TOPS = ['cherry', 'sprinkles', 'wafer'];
const CUSTOMERS = ['rabbit', 'cat', 'bear', 'panda', 'fox', 'pig', 'koala', 'penguin', 'unicorn', 'monkey', 'elephant', 'tiger', 'mouse', 'dog'];
const ORDERS = [{ scoops: 1 }, { scoops: 2 }, { scoops: 2, top: true }, { scoops: 3, top: true }];

const scoop = (cx, cy, flavor) => {
  const d = `M${cx - 54} ${cy + 8} q8 22 20 8 q10 18 22 4 q12 18 24 2 q12 16 22 -2 q10 10 20 -12 A54 52 0 1 0 ${cx - 54} ${cy + 8}Z`;
  let out = P(d, FLAVORS[flavor]) + e(cx - 22, cy - 26, 9, 14, '#fff', `opacity=".5" ${rot(30, cx - 22, cy - 26)}`);
  if (flavor === 'mint') out += [[-14, 0], [18, -18], [22, 12], [-30, -12]].map(([x, y]) => e(cx + x, cy + y, 5, 3.5, '#6b4329')).join('');
  if (flavor === 'chocolate') out += c(cx + 16, cy - 8, 4, '#7a4a2c') + c(cx - 12, cy + 6, 3.5, '#7a4a2c');
  return out;
};
const cone = () => { const d = 'M48 232 L100 352 L152 232Z'; return P(d, '#f0b867') + insidePath(d, L('M40 250 l80 110 M70 226 l80 110 M160 250 l-80 110 M130 226 l-80 110', 3, '#c98a3c')) + R(40, 220, 120, 22, 10, '#f7c98a'); };
const cup = () => P('M46 236 h108 l-14 100 q-40 14 -80 0z', '#7fd3ff') + L('M72 244 l6 92 M100 244 v96 M128 244 l-6 92', 3, '#4fa9dc') + R(38, 224, 124, 22, 10, '#a9e2ff');
const topping = (kind, y) => kind === 'cherry' ? tube(`M100 ${y - 44} q4 -22 18 -28`, '#8a5a3c', 3) + C(100, y - 44, 18, '#ff4d5e') + e(94, y - 50, 4, 6, '#fff', 'opacity=".6"')
  : kind === 'wafer' ? `<g ${rot(24, 118, y - 30)}>${R(108, y - 96, 22, 84, 8, '#f0b867')}${L(`M108 ${y - 76} h22 M108 ${y - 56} h22 M108 ${y - 36} h22`, 2.5, '#c98a3c')}</g>`
    : [[-26, -30, 20], [0, -44, -30], [26, -30, 60], [-12, -16, 80], [16, -12, -10], [-34, -6, -50], [34, -2, 30]].map(([x, yy, a], i) => `<rect class="d" x="${100 + x - 8}" y="${y + yy - 3}" width="16" height="6" rx="3" fill="${['#ff5a6e', '#ffe14d', '#4fb0f0', '#8fd764', '#b79cff'][i % 5]}" stroke="${INK}" stroke-width="1.500" transform="rotate(${a} ${100 + x} ${y + yy})"/>`).join('');

/** One ice cream in a 200×370 box, standing on the bottom edge. */
export function iceCream({ holder, scoops = [], top }) {
  const y = holder === 'cup' ? 202 : 196;
  let out = scoops.map((f, i) => scoop(100, y - i * 58, f)).join('');
  if (top && scoops.length) out += topping(top, y - (scoops.length - 1) * 58);
  return `<svg viewBox="0 0 200 370">${out}${holder === 'cup' ? cup() : holder === 'cone' ? cone() : ''}</svg>`;
}
const chipScoop = (f) => `<svg viewBox="40 20 120 110">${scoop(100, 76, f)}</svg>`;
const chipTop = (k) => `<svg viewBox="52 0 96 104">${topping(k, 100)}</svg>`;
const bell = () => `<svg viewBox="0 0 200 200">${E(100, 170, 80, 16, '#b88a5e')}${P('M30 160 C30 80 60 44 100 44 C140 44 170 80 170 160Z', '#ffd447')}${C(100, 38, 14, '#ff9a3c')}${e(70, 96, 10, 24, '#fff', `opacity=".55" ${rot(20, 70, 96)}`)}</svg>`;

function shop(W) {
  let out = room(W, '#dff6ee', '#c4ecdf', '#f3d3b0', 620, 'stripes');
  // window with awning
  out += R(W * 0.5 - 150, 90, 300, 210, 20, '#bfe8ff') + L(`M${W * 0.5} 90 v210 M${W * 0.5 - 150} 195 h300`, 8, '#fff') +
    P(`M${W * 0.5 - 180} 60 h360 l20 60 q-25 26 -50 0 q-25 26 -50 0 q-25 26 -50 0 q-25 26 -50 0 q-25 26 -50 0 q-25 26 -50 0 q-25 26 -50 0 q-25 26 -50 0z`, '#ff9ec0');
  // shelf with jars
  for (const [x, col] of [[W * 0.14, '#ffe14d'], [W * 0.14 + 90, '#ff9ec0'], [W * 0.86 - 90, '#a6a2f7'], [W * 0.86, '#a8ecc8']]) out += R(x - 30, 150, 60, 80, 14, '#fff') + R(x - 24, 180, 48, 44, 8, col) + R(x - 34, 136, 68, 20, 8, '#ff9a3c');
  out += R(W * 0.14 - 60, 230, 210, 16, 6, '#c98a5c') + R(W * 0.86 - 150, 230, 210, 16, 6, '#c98a5c');
  return out;
}
const counter = (W) => band(W, 470, '#ff8fb5', 2000) + band(W, 440, '#fff', 34) + band(W, 474, 'rgba(31,26,58,.1)', 12);

export default {
  id: 'icecream', name: '冰淇淋店', colors: ['#fff0c9', '#ffc9de'], intro: 'ic-intro',
  icon: () => `<svg viewBox="0 0 230 200"><g transform="translate(18 2) scale(.54)">${iceCream({ holder: 'cone', scoops: ['strawberry', 'mint'], top: 'cherry' }).replace(/<\/?svg[^>]*>/g, '')}</g>
    <g transform="translate(112 22) scale(.5)">${iceCream({ holder: 'cup', scoops: ['mango', 'blueberry'], top: 'sprinkles' }).replace(/<\/?svg[^>]*>/g, '')}</g></svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(shop(W));
    const customerX = W * 0.76, standX = W * 0.4;
    const queue = sample(CUSTOMERS, ORDERS.length);
    let served = 0, order = null, made = null, customer = null, orderBubble = null, misses = 0, busy = true;
    ctx.progress(0, ORDERS.length);

    const customerLayer = ctx.add(el('div', { class: 'layer' }));
    const zoey = host(ctx, W * 0.14, 640, 470);
    customerLayer.append(zoey.el);
    ctx.scene(counter(W));
    const stand = ctx.sprite(`<svg viewBox="0 0 200 60">${E(100, 30, 86, 20, '#fff')}${e(100, 26, 70, 12, '#f1f1f1')}</svg>`, standX, 452, 190, 57);
    const cream = ctx.sprite('', standX, 280, 190, 351);
    const bellS = ctx.sprite(bell(), W * 0.56, 400, 110).tap(() => serve());
    bellS.el.classList.add('shadowed');

    const steps = () => [order.holder, ...order.scoops, ...(order.top ? [order.top] : [])];
    const doneSteps = () => (made.holder ? 1 : 0) + made.scoops.length + (made.top ? 1 : 0);
    const complete = () => doneSteps() === steps().length;
    const drawMade = () => cream.html(made.holder ? iceCream(made) : '');

    const items = [
      { key: 'cone', html: `<svg viewBox="30 210 140 150">${cone()}</svg>`, cls: 'wide' }, { key: 'cup', html: `<svg viewBox="30 214 140 136">${cup()}</svg>`, cls: 'wide' },
      ...Object.keys(FLAVORS).map((f) => ({ key: f, html: chipScoop(f) })),
      ...TOPS.map((k) => ({ key: k, html: chipTop(k) })),
    ];
    const bar = tray(ctx, W / 2, 660, items, (item, chip) => {
      if (busy || !order) return;
      const want = steps()[doneSteps()];
      if (item.key !== want) {
        ctx.sfx('bad'); chip.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], 300);
        if (++misses % 2 === 0) { ctx.say('ic-wrong'); if (want) bar.chips.get(want).classList.add('pulse'); }
        return;
      }
      bar.chips.forEach((ch) => ch.classList.remove('pulse'));
      if (item.key === 'cone' || item.key === 'cup') { made.holder = item.key; ctx.sfx('drop'); ctx.say(`ic-${item.key}`); }
      else if (FLAVORS[item.key]) { made.scoops.push(item.key); ctx.note(made.scoops.length * 2); ctx.sfx('pop'); ctx.say(`fl-${item.key}`); }
      else { made.top = item.key; ctx.sfx('sparkle'); ctx.say(`tp-${item.key}`); }
      drawMade(); cream.anim('pop', 300);
      if (complete()) { bellS.el.classList.add('pulse', 'glow'); ctx.after(900, () => ctx.say('ic-ready')); }
    }, { select: false, cls: 'ic-tray' });

    async function next() {
      busy = true;
      order = { holder: pick(['cone', 'cup']), scoops: sample(Object.keys(FLAVORS), ORDERS[served].scoops), top: ORDERS[served].top ? pick(TOPS) : null };
      made = { holder: null, scoops: [], top: null }; misses = 0;
      drawMade();
      customer = ctx.sprite(animal(queue[served]), W + 260, 330, 320);
      customerLayer.append(customer.el);
      ctx.sfx('slide');
      await customer.glide(customerX, 330, 700, 'cubic-bezier(.3,1.2,.5,1)');
      customer.anim('jump', 500);
      orderBubble = bubble(ctx, customerX - 215, 200, 170, 250, iceCream(order), '78%');
      orderBubble.classList.add('order');
      ctx.sfx('pop');
      busy = false;
      const voice = [`ic-hi-${order.holder}`];
      order.scoops.forEach((f, i) => { if (i) voice.push('ic-then'); voice.push(`fl-${f}`); });
      voice.push(order.top ? `ic-top-${order.top}` : 'ic-please');
      ctx.help = () => ctx.say(voice);
      ctx.say(voice);
    }

    async function serve() {
      if (busy || !order) return;
      if (!complete()) { ctx.sfx('bad'); bellS.anim('shake', 300); ctx.say('ic-notyet'); return; }
      busy = true;
      bellS.el.classList.remove('pulse', 'glow');
      ctx.sfx('bell'); bellS.anim('wiggle', 400);
      await ctx.sleep(350);
      orderBubble.remove();
      await cream.glide(customerX - 130, 300, 450);
      ctx.sfx('great'); customer.el.classList.add('happy'); zoey.hooray(1400);
      ctx.burst(customerX, 250, { shapes: ['heart'], colors: ['#ff7a8a', '#ff9ecb'], n: 10 });
      ctx.say(pick(['ic-thanks-1', 'ic-thanks-2', 'ic-thanks-3']));
      served++; ctx.progress(served, ORDERS.length);
      await ctx.sleep(1500);
      ctx.sfx('slide');
      cream.glide(W + 200, 300, 600, 'ease-in');
      await customer.glide(W + 320, 330, 600, 'ease-in');
      customer.remove(); cream.set(standX, 280);
      if (served === ORDERS.length) { ctx.win({ voice: 'ic-super' }); return; }
      next();
    }
    ctx.after(1300, next);
  },
};
