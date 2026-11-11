// Screens and wiring: song picker, play screen, celebration, settings.
import { KEYS, MIDDLE_C, isWhite, degreeOf, octaveOf, labelFor, colorFor, DEGREE_COLORS, parseSong } from './core.js';
import { audio } from './audio.js';
import { settings } from './settings.js';
import { PlaySession } from './session.js';

const $ = (id) => document.getElementById(id);
const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
const INK = '#38334d';
const WHITE_KEYS = KEYS.filter(isWhite);

let songs = [];
let session = null;
let micWorking = false;
let shownHits = 0;
let shownPhase = null;
const keyEls = new Map();   // midi -> element
let noteEls = [];           // score bubbles of the open song

// ---------- Zoey ----------

/** Zoey, animated from sprite frames: 0 standing, 1–4 raising a hand, 5–6 happy wave, 7–8 arms wide open. */
class Zoey {
  constructor(img) {
    this.img = img;
    this.frame = 0;
    this.pose = null;
    this.token = 0;
  }

  show(frame) {
    this.frame = frame;
    this.img.src = `assets/zoey/zoey${frame}.png`;
  }

  async play(frames, step, token) {
    for (const frame of frames) {
      if (token !== this.token) return false;
      this.show(frame);
      await sleep(step);
    }
    return token === this.token;
  }

  async setPose(pose) {
    if (pose === this.pose) return;
    this.pose = pose;
    const token = ++this.token;
    if (pose === 'idle') {
      if (await this.play([5, 3, 2, 1].filter((f) => f < this.frame), 0.09, token)) this.show(0);
    } else if (pose === 'wave') {
      while (await this.play([0, 1, 2, 3, 4, 5, 6, 5, 4, 5, 6, 5, 4, 3, 2, 1, 0], 0.12, token)) await sleep(3.5);
    } else if (pose === 'cheer') {
      if (!(await this.play([1, 2, 5, 6, 7], 0.09, token))) return;
      while (await this.play([8, 7], 0.45, token));
    }
  }
}

const homeZoey = new Zoey($('home-zoey'));
const playZoey = new Zoey($('play-zoey'));
const cheerZoey = new Zoey($('cheer-zoey'));

// ---------- Home ----------

function starsMarkup(count) {
  return [0, 1, 2].map((i) => `<span class="${i < count ? 'on' : ''}">★</span>`).join('');
}

function renderHome() {
  const grid = $('song-grid');
  grid.textContent = '';
  const addCard = (emoji, title, subtitle, color, stars, open) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.style.setProperty('--c', color);
    card.innerHTML = '<span class="card-emoji"></span><span class="card-title"></span><span class="card-sub"></span><span class="card-stars"></span>';
    card.children[0].textContent = emoji;
    card.children[1].textContent = title;
    card.children[2].textContent = subtitle;
    if (stars === null) card.children[3].style.visibility = 'hidden';
    card.children[3].innerHTML = starsMarkup(stars ?? 0);
    card.addEventListener('click', open);
    grid.append(card);
  };
  songs.forEach((song, i) => {
    addCard(song.emoji, song.title, song.subtitle, DEGREE_COLORS[i % 7], settings.starsFor(song.id), () => openPlay(song));
  });
  addCard('🎹', '自由弹奏', 'Free Play', INK, null, () => openPlay(null));
}

function showView(name) {
  $('home').hidden = name !== 'home';
  $('play').hidden = name !== 'play';
  homeZoey.setPose(name === 'home' ? 'wave' : 'idle');
}

// ---------- Keyboard ----------

function buildKeyboard() {
  const keys = $('keys');
  for (const midi of WHITE_KEYS) {
    const degree = degreeOf(midi);
    const octave = octaveOf(midi);
    const key = document.createElement('div');
    key.className = 'key white';
    key.style.setProperty('--c', colorFor(degree));
    const label = document.createElement('div');
    label.className = `key-label${octave === 0 ? '' : ' faded'}`;
    label.innerHTML = (midi === MIDDLE_C ? '<span class="home-star">★</span>' : '')
      + `<span class="kdot${octave > 0 ? ' on' : ''}"></span><span class="ball"></span><span class="kdot${octave < 0 ? ' on' : ''}"></span>`;
    key.append(label);
    keys.append(key);
    keyEls.set(midi, key);
  }
  for (const midi of KEYS.filter((m) => !isWhite(m))) {
    const key = document.createElement('div');
    key.className = 'key black';
    key.style.left = `${(WHITE_KEYS.filter((w) => w < midi).length * 100) / WHITE_KEYS.length}%`;
    keys.append(key);
    keyEls.set(midi, key);
  }
  for (const [midi, key] of keyEls) {
    key.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      audio.unlock();
      key.classList.add('down');
      session?.touched(midi);
    });
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
      key.addEventListener(type, () => key.classList.remove('down'));
    }
  }
  new ResizeObserver(() => {
    $('keyboard').style.setProperty('--kw', `${keys.clientWidth / WHITE_KEYS.length}px`);
  }).observe(keys);
  refreshKeyLabels();
}

