// Preferences and progress, kept in localStorage.
const KEY = 'kids-piano';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; }
}

const saved = load();
const state = {
  labelStyle: ['number', 'solfege', 'letter'].includes(saved.labelStyle) ? saved.labelStyle : 'number',
  micEnabled: saved.micEnabled ?? true,   // listen to the real keyboard
  voiceEnabled: saved.voiceEnabled ?? true,
  slowDemo: saved.slowDemo ?? false,
  stars: saved.stars ?? {},               // best star count per song id
};

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: keep in memory */ }
}

export const settings = {
  get labelStyle() { return state.labelStyle; },
  set labelStyle(v) { state.labelStyle = v; save(); },
  get micEnabled() { return state.micEnabled; },
  set micEnabled(v) { state.micEnabled = v; save(); },
  get voiceEnabled() { return state.voiceEnabled; },
  set voiceEnabled(v) { state.voiceEnabled = v; save(); },
  get slowDemo() { return state.slowDemo; },
  set slowDemo(v) { state.slowDemo = v; save(); },
  starsFor(songId) { return state.stars[songId] ?? 0; },
  recordStars(songId, count) {
    if (count > (state.stars[songId] ?? 0)) { state.stars[songId] = count; save(); }
  },
};
