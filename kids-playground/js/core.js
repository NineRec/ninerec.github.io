// Small helpers shared by every game: DOM, randomness, sprites on the stage, dragging, saved progress.

export const rand = (a, b) => a + Math.random() * (b - a);
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
export function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export const sample = (list, n) => shuffle(list).slice(0, n);

/** Create an element: el('div', {class, html, style, onclick, data-x}, ...children). */
export function el(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) node.append(kid);
  return node;
}

/** A picture placed on the stage by its centre, in stage units. */
export class Sprite {
  constructor(parent, html, cx, cy, w, h = w, cls = '') {
    this.el = el('div', { class: `sprite ${cls}`, html });
    this.w = w; this.h = h;
    this.el.style.width = `${w}px`; this.el.style.height = `${h}px`;
    this.set(cx, cy);
    parent.append(this.el);
  }
  set(cx, cy) {
    this.cx = cx; this.cy = cy;
    this.el.style.left = `${cx - this.w / 2}px`; this.el.style.top = `${cy - this.h / 2}px`;
    return this;
  }
  size(w, h = w) {
    this.w = w; this.h = h;
    this.el.style.width = `${w}px`; this.el.style.height = `${h}px`;
    return this.set(this.cx, this.cy);
  }
  /** Move there smoothly. */
  glide(cx, cy, ms = 350, easing = 'cubic-bezier(.3,1.3,.5,1)') {
    this.el.style.transition = `left ${ms}ms ${easing}, top ${ms}ms ${easing}, width ${ms}ms, height ${ms}ms`;
    this.set(cx, cy);
    return new Promise((done) => setTimeout(() => { this.el.style.transition = ''; done(); }, ms));
  }
  z(n) { this.el.style.zIndex = n; return this; }
  html(markup) { this.el.innerHTML = markup; return this; }
  on(type, fn) { this.el.addEventListener(type, fn); return this; }
  tap(fn) { this.el.classList.add('tappable'); return this.on('click', fn); }
  remove() { this.el.remove(); }
  anim(name, ms = 500) { return anim(this.el, name, ms); }
  hits(other, slack = 0) {
    return Math.abs(this.cx - other.cx) < (this.w + other.w) / 2 + slack - 20 && Math.abs(this.cy - other.cy) < (this.h + other.h) / 2 + slack - 20;
  }
}

const KEYFRAMES = {
  pop: [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
  in: [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }],
  out: [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }],
  shake: [0, -12, 12, -9, 9, -4, 0].map((x) => ({ transform: `translateX(${x}px)` })),
  nod: [0, 10, 0, 8, 0].map((y) => ({ transform: `translateY(${y}px)` })),
  jump: [0, -46, 0, -22, 0].map((y) => ({ transform: `translateY(${y}px)` })),
  wiggle: [0, -9, 9, -6, 6, 0].map((r) => ({ transform: `rotate(${r}deg)` })),
  spin: [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(360deg) scale(1.2)' }, { transform: 'rotate(720deg) scale(1)' }],
  fade: [{ opacity: 0 }, { opacity: 1 }],
};
export function anim(node, name, ms = 500, opts = {}) {
  const a = node.animate(KEYFRAMES[name], { duration: ms, easing: 'ease-in-out', ...opts });
  return a.finished.catch(() => {});
}

/** Progress kept on this device. */
const KEY = 'kids-playground-v1';
export const store = {
  data: { wins: {}, stickers: [], voice: true, sound: true, puzzleLevel: 1 },
  load() {
    try { Object.assign(this.data, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* private mode */ }
  },
  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch { /* private mode */ }
  },
};
store.load();

/** Simple line icons for the round buttons. */
const ICON = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v9.5h11V10"/><path d="M10 19.5v-5h4v5"/>',
  again: '<path d="M19.5 12a7.5 7.5 0 1 1-2.6-5.7"/><path d="M19.8 3.6v4.2h-4.2"/>',
  sound: '<path d="M4 9.5v5h3.5l5 4v-13l-5 4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9.5v5h3.5l5 4v-13l-5 4z" fill="currentColor"/><path d="m16 9.5 5 5m0-5-5 5"/>',
  next: '<path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5"/>',
  back: '<path d="M19 12H6m6.5-6.5L6 12l6.5 6.5"/>',
  check: '<path d="m4.5 12.5 5 5L19.5 7"/>',
  camera: '<path d="M3.5 8h4l1.5-2.5h6L16.5 8h4v11h-17z"/><circle cx="12" cy="13.2" r="3.4"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.1" fill="currentColor"/><circle cx="15" cy="15" r="1.1" fill="currentColor"/><circle cx="15" cy="9" r="1.1" fill="currentColor"/><circle cx="9" cy="15" r="1.1" fill="currentColor"/>',
  book: '<path d="M4 5.5c3-1.2 5.500-1 8 .8 2.500-1.800 5-2 8-.8v13c-3-1.200-5.500-1-8 .8-2.500-1.800-5-2-8-.8z"/><path d="M12 6.300v13"/>',
  star: '<path d="m12 3.500 2.600 5.400 5.900.8-4.300 4.100 1 5.900L12 16.900l-5.200 2.800 1-5.900L3.500 9.700l5.900-.8z" fill="currentColor"/>',
  eraser: '<path d="M8.500 19.500 3.800 14.800a1.500 1.500 0 0 1 0-2.100l8.400-8.400a1.500 1.500 0 0 1 2.100 0l5.900 5.900a1.500 1.500 0 0 1 0 2.100l-7.200 7.200z"/><path d="m8 9 7 7M8.500 19.500H20"/>',
  eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  help: '<path d="M9 9.200a3.100 3.100 0 1 1 4.700 2.600c-1 .7-1.700 1.300-1.700 2.700"/><circle cx="12" cy="18" r=".8" fill="currentColor"/>',
};
export const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;
export const roundButton = (name, cls, label, onclick) => el('button', { class: `round ${cls}`, type: 'button', 'aria-label': label, html: icon(name), onclick });