function setBall(ball, text) {
  ball.textContent = text;
  ball.classList.toggle('len2', text.length === 2);
  ball.classList.toggle('len3', text.length > 2);
}

function refreshKeyLabels() {
  for (const midi of WHITE_KEYS) {
    setBall(keyEls.get(midi).querySelector('.ball'), labelFor(degreeOf(midi), settings.labelStyle));
  }
}

/** Horizontal centre of a key, as a percentage of the keyboard width. */
function keyCenter(midi) {
  const below = WHITE_KEYS.filter((w) => w < midi).length;
  return ((isWhite(midi) ? below + 0.5 : below) * 100) / WHITE_KEYS.length;
}

// ---------- Score strip ----------

function noteLabel(note) {
  const accidental = note.accidental > 0 ? '♯' : note.accidental < 0 ? '♭' : '';
  return accidental + labelFor(note.degree, settings.labelStyle);
}

function buildStrip(song) {
  const row = $('strip-row');
  row.textContent = '';
  noteEls = [];
  if (!song) return;
  // Longer notes get more room after them, so the row reads like the rhythm.
  const steps = new Map();
  song.notes.forEach((note, i) => {
    if (i + 1 < song.notes.length) {
      const step = song.notes[i + 1].start - note.start;
      steps.set(step, (steps.get(step) ?? 0) + 1);
    }
  });
  const typicalStep = [...steps.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 1;

  song.notes.forEach((note, i) => {
    if (i > 0 && note.bar !== song.notes[i - 1].bar) {
      const bar = document.createElement('div');
      bar.className = 'bar-line';
      row.append(bar);
    }
    const next = i + 1 < song.notes.length ? song.notes[i + 1].start : note.start + note.duration;
    const ratio = Math.min(3.5, Math.max(0.6, (next - note.start) / typicalStep));
    const el = document.createElement('div');
    el.className = 'note';
    el.style.setProperty('--c', colorFor(note.degree));
    el.style.marginRight = `calc(var(--note-size) * ${(0.24 + 0.5 * (ratio - 1)).toFixed(3)})`;
    el.innerHTML = `<span class="ndot${note.octave > 0 ? ' on' : ''}"></span><span class="ball"></span>`
      + `<span class="ndot${note.octave < 0 ? ' on' : ''}"></span><span class="lyric"></span>`;
    setBall(el.querySelector('.ball'), noteLabel(note));
    el.querySelector('.lyric').textContent = note.lyric;
    row.append(el);
    noteEls.push(el);
  });
}

function refreshStripLabels() {
  session?.notes.forEach((note, i) => setBall(noteEls[i].querySelector('.ball'), noteLabel(note)));
}

/** Slide the row so the current note sits at a fixed spot (30% from the left). */
function positionStrip(animate = true) {
  if (!session?.song || !noteEls.length) return;
  const el = noteEls[Math.min(session.index, noteEls.length - 1)];
  const row = $('strip-row');
  row.style.transition = animate ? '' : 'none';
  row.style.transform = `translateX(${$('strip').clientWidth * 0.3 - (el.offsetLeft + el.offsetWidth / 2)}px)`;
}

// ---------- Play screen ----------

function renderPlay() {
  if (!session) return;
  const s = session;
  const target = s.targetKey;
  for (const [midi, key] of keyEls) {
    key.classList.toggle('target', midi === target);
    key.classList.toggle('lit', midi === s.litKey);
    key.classList.toggle('wrong', midi === s.wrongKey);
  }

  const arrow = $('arrow');
  arrow.hidden = target === null;
  if (target !== null) {
    arrow.style.left = `${keyCenter(target)}%`;
    arrow.style.setProperty('--c', degreeOf(target) ? colorFor(degreeOf(target)) : '#f78c21');
    if (s.hits !== shownHits) {   // bounce again, so a repeated note is clearly a new press
      arrow.classList.remove('pop');
      void arrow.offsetWidth;
      arrow.classList.add('pop');
    }
  }
  shownHits = s.hits;

  const shownIndex = Math.min(s.index, noteEls.length - 1);
  noteEls.forEach((el, i) => {
    el.classList.toggle('done', i < shownIndex);
    el.classList.toggle('current', i === shownIndex);
  });
  positionStrip();
  renderHint();

  const demo = $('demo');
  demo.textContent = s.phase === 'demo' ? '⏹ 停' : '👂 听一遍';
  demo.classList.toggle('red', s.phase === 'demo');
  demo.classList.toggle('blue', s.phase !== 'demo');
  $('speed').textContent = settings.slowDemo ? '🐢 慢' : '🐇 快';
  $('mic').textContent = micWorking ? '🎤 听琴' : '🎤 不听琴';
  $('mic').classList.toggle('off', !micWorking);

  playZoey.setPose(s.phase === 'demo' ? 'wave' : 'idle');
  $('play-zoey').style.visibility = s.phase === 'finished' ? 'hidden' : '';

  if (s.phase !== shownPhase) {
    shownPhase = s.phase;
    if (s.phase === 'finished') showCelebration(); else hideCelebration();
  }
}

/** What Zoey is "saying": the next note, big, in its colour. */
function renderHint() {
  const hint = $('hint');
  const note = session.currentNote;
  hint.textContent = '';
  if (session.phase === 'demo') {
    hint.textContent = '先听我弹一遍～';
  } else if (!session.song) {
    hint.textContent = '想弹什么就弹什么！';
  } else if (note) {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.style.background = colorFor(note.degree);
    pill.textContent = noteLabel(note);
    hint.append(session.index === 0 ? '轮到你啦！找到' : '下一个', pill, micWorking ? '在琴上按亮起来的键' : '点亮起来的键');
  }
  hint.hidden = !hint.childNodes.length;
}

function showCelebration() {
  $('celebration-song').textContent = `${session.song.emoji} ${session.song.title}`;
  const stars = [...$('celebration-stars').children];
  stars.forEach((star, i) => {
    star.className = i < session.stars ? 'on' : '';
    setTimeout(() => star.classList.add('shown'), 350 * (i + 1));
  });
  const confetti = $('confetti');
  confetti.textContent = '';
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('i');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--c', DEGREE_COLORS[i % 7]);
    piece.style.setProperty('--w', `${7 + Math.random() * 7}px`);
    piece.style.setProperty('--t', `${2.5 + Math.random() * 3}s`);
    piece.style.setProperty('--delay', `${Math.random() * 2.5}s`);
    piece.style.setProperty('--sway', `${Math.random() * 80 - 40}px`);
    piece.style.setProperty('--spin', `${(Math.random() * 4 + 1) * 360}deg`);
    confetti.append(piece);
  }
  $('celebration').hidden = false;
  cheerZoey.pose = null;
  cheerZoey.setPose('cheer');
}

