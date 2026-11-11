// 换装派对 — dress the doll: outfit, hair, shoes, something on her head, in her hand, on her back, and where the party is.
import { pick, el, anim } from '../core.js';
import { sceneSvg } from '../art/scenes.js';
import { E, e } from '../art/base.js';
import { doll, HAIR, OUTFIT, SHOES, HEAD, HAND, BACK, SCENES, SKIN, shoeAt } from '../art/girl.js';
import { tray } from './kit.js';

const mannequin = `<g opacity=".3">${E(200, 180, 122, 112, '#d8c8c0')}</g>`;
const CATS = [
  { key: 'outfit', voice: 'du-outfit', keys: Object.keys(OUTFIT).filter((k) => k !== 'zoey'), view: '30 280 340 400', chip: (k) => OUTFIT[k]() },
  { key: 'hair', voice: 'du-hair', keys: Object.keys(HAIR), view: '10 0 380 380', chip: (k) => HAIR[k].back(HAIR[k].col) + E(200, 180, 122, 112, SKIN) + HAIR[k].front(HAIR[k].col) },
  { key: 'shoes', voice: 'du-shoes', keys: SHOES, view: '140 566 120 104', chip: (k) => shoeAt(176, 1, k) + shoeAt(224, -1, k) },
  { key: 'head', voice: 'du-head', keys: Object.keys(HEAD), view: '70 -50 260 200', chip: (k) => HEAD[k]() },
  { key: 'hand', voice: 'du-hand', keys: Object.keys(HAND), view: '236 110 190 420', chip: (k) => HAND[k]() },
  { key: 'back', voice: 'du-back', keys: Object.keys(BACK), view: '-20 190 440 430', chip: (k) => BACK[k]() },
  { key: 'scene', voice: 'du-scene', keys: Object.keys(SCENES), view: '0 0 1200 800', chip: (k) => SCENES[k](1200) },
];
const randomLook = () => ({ hair: pick(Object.keys(HAIR)), outfit: pick(Object.keys(OUTFIT).filter((k) => k !== 'zoey')), shoes: pick(SHOES), head: pick([...Object.keys(HEAD), null]), hand: pick([...Object.keys(HAND), null]), back: pick([...Object.keys(BACK), null, null]) });

export default {
  id: 'dressup', name: '换装派对', colors: ['#efe3ff', '#cdb4ff'], intro: 'dressup-intro',
  icon: () => `<svg viewBox="-80 0 560 700">${doll({ hair: 'bob', outfit: 'princess', shoes: 'mary', head: 'crown', hand: 'wand', back: 'fairy' })}</svg>`,

  start(ctx) {
    const { W } = ctx;
    const look = { hair: 'bob', outfit: null, shoes: null, head: null, hand: null, back: null };
    let scene = 'castle', changes = 0;
    const bg = ctx.scene(SCENES[scene](W));
    const dx = W * 0.27, dy = 436;
    ctx.sprite(`<svg viewBox="0 0 200 40">${e(100, 20, 96, 16, 'rgba(90,59,46,.18)')}</svg>`, dx, 748, 300, 60);
    const girl = ctx.sprite('', dx, dy, 412, 721, 'bob');
    const render = () => girl.html(`<svg class="art" viewBox="0 0 400 700">${doll(look)}</svg>`);
    render();

    let options = null;
    function openCat(cat) {
      options?.el.remove();
      ctx.say(cat.voice);
      options = tray(ctx, W * 0.72, 452, cat.keys.map((key) => ({ key, html: `<svg viewBox="${cat.view}" ${cat.key === 'scene' ? 'preserveAspectRatio="xMidYMid slice"' : ''}>${cat.chip(key)}</svg>`, cls: cat.key === 'scene' ? 'scene-chip' : '' })), (item) => {
        changes++;
        if (cat.key === 'scene') { scene = item.key; bg.innerHTML = sceneSvg(W, SCENES[scene](W)); ctx.sfx('whoosh'); return; }
        const off = look[cat.key] === item.key && cat.key !== 'hair' && cat.key !== 'outfit';
        look[cat.key] = off ? null : item.key;
        if (off) options.clear();
        render();
        ctx.sfx(off ? 'drop' : 'sparkle'); girl.anim('pop', 320);
        if (!off) ctx.burst(dx, cat.key === 'shoes' ? 720 : cat.key === 'head' || cat.key === 'hair' ? 180 : 440, { n: 8, spread: 200 });
      }, { width: Math.min(500, W * 0.46), cls: 'du-options' });
      options.select(cat.key === 'scene' ? scene : look[cat.key]);
    }
    const cats = tray(ctx, W * 0.72, 132, CATS.map((cat) => ({ key: cat.key, html: `<svg viewBox="${cat.view}" ${cat.key === 'scene' ? 'preserveAspectRatio="xMidYMid slice"' : ''}>${cat.chip(cat.keys[cat.key === 'outfit' ? 0 : cat.key === 'hair' ? 2 : 0])}</svg>`, cls: cat.key === 'scene' ? 'scene-chip' : '' })),
      (item) => { ctx.sfx('tap'); openCat(CATS.find((x) => x.key === item.key)); }, { cls: 'du-cats' });
    cats.select('outfit');
    openCat(CATS[0]);

    ctx.button('dice', W * 0.72 - 64, 722, 'purple', '随机', () => {
      Object.assign(look, randomLook()); scene = pick(Object.keys(SCENES)); changes += 3;
      bg.innerHTML = sceneSvg(W, SCENES[scene](W)); render();
      ctx.sfx('sparkle'); girl.anim('spin', 600); ctx.burst(dx, 400, { n: 14, spread: 300 });
      options.select(null);
    });
    ctx.button('camera', W * 0.72 + 64, 722, 'pink', '拍照', async () => {
      if (!look.outfit) { ctx.sfx('bad'); ctx.say('du-outfit'); cats.select('outfit'); openCat(CATS[0]); return; }
      ctx.sfx('camera');
      const flash = ctx.add(el('div', { class: 'flash' }));
      await ctx.sleep(450); flash.remove();
      girl.anim('jump', 700); ctx.burst(dx, 400, { n: 22, spread: 380, size: 44 });
      ctx.win({ voice: 'dressup-done', delay: 900 });
    });
  },
};
