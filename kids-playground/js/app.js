// The shell: home screen, sticker album, and the stage every game plays on.
import { el, Sprite, clamp, pick, store, icon, roundButton, anim } from './core.js';
import { say, sfx, hush, unlock, note } from './audio.js';
import { confetti, stopConfetti, burst } from './fx.js';
import { sceneSvg, meadow } from './art/scenes.js';
import { animal, LAND, SEA } from './art/animals.js';
import { food, FRUITS, VEGGIES, TREATS } from './art/food.js';
import { GAMES } from './games/index.js';
import { Zoey } from './zoey.js';

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const hubZoey = new Zoey($('hub-zoey'));
const winZoey = new Zoey($('win-zoey'));
new Zoey($('rotate-zoey')).setPose('wave');

/* ---------- stickers ---------- */

export const STICKERS = [
  ...LAND.map((k) => ({ id: k, art: () => animal(k) })),
  ...SEA.map((k) => ({ id: k, art: () => animal(k) })),
  ...[...FRUITS, ...VEGGIES, ...TREATS.filter((k) => !['leaf', 'bone', 'bamboo', 'fishy'].includes(k))].map((k) => ({ id: k, art: () => food(k) })),
];

function awardSticker() {
  const missing = STICKERS.filter((s) => !store.data.stickers.includes(s.id));
  if (!missing.length) return null;
  const s = pick(missing);
  store.data.stickers.push(s.id);
  store.save();
  return s;
}

/* ---------- the stage a game plays on ---------- */