function hideCelebration() {
  $('celebration').hidden = true;
  $('confetti').textContent = '';
  cheerZoey.setPose('idle');
}

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on) wakeLock = await navigator.wakeLock?.request('screen');
    else { await wakeLock?.release(); wakeLock = null; }
  } catch { /* not supported or not allowed: the screen may dim */ }
}

async function startMic() {
  micWorking = settings.micEnabled && Boolean(session?.song) && (await audio.setListening(true));
  if (session) renderPlay();
  return micWorking;
}

function openPlay(song) {
  audio.unlock();
  session?.dispose();
  session = new PlaySession(song, renderPlay);
  shownPhase = null;
  shownHits = 0;
  $('play-title').textContent = song ? `${song.emoji} ${song.title}` : '🎹 自由弹奏';
  $('play').querySelectorAll('.song-only').forEach((el) => { el.hidden = !song; });
  buildStrip(song);
  showView('play');
  renderPlay();
  positionStrip(false);
  keepAwake(true);
  audio.onHeardNote = (midi) => session?.heard(midi);
  startMic();
  audio.say(song ? `song-${song.id}` : 'free-play');
}

function closePlay() {
  session?.dispose();
  session = null;
  micWorking = false;
  audio.stopVoice();
  audio.onHeardNote = null;
  audio.setListening(false);
  keepAwake(false);
  hideCelebration();
  renderHome();
  showView('home');
}

