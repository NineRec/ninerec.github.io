// Sound: little synthesized effects and Zoey's recorded voice, both through one AudioContext
// (unlocked by the first touch, which is what iOS needs).
import { store } from './core.js';

let ac = null;
let master = null;
const buffers = new Map();   // voice key -> Promise<AudioBuffer|null>
let voiceSource = null;
let voiceToken = 0;

export function unlock() {
  if (!ac) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ac = new Ctx();
    master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(ac.destination);
  }
  if (ac.state !== 'running') ac.resume().catch(() => {});
}
document.addEventListener('pointerdown', unlock, { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) hush(); else if (ac) unlock(); });

/* ---------- effects ---------- */

function tone(f, at, dur, { type = 'sine', v = 0.16, to = 0, attack = 0.008 } = {}) {
  const t = ac.currentTime + at;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + dur + 0.03);
}

let noiseBuffer = null;
function noise(at, dur, { v = 0.14, f = 1200, to = 0, q = 1, type = 'bandpass' } = {}) {
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t = ac.currentTime + at;
  const src = ac.createBufferSource(), filter = ac.createBiquadFilter(), g = ac.createGain();
  src.buffer = noiseBuffer; src.loop = true;
  filter.type = type; filter.Q.value = q;
  filter.frequency.setValueAtTime(f, t);
  if (to) filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t); src.stop(t + dur + 0.03);
}

const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1568, 1760, 2093];

const FX = {
  tap: () => tone(700, 0, 0.07, { type: 'triangle', v: 0.12 }),
  pick: () => tone(520, 0, 0.1, { type: 'triangle', to: 820 }),
  drop: () => tone(430, 0, 0.12, { type: 'triangle', to: 250 }),
  pop: () => { tone(880, 0, 0.1, { to: 260, v: 0.2 }); noise(0, 0.05, { f: 2400, v: 0.1 }); },
  good: () => [0, 2, 4].forEach((n, i) => tone(SCALE[n + 2], i * 0.08, 0.22, { type: 'triangle' })),
  great: () => [0, 2, 4, 7].forEach((n, i) => tone(SCALE[n], i * 0.075, 0.3, { type: 'triangle' })),
  bad: () => { tone(330, 0, 0.16, { type: 'triangle', to: 300, v: 0.13 }); tone(262, 0.15, 0.24, { type: 'triangle', to: 230, v: 0.13 }); },
  win: () => {
    [0, 2, 4, 5, 4, 5, 7].forEach((n, i) => tone(SCALE[n], i * 0.11, 0.3, { type: 'triangle', v: 0.17 }));
    [0, 2, 4, 7].forEach((n) => tone(SCALE[n], 0.82, 0.9, { v: 0.1 }));
  },
  sparkle: () => { for (let i = 0; i < 6; i++) tone(1600 + Math.random() * 2200, i * 0.045, 0.16, { v: 0.06 }); },
  star: () => { tone(1046.5, 0, 0.12, { type: 'triangle' }); tone(1568, 0.09, 0.3, { type: 'triangle' }); },
  splash: () => noise(0, 0.4, { f: 2600, to: 500, q: 0.6, v: 0.22 }),
  water: () => noise(0, 0.22, { f: 3200, to: 1800, q: 0.8, v: 0.07 }),
  bubble: () => tone(320 + Math.random() * 200, 0, 0.12, { to: 900 + Math.random() * 400, v: 0.1 }),
  chomp: () => { noise(0, 0.07, { f: 900, v: 0.25, type: 'lowpass' }); noise(0.13, 0.07, { f: 700, v: 0.22, type: 'lowpass' }); },
  bell: () => { tone(1318.5, 0, 0.9, { v: 0.14 }); tone(1976, 0, 0.6, { v: 0.07 }); tone(2637, 0, 0.3, { v: 0.04 }); },
  camera: () => { noise(0, 0.03, { f: 4000, v: 0.3 }); noise(0.09, 0.05, { f: 2500, v: 0.25 }); },
  whoosh: () => noise(0, 0.28, { f: 500, to: 2600, q: 1.4, v: 0.14 }),
  flip: () => { noise(0, 0.05, { f: 1800, v: 0.12 }); tone(480, 0.01, 0.08, { type: 'triangle', to: 640, v: 0.08 }); },
  squeak: () => { tone(1200, 0, 0.09, { to: 1900 }); tone(1900, 0.09, 0.1, { to: 1300 }); },
  boing: () => tone(190, 0, 0.3, { to: 560, v: 0.2 }),
  brush: () => noise(0, 0.13, { f: 3600, q: 0.7, v: 0.05 }),
  step: () => tone(240, 0, 0.06, { type: 'triangle', v: 0.1 }),
  snip: () => { noise(0, 0.03, { f: 5000, v: 0.2 }); tone(1500, 0.02, 0.04, { v: 0.05 }); },
  puff: () => noise(0, 0.5, { f: 900, to: 300, q: 0.5, v: 0.2, type: 'lowpass' }),
  slide: () => tone(300, 0, 0.35, { to: 900, v: 0.12 }),
};

export function sfx(name) {
  if (!ac || !store.data.sound || ac.state !== 'running') return;
  try { FX[name]?.(); } catch { /* audio hiccup */ }
}
/** One note of a rising scale: counting, stacking. */
export function note(i) {
  if (!ac || !store.data.sound || ac.state !== 'running') return;
  tone(SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length], 0, 0.28, { type: 'triangle', v: 0.17 });
}

/* ---------- Zoey's voice ---------- */

function load(key) {
  if (!buffers.has(key)) {
    buffers.set(key, fetch(`assets/voice/${key}.m4a`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(key))))
      .then((data) => new Promise((resolve, reject) => ac.decodeAudioData(data, resolve, reject)))
      .catch(() => null));
  }
  return buffers.get(key);
}

export function hush() {
  voiceToken += 1;
  try { voiceSource?.stop(); } catch { /* already stopped */ }
  voiceSource = null;
}

/** Say clips one after another; a newer call interrupts. Resolves when finished (or skipped). */
export async function say(...keys) {
  keys = keys.flat().filter(Boolean);
  if (!ac || !store.data.voice || !keys.length) return;
  hush();
  const token = voiceToken;
  keys.forEach(load);
  for (const key of keys) {
    const buffer = await load(key);
    if (token !== voiceToken) return;
    if (!buffer) continue;
    await new Promise((done) => {
      const src = ac.createBufferSource(), g = ac.createGain();
      g.gain.value = 1.25;
      src.buffer = buffer;
      src.connect(g).connect(ac.destination);
      src.onended = done;
      voiceSource = src;
      src.start();
    });
    if (token !== voiceToken) return;
  }
}
export const preload = (...keys) => { if (ac) keys.flat().forEach(load); };