class Game {
  constructor(def) {
    this.def = def;
    this.stage = $('stage');
    this.alive = true;
    this.timers = new Set();
    this.cleanups = [];
    this.H = 800;
    const { w, h } = this.viewport();
    this.W = clamp(Math.round((w / h) * 800), 1066, 1730);
    this.stage.innerHTML = '';
    this.stage.style.width = `${this.W}px`;
    this.fit = this.fit.bind(this);
    addEventListener('resize', this.fit);
    this.fit();
    this.progress(0, 0);
  }
  viewport() { const r = $('play').getBoundingClientRect(); return { w: r.width || innerWidth, h: r.height || innerHeight }; }
  fit() {
    const { w, h } = this.viewport();
    this.scale = Math.min(w / this.W, h / this.H);
    this.stage.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
  }
  /** Pointer position in stage units. */
  point(ev) {
    const r = this.stage.getBoundingClientRect(), s = r.width / this.W;
    return { x: (ev.clientX - r.left) / s, y: (ev.clientY - r.top) / s };
  }
  scene(inner, cls = '') {
    const holder = el('div', { class: `scene-holder ${cls}`, html: sceneSvg(this.W, inner) });
    this.stage.append(holder);
    return holder;
  }
  sprite(html, cx, cy, w, h = w, cls = '') {
    const s = new Sprite(this.stage, html, cx, cy, w, h, cls);
    s.home = { cx, cy };
    s.goHome = (ms = 300) => s.glide(s.home.cx, s.home.cy, ms);
    return s;
  }
  add(node) { this.stage.append(node); return node; }
  after(ms, fn) {
    const id = setTimeout(() => { this.timers.delete(id); if (this.alive) fn(); }, ms);
    this.timers.add(id);
    return id;
  }
  /** Resolves later — and never, once the game has been left. */
  sleep(ms) { return new Promise((done) => this.after(ms, done)); }
  every(ms, fn) {
    const id = setInterval(() => { if (this.alive) fn(); }, ms);
    this.cleanups.push(() => clearInterval(id));
    return () => clearInterval(id);
  }
  /** Run fn(dt seconds, elapsed) every frame until the game ends or the returned stop() is called. */
  loop(fn) {
    let last = performance.now(), on = true, total = 0;
    const tick = (now) => {
      if (!on || !this.alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; total += dt;
      fn(dt, total);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { on = false; };
  }
  say(...keys) { return this.alive ? say(...keys) : Promise.resolve(); }
  sfx(name) { if (this.alive) sfx(name); }
  note(i) { if (this.alive) note(i); }
  burst(x, y, o) { burst(this.stage, x, y, o); }
  /** Stars across the top: `done` of `total` filled. */
  progress(done, total) {
    const bar = $('progress');
    if (bar.children.length !== total) bar.innerHTML = Array.from({ length: total }, () => '<span>★</span>').join('');
    [...bar.children].forEach((s, i) => {
      if (i < done && !s.classList.contains('on')) { s.classList.add('on'); anim(s, 'pop', 450); }
      if (i >= done) s.classList.remove('on');
    });
  }
  /** Let a sprite be dragged. Handlers get (sprite, point). */
  drag(sprite, { start, move, end, enabled } = {}) {
    const node = sprite.el;
    node.classList.add('draggable');
    node.addEventListener('pointerdown', (ev) => {
      if (!this.alive || sprite.locked || (enabled && !enabled(sprite))) return;
      ev.preventDefault();
      const p0 = this.point(ev), ox = sprite.cx - p0.x, oy = sprite.cy - p0.y;
      try { node.setPointerCapture(ev.pointerId); } catch { /* synthetic event */ }
      node.classList.add('dragging');
      node.style.transition = '';
      this.sfx('pick');
      start?.(sprite, p0);
      const onMove = (e) => {
        const q = this.point(e);
        sprite.set(clamp(q.x + ox, -40, this.W + 40), clamp(q.y + oy, -40, this.H + 40));
        move?.(sprite, q);
      };
      const onUp = (e) => {
        node.removeEventListener('pointermove', onMove);
        node.removeEventListener('pointerup', onUp);
        node.removeEventListener('pointercancel', onUp);
        node.classList.remove('dragging');
        if (this.alive) end?.(sprite, this.point(e));
      };
      node.addEventListener('pointermove', onMove);
      node.addEventListener('pointerup', onUp);
      node.addEventListener('pointercancel', onUp);
    });
    return sprite;
  }
  /** Report every finger position while it is pressed anywhere on the stage (for rubbing and painting). */
  rub(fn, endFn) {
    let down = false;
    const onDown = (ev) => { if (ev.target.closest('.no-rub')) return; down = true; fn(this.point(ev), ev, true); };
    const onMove = (ev) => { if (down && this.alive) fn(this.point(ev), ev, false); };
    const onUp = () => { if (down) { down = false; endFn?.(); } };
    this.stage.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onUp);
    this.cleanups.push(() => { removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp); });
  }
  /** A round button on the stage. */
  button(name, cx, cy, cls, label, fn) {
    const b = roundButton(name, `stage-button no-rub ${cls}`, label, () => { if (this.alive) { this.sfx('tap'); fn(); } });
    b.style.left = `${cx - 46}px`; b.style.top = `${cy - 46}px`;
    return this.add(b);
  }
  /** The round is won: confetti, Zoey cheers, a new sticker. */
  async win({ voice = pick(['yay-1', 'yay-2', 'yay-3']), delay = 500 } = {}) {
    if (!this.alive || this.won) return;
    this.won = true;
    store.data.wins[this.def.id] = (store.data.wins[this.def.id] || 0) + 1;
    store.save();
    await this.sleep(delay);
    const sticker = awardSticker();
    confetti();
    this.sfx('win');
    $('win-sticker').innerHTML = sticker ? `<div class="sticker-new">${sticker.art()}</div><div class="sticker-label">新贴纸！</div>` : '';
    $('win').hidden = false;
    winZoey.setPose('cheer');
    this.after(700, () => this.say(voice));
  }
  destroy() {
    this.alive = false;
    removeEventListener('resize', this.fit);
    for (const id of this.timers) clearTimeout(id);
    for (const fn of this.cleanups) fn();
    hush();
    stopConfetti();
    winZoey.setPose('idle');
    $('win').hidden = true;
    this.stage.innerHTML = '';
  }
}

let current = null;

function startGame(def) {
  current?.destroy();
  current = new Game(def);
  $('play').dataset.game = def.id;
  try { def.start(current); } catch (err) { console.error(err); }
  if (def.intro) current.after(350, () => current.say(def.intro));
}

/* ---------- screens ---------- */