async function toggleMic() {
  const wanted = !micWorking;
  settings.micEnabled = wanted;
  if (wanted) {
    if (!(await startMic())) toast('麦克风没有打开。请在浏览器或系统设置里允许使用麦克风；不开也可以直接点屏幕上的键。');
  } else {
    await audio.setListening(false);
    micWorking = false;
    renderPlay();
  }
}

let toastTimer = 0;
function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 4500);
}

// ---------- Settings ----------

function renderSettings() {
  for (const button of $('label-style').children) button.classList.toggle('on', button.dataset.style === settings.labelStyle);
  const preview = $('label-preview');
  preview.textContent = '';
  for (let degree = 1; degree <= 7; degree++) {
    const dot = document.createElement('span');
    dot.style.setProperty('--c', colorFor(degree));
    dot.textContent = labelFor(degree, settings.labelStyle);
    preview.append(dot);
  }
  $('set-mic').checked = settings.micEnabled;
  $('set-voice').checked = settings.voiceEnabled;
  $('set-slow').checked = settings.slowDemo;
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  $('install-tip').hidden = standalone;
}

function bindSettings() {
  $('open-settings').addEventListener('click', () => { renderSettings(); $('settings').showModal(); });
  $('close-settings').addEventListener('click', () => $('settings').close());
  for (const button of $('label-style').children) {
    button.addEventListener('click', () => {
      settings.labelStyle = button.dataset.style;
      renderSettings();
      refreshKeyLabels();
    });
  }
  $('set-mic').addEventListener('change', (event) => { settings.micEnabled = event.target.checked; });
  $('set-voice').addEventListener('change', (event) => { settings.voiceEnabled = event.target.checked; });
  $('set-slow').addEventListener('change', (event) => { settings.slowDemo = event.target.checked; });
}

// ---------- Start ----------

function bindControls() {
  $('back').addEventListener('click', closePlay);
  $('another').addEventListener('click', closePlay);
  $('again').addEventListener('click', () => session?.restart());
  $('restart').addEventListener('click', () => session?.restart());
  $('demo').addEventListener('click', () => {
    if (session.phase === 'demo') session.stopDemo();
    else { audio.stopVoice(); session.startDemo(); }
  });
  $('speed').addEventListener('click', () => { settings.slowDemo = !settings.slowDemo; renderPlay(); });
  $('mic').addEventListener('click', toggleMic);
  $('home-zoey').addEventListener('click', () => { audio.unlock(); audio.say('hello'); });

  // Sound is only allowed after a touch; wake the audio engine on every gesture.
  for (const type of ['pointerdown', 'pointerup', 'touchend', 'click']) {
    document.addEventListener(type, () => audio.unlock(), { capture: true, passive: true });
  }
  // No zooming, no long-press menus: this is a toy for small hands.
  for (const type of ['gesturestart', 'contextmenu', 'dblclick']) {
    document.addEventListener(type, (event) => event.preventDefault());
  }
  window.addEventListener('resize', () => positionStrip(false));

  // Release the microphone when the app goes to the background; take it back on return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      session?.stopDemo();
      audio.setListening(false);
      micWorking = false;
    } else if (session) {
      keepAwake(true);
      startMic();
    }
  });
}

async function start() {
  buildKeyboard();
  bindControls();
  bindSettings();
  for (let frame = 0; frame <= 8; frame++) new Image().src = `assets/zoey/zoey${frame}.png`;   // preload
  const response = await fetch('assets/songs.json');
  songs = (await response.json()).flatMap(({ id, text }) => {
    try { return [parseSong(id, text)]; } catch (error) { console.warn('Song skipped:', error.message); return []; }
  });
  renderHome();
  showView('home');

  // Offline cache. Skipped on localhost so development always sees fresh files (add ?sw to test it).
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && (!local || location.search.includes('sw'))) {
    navigator.serviceWorker.register('sw.js').catch((error) => console.warn('Offline cache unavailable:', error));
  }
}

start();
