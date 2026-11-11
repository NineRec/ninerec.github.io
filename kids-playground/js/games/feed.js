// 喂小动物 — each friend thinks of the food it wants, and how many. Drag exactly that food to its mouth and count along.
import { pick, sample, shuffle, el, anim } from '../core.js';
import { animal, animalG } from '../art/animals.js';
import { food, foodG } from '../art/food.js';
import { meadow } from '../art/scenes.js';
import { E, e, R, P, L, INK } from '../art/base.js';
import { bubble } from './kit.js';

const LIKES = {
  rabbit: ['carrot', 'radish'], monkey: ['banana', 'peach'], panda: ['bamboo'], dog: ['bone'], cat: ['fishy', 'milk'], bear: ['honey'],
  mouse: ['cheese'], pig: ['corn', 'apple', 'pumpkin'], koala: ['leaf'], elephant: ['watermelon', 'apple'], penguin: ['fishy'],
  unicorn: ['cupcake', 'candy'], hedgehog: ['mushroom', 'apple'], fox: ['grapes'], chick: ['corn', 'peas'], giraffe: ['leaf'], hippo: ['watermelon'], deer: ['acorn'],
};
const WORD = { fishy: 'fish' };
const ALL = [...new Set(Object.values(LIKES).flat())];
// how many of how many kinds, round by round
const ROUNDS = [[[1, 2]], [[2, 3]], [[3, 4]], [[1, 2], [1, 2]], [[2, 3], [2, 3]]];
const rnd = ([a, b]) => a + Math.floor(Math.random() * (b - a + 1));

const blanket = (W) => {
  const x = W * 0.3;
  return `<g transform="translate(${x} 640)">${P('M-250 -40 L250 -40 L330 90 L-330 90Z', '#ff9ec0')}${L('M-150 -40 L-198 90 M-50 -40 L-66 90 M50 -40 L66 90 M150 -40 L198 90 M-270 -5 H270 M-300 42 H300', 8, '#fff')}</g>`;
};
const table = (W) => `<g transform="translate(${W * 0.72} 0)">${R(-250, 560, 500, 40, 16, '#e0a868')}${R(-220, 600, 40, 150, 10, '#c98a5c')}${R(180, 600, 40, 150, 10, '#c98a5c')}${e(0, 568, 230, 8, '#f0c690')}</g>`;

export default {
  id: 'feed', name: '喂小动物', colors: ['#e3f8d5', '#b6e9a0'], intro: 'feed-intro',
  icon: () => `<svg viewBox="0 0 230 200">${animalG('rabbit', 6, 26, 150)}${foodG('carrot', 128, 60, 100, { face: false })}</svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(meadow(W, 520) + blanket(W) + table(W));
    const friends = sample(Object.keys(LIKES), ROUNDS.length);
    let round = 0;
    ctx.progress(0, ROUNDS.length);
    const ax = W * 0.3, ay = 500, tableX = W * 0.72;

    async function play() {
      const name = friends[round];
      const wants = sample(LIKES[name], Math.min(ROUNDS[round].length, LIKES[name].length)).map((f, i) => ({ food: f, n: rnd(ROUNDS[round][i]), fed: 0 }));
      if (wants.length < ROUNDS[round].length) wants[0].n = Math.min(5, wants[0].n + 2);
      const others = sample(ALL.filter((f) => !LIKES[name].includes(f)), 4 - wants.length);
      const offered = shuffle([...wants.map((w) => w.food), ...others]);

      const pet = ctx.sprite(animal(name), -260, ay, 340);
      ctx.sfx('slide');
      await pet.glide(ax, ay, 700);
      pet.anim('jump', 500);

      const cells = wants.reduce((s, w) => s + w.n, 0);
      const cols = Math.min(cells, cells > 6 ? 4 : 3), rows = Math.ceil(cells / cols);
      const bw = cols * 78 + 40, bh = rows * 78 + 30;
      const think = bubble(ctx, ax + 60, Math.max(70 + bh / 2, ay - 250 - bh / 2), bw, bh, '', '24%');
      think.classList.add('think');
      const slots = [];
      for (const w of wants) for (let i = 0; i < w.n; i++) { const d = el('div', { class: 'want', html: food(w.food, { face: false }) }); d.dataset.food = w.food; think.append(d); slots.push(d); }
      ctx.sfx('pop'); anim(think, 'in', 350);
      const ask = wants.flatMap((w) => [`num-${w.n}`, `wd-${WORD[w.food] || w.food}`]);
      ctx.help = () => ctx.say(ask);
      ctx.say(ask);

      const piles = offered.map((f, i) => {
        const x = tableX + (i - (offered.length - 1) / 2) * 118;
        const s = ctx.sprite(food(f, { face: false }), x, 500, 108);
        s.el.classList.add('shadowed');
        ctx.drag(s, {
          end: async () => {
            if (!s.hits(pet, 10)) { ctx.sfx('drop'); s.goHome(); return; }
            const want = wants.find((w) => w.food === f && w.fed < w.n);
            if (!want) {
              ctx.sfx('bad'); pet.anim('shake', 450); s.goHome(450);
              ctx.say(wants.some((w) => w.food === f) ? 'feed-full' : 'feed-no');
              return;
            }
            want.fed++;
            const total = wants.reduce((t, w) => t + w.fed, 0);
            // the bite flies into the mouth, the pile is full again
            const bite = ctx.sprite(food(f, { face: false }), s.cx, s.cy, 108);
            s.set(s.home.cx, s.home.cy); s.anim('in', 300);
            bite.glide(ax, ay - 40, 180).then(() => { bite.el.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.1)', opacity: 0 }], { duration: 220, fill: 'forwards' }); ctx.after(230, () => bite.remove()); });
            ctx.sfx('chomp'); ctx.note(total - 1);
            pet.el.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.08,.9)' }, { transform: 'scale(.96,1.06)' }, { transform: 'scale(1,1)' }], 380);
            const slot = slots.find((d) => d.dataset.food === f && !d.classList.contains('fed'));
            slot.classList.add('fed'); anim(slot, 'pop', 300);
            ctx.say(`num-${want.fed}`);
            if (wants.every((w) => w.fed === w.n)) done();
          },
        });
        s.anim('in', 300);
        return s;
      });

      async function done() {
        piles.forEach((p) => { p.locked = true; });
        await ctx.sleep(700);
        ctx.sfx('great'); ctx.say('feed-yum');
        pet.el.classList.add('happy');
        ctx.burst(ax, ay - 120, { shapes: ['heart'], colors: ['#ff7a8a', '#ff9ecb'], n: 12 });
        round++; ctx.progress(round, ROUNDS.length);
        await ctx.sleep(1500);
        think.remove();
        piles.forEach((p) => { p.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }); });
        ctx.sfx('slide');
        await pet.glide(W + 300, ay, 650, 'ease-in');
        pet.remove(); piles.forEach((p) => p.remove());
        if (round === ROUNDS.length) ctx.win(); else play();
      }
    }
    ctx.after(900, play);
  },
};
