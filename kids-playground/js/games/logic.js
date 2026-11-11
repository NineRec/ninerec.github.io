// 动脑筋 — a run of short thinking puzzles, one per screen, in the spirit of LogicLike:
// odd one out, what comes next, whose shadow, which has more, biggest/smallest, who is heavier, what goes together.
import { pick, sample, shuffle, el, anim, randInt } from '../core.js';
import { animal, LAND, SEA } from '../art/animals.js';
import { food, FRUITS, VEGGIES } from '../art/food.js';
import { island } from '../art/scenes.js';
import { R, P, C, e, star, shade } from '../art/base.js';
import { host } from './kit.js';

const SWEETS = ['cookie', 'donut', 'cupcake', 'candy', 'lollipop'];
const GROUPS = [LAND, SEA, FRUITS, VEGGIES, SWEETS];
const art = (name) => (LAND.includes(name) || SEA.includes(name) ? animal(name) : food(name, { face: false }));
const LIKES = { rabbit: 'carrot', monkey: 'banana', panda: 'bamboo', dog: 'bone', cat: 'fishy', bear: 'honey', mouse: 'cheese', koala: 'leaf', penguin: 'fishy', unicorn: 'cupcake', hedgehog: 'mushroom' };
const WEIGHT = { mouse: 1, chick: 1, frog: 1, hedgehog: 2, rabbit: 2, cat: 3, dog: 4, fox: 4, penguin: 4, sheep: 5, pig: 6, panda: 7, tiger: 8, bear: 8, cow: 9, hippo: 10, elephant: 11 };

// Each puzzle returns { voice, prompt (html), promptH, options: [{ html, ok, cls }], size }
const PUZZLES = {
  odd() {
    const [main, other] = sample(GROUPS, 2);
    const options = shuffle([...sample(main, 3).map((n) => ({ html: art(n) })), { html: art(pick(other)), ok: true }]);
    return { voice: 'lg-odd', options };
  },
  next(level) {
    const kinds = sample(pick([FRUITS, VEGGIES, SWEETS, LAND]), 3);
    const unit = level < 3 ? [0, 1] : pick([[0, 0, 1], [0, 1, 1], [0, 1, 2]]);
    const len = unit.length === 2 ? 5 : 6;
    const seq = Array.from({ length: len + 1 }, (_, i) => kinds[unit[i % unit.length]]);
    const answer = seq.pop();
    const others = [...new Set(kinds)].filter((k) => k !== answer);
    if (others.length < 2) others.push(pick(pick(GROUPS).filter((k) => !kinds.includes(k))));
    return {
      voice: 'lg-next', promptH: 190,
      prompt: seq.map((k) => `<div class="q-item">${art(k)}</div>`).join('') + `<div class="q-item q-what">?</div>`,
      options: shuffle([{ html: art(answer), ok: true }, ...others.slice(0, 2).map((k) => ({ html: art(k) }))]),
    };
  },
  shadow() {
    const names = sample(pick([LAND, LAND, SEA, FRUITS]), 4);
    return { voice: 'lg-shadow', promptH: 250, prompt: `<div class="q-shadow">${art(names[0])}</div>`, options: shuffle(names.map((n, i) => ({ html: art(n), ok: i === 0 }))) };
  },
  more(level) {
    const kind = pick([...FRUITS, ...SWEETS]);
    const counts = sample(level < 3 ? [1, 2, 3, 4, 5] : [3, 4, 5, 6, 7, 8], level < 3 ? 2 : 3);
    const most = Math.max(...counts);
    return { voice: 'lg-more', size: 250, options: counts.map((n) => ({ ok: n === most, cls: 'q-plate', html: Array.from({ length: n }, () => `<div class="q-bit">${food(kind, { face: false })}</div>`).join('') })) };
  },
  size() {
    const name = pick([...LAND, ...FRUITS]), biggest = Math.random() < 0.5;
    const scales = shuffle([0.45, 0.68, 0.95]);
    const want = biggest ? 0.95 : 0.45;
    return { voice: biggest ? 'lg-biggest' : 'lg-smallest', size: 240, options: scales.map((s) => ({ ok: s === want, html: `<div style="width:${s * 100}%;height:${s * 100}%">${art(name)}</div>` })) };
  },
  heavy() {
    let [a, b] = sample(Object.keys(WEIGHT), 2);
    while (Math.abs(WEIGHT[a] - WEIGHT[b]) < 3) [a, b] = sample(Object.keys(WEIGHT), 2);
    const tilt = WEIGHT[a] > WEIGHT[b] ? -9 : 9;
    return {
      voice: 'lg-heavy', promptH: 300,
      prompt: `<div class="q-seesaw"><div class="q-plank" style="transform:rotate(${tilt}deg)"><div class="q-rider">${animal(a)}</div><div class="q-rider">${animal(b)}</div></div>
        <svg class="q-pivot" viewBox="0 0 120 80">${P('M60 4 L112 78 H8Z', '#ff9d2e')}${C(60, 12, 10, '#e07d10')}</svg></div>`,
      options: [{ html: animal(a), ok: WEIGHT[a] > WEIGHT[b] }, { html: animal(b), ok: WEIGHT[b] > WEIGHT[a] }],
    };
  },
  pair() {
    const who = pick(Object.keys(LIKES));
    const wrong = sample([...new Set(Object.values(LIKES))].filter((f) => f !== LIKES[who]), 2);
    return { voice: 'lg-pair', promptH: 250, prompt: `<div class="q-who">${animal(who)}</div>`, options: shuffle([{ html: art(LIKES[who]), ok: true }, ...wrong.map((f) => ({ html: art(f) }))]) };
  },
};
const TOTAL = 8;