function show(view) {
  for (const id of ['hub', 'album', 'play']) $(id).hidden = id !== view;
  document.body.dataset.view = view;
}

function renderHub() {
  if (!$('hub-bg').firstChild) $('hub-bg').innerHTML = `<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">${meadow(1200, 610, { sunX: 1040, trees: false })}</svg>`;
  $('hub-grid').innerHTML = '';
  for (const g of GAMES) {
    const wins = store.data.wins[g.id] || 0;
    $('hub-grid').append(el('a', {
      class: 'card', href: `#/play/${g.id}`, style: { '--c1': g.colors[0], '--c2': g.colors[1] }, 'data-game': g.id,
      html: `<div class="card-art">${g.icon()}</div><div class="card-name">${g.name}</div>${wins ? `<div class="card-wins">★ ${wins}</div>` : ''}`,
    }));
  }
  $('hub-grid').append(el('a', {
    class: 'card card-link', href: '../kids-piano/', style: { '--c1': '#d9f1ff', '--c2': '#a9dcff' },
    html: `<div class="card-art"><img src="../kids-piano/assets/icons/icon-192.png" alt=""></div><div class="card-name">小钢琴</div>`,
  }));
  $('open-album').innerHTML = `${icon('book')}<span>贴纸册 ${store.data.stickers.length}/${STICKERS.length}</span>`;
  $('toggle-sound').innerHTML = `${icon(store.data.sound ? 'sound' : 'mute')}<span>${store.data.sound ? '声音开' : '声音关'}</span>`;
}

function renderAlbum() {
  const have = new Set(store.data.stickers);
  $('album-count').textContent = `${have.size} / ${STICKERS.length}`;
  $('album-grid').innerHTML = '';
  for (const s of STICKERS) {
    const got = have.has(s.id);
    const cell = el('button', { class: `sticker ${got ? 'got' : ''}`, type: 'button', html: s.art() });
    cell.addEventListener('click', () => {
      if (!got) { sfx('boing'); anim(cell, 'shake', 400); return; }
      sfx('pop'); anim(cell, 'jump', 600); say(`wd-${s.id}`, `about-${s.id}`);
    });
    $('album-grid').append(cell);
  }
}

function route() {
  const [, kind, id] = location.hash.split('/');
  const def = kind === 'play' && GAMES.find((g) => g.id === id);
  if (def) {
    show('play');
    hubZoey.setPose('idle');
    startGame(def);
    return;
  }
  current?.destroy();
  current = null;
  if (kind === 'album') { show('album'); renderAlbum(); return; }
  show('hub');
  renderHub();
  hubZoey.setPose('wave');
}

function init() {
  $('album-back').append(roundButton('back', 'ink', '返回', () => { sfx('tap'); location.hash = '#/'; }));
  $('play-home').append(roundButton('home', 'ink', '回到首页', () => { sfx('tap'); location.hash = '#/'; }));
  $('play-help').append(roundButton('sound', 'ink', '再听一遍', () => { if (current) { sfx('tap'); current.help ? current.help() : current.say(current.def.intro); } }));
  $('win-actions').append(
    roundButton('again', 'orange big', '再玩一次', () => { sfx('tap'); startGame(current.def); }),
    roundButton('home', 'blue big', '回到首页', () => { sfx('tap'); location.hash = '#/'; }),
  );
  $('open-album').addEventListener('click', () => { sfx('tap'); location.hash = '#/album'; });
  $('toggle-sound').addEventListener('click', () => {
    store.data.sound = !store.data.sound; store.data.voice = store.data.sound; store.save();
    if (!store.data.sound) hush();
    renderHub(); sfx('tap');
  });
  $('hub-zoey').addEventListener('click', () => { unlock(); say('hello'); hubZoey.hooray(1600).then(() => { if (document.body.dataset.view === 'hub') hubZoey.setPose('wave'); }); });
  $('hub-grid').addEventListener('click', (ev) => { if (ev.target.closest('.card')) { unlock(); sfx('tap'); } });
  addEventListener('hashchange', route);
  document.addEventListener('contextmenu', (ev) => ev.preventDefault());
  document.addEventListener('dblclick', (ev) => ev.preventDefault());
  route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
init();
