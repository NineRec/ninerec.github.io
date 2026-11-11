// Celebration effects: full-screen confetti and little bursts of stars and hearts on the stage.
import { el, rand, pick } from './core.js';
import { starPath, heartPath } from './art/base.js';

const COLORS = ['#ff7a8a', '#ffb347', '#ffe26a', '#8fd764', '#7fd3ff', '#b79cff', '#ff9ecb'];

let raf = 0;
export function confetti(ms = 3200) {
  const canvas = document.getElementById('confetti');
  const g = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.width = innerWidth * dpr, h = canvas.height = innerHeight * dpr;
  canvas.style.display = 'block';
  const bits = [];
  const wave = (n, fromTop) => {
    for (let i = 0; i < n; i++) {
      const side = Math.random() < 0.5;
      bits.push(fromTop
        ? { x: rand(0, w), y: rand(-h * 0.3, 0), vx: rand(-1, 1) * dpr, vy: rand(2, 6) * dpr }
        : { x: side ? 0 : w, y: h * rand(0.5, 0.9), vx: (side ? 1 : -1) * rand(5, 15) * dpr, vy: -rand(8, 19) * dpr },
      );
      Object.assign(bits[bits.length - 1], { s: rand(7, 15) * dpr, a: rand(0, 6.3), va: rand(-0.25, 0.25), c: pick(COLORS), k: Math.random() < 0.3 });
    }
  };
  wave(90, false); wave(70, true);
  const started = performance.now();
  let more = 2;
  cancelAnimationFrame(raf);
  const tick = (now) => {
    const t = now - started;
    if (more && t > (3 - more) * 800) { wave(60, more % 2 === 0); more--; }
    g.clearRect(0, 0, w, h);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.vy += 0.28 * dpr; b.vx *= 0.99; b.a += b.va;
      g.save(); g.translate(b.x, b.y); g.rotate(b.a); g.fillStyle = b.c;
      if (b.k) { g.beginPath(); g.arc(0, 0, b.s / 2, 0, 7); g.fill(); } else g.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
      g.restore();
    }
    if (t < ms || bits.some((b) => b.y < h + 40)) {
      if (t > ms + 2500) { stopConfetti(); return; }
      raf = requestAnimationFrame(tick);
    } else stopConfetti();
  };
  raf = requestAnimationFrame(tick);
}
export function stopConfetti() {
  cancelAnimationFrame(raf);
  const canvas = document.getElementById('confetti');
  canvas.style.display = 'none';
}

const SHAPE = {
  star: (col) => `<svg viewBox="-24 -24 48 48"><path d="${starPath(0, 0, 20, 9)}" fill="${col}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`,
  heart: (col) => `<svg viewBox="-24 -24 48 48"><path d="${heartPath(0, 0, 15)}" fill="${col}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`,
  dot: (col) => `<svg viewBox="-24 -24 48 48"><circle r="12" fill="${col}"/></svg>`,
  bubble: () => `<svg viewBox="-24 -24 48 48"><circle r="17" fill="rgba(255,255,255,.5)" stroke="#fff" stroke-width="3"/><circle cx="-6" cy="-6" r="4" fill="#fff"/></svg>`,
  drop: () => `<svg viewBox="-24 -24 48 48"><path d="M0 -18 C10 -4 14 4 14 10 a14 14 0 0 1 -28 0 C-14 4 -10 -4 0 -18Z" fill="#8fd6ff" stroke="#fff" stroke-width="3"/></svg>`,
};

/** Throw a few shapes outward from a point on the stage. */
export function burst(parent, x, y, o = {}) {
  const { n = 9, shapes = ['star', 'heart'], colors = COLORS, spread = 130, size = 34, up = 0, ms = 800 } = o;
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2), d = rand(spread * 0.4, spread), s = size * rand(0.6, 1.2);
    const bit = el('div', { class: 'bit', html: SHAPE[pick(shapes)](pick(colors)), style: { left: `${x - s / 2}px`, top: `${y - s / 2}px`, width: `${s}px`, height: `${s}px` } });
    parent.append(bit);
    bit.animate([
      { transform: 'translate(0,0) scale(.3) rotate(0)', opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d - up}px) scale(1) rotate(${rand(-180, 180)}deg)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${Math.cos(a) * d * 1.15}px, ${Math.sin(a) * d * 1.15 - up + 30}px) scale(.2) rotate(${rand(-240, 240)}deg)`, opacity: 0 },
    ], { duration: ms * rand(0.8, 1.2), easing: 'cubic-bezier(.2,.7,.4,1)' }).finished.then(() => bit.remove(), () => bit.remove());
  }
}