export default {
  id: 'logic', name: '动脑筋', colors: ['#c9f1ff', '#7fd9ff'], intro: 'lg-intro',
  icon: () => `<svg viewBox="0 0 230 200">${R(18, 60, 60, 60, 16, '#fff')}${R(86, 60, 60, 60, 16, '#fff')}${R(154, 60, 60, 60, 16, '#fff3a8')}
    <g transform="translate(24 66) scale(.24)">${food('apple', { face: false }).replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(92 66) scale(.24)">${food('banana', { face: false }).replace(/<\/?svg[^>]*>/g, '')}</g>
    <text x="184" y="108" text-anchor="middle" font-size="46" font-weight="900" fill="#ff9d2e" font-family="ui-rounded, system-ui">?</text>${star(48, 160, 16, '#ffc21f')}${star(116, 160, 16, '#ffc21f')}${star(184, 160, 16, '#e3e1ec')}</svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(island(W, 400));
    const zoey = host(ctx, 110, 800, 300);
    let done = 0;
    ctx.progress(0, TOTAL);
    const order = [...shuffle(Object.keys(PUZZLES)), ...sample(Object.keys(PUZZLES), TOTAL - Object.keys(PUZZLES).length)];
    const board = ctx.add(el('div', { class: 'q-board' }));

    function show() {
      const q = PUZZLES[order[done]](done);
      board.innerHTML = '';
      let locked = false;
      const optY = q.prompt ? 590 : 440, size = Math.min(q.size || 190, (W - 320) / q.options.length - 26);
      if (q.prompt) board.append(el('div', { class: 'q-prompt', html: q.prompt, style: { top: `${300 - (q.promptH || 200) / 2}px`, height: `${q.promptH || 200}px` } }));
      q.options.forEach((opt, i) => {
        const x = W / 2 + 40 + (i - (q.options.length - 1) / 2) * (size + 26);
        const card = el('button', { class: `q-card ${opt.cls || ''}`, type: 'button', html: opt.html, style: { left: `${x - size / 2}px`, top: `${optY - size / 2}px`, width: `${size}px`, height: `${size}px`, animationDelay: `${0.25 + i * 0.08}s` } });
        card.addEventListener('click', async () => {
          if (locked || card.classList.contains('no')) return;
          if (!opt.ok) { ctx.sfx('bad'); card.classList.add('no'); anim(card, 'shake', 380); ctx.say('lg-try'); return; }
          locked = true;
          card.classList.add('yes'); ctx.sfx('great'); anim(card, 'pop', 400);
          ctx.burst(x, optY, { n: 12, spread: 170 });
          zoey.hooray(1300);
          done++; ctx.progress(done, TOTAL);
          ctx.say(pick(['good-1', 'good-2', 'good-3']));
          await ctx.sleep(1500);
          if (done === TOTAL) { ctx.win(); return; }
          board.classList.add('leaving');
          await ctx.sleep(260);
          board.classList.remove('leaving');
          show();
        });
        board.append(card);
      });
      ctx.help = () => ctx.say(q.voice);
      ctx.after(done ? 200 : 2200, () => ctx.say(q.voice));
      ctx.sfx('whoosh');
    }
    show();
  },
};
