// State of one song being played: which note is next, demo playback, scoring.
// `song === null` is free play (the keyboard just makes sound).
import { KEYS, pitchClass } from './core.js';
import { audio } from './audio.js';
import { settings } from './settings.js';

export class PlaySession {
  constructor(song, onChange) {
    this.song = song;
    this.onChange = onChange;
    this.phase = 'play';     // 'play' | 'demo' | 'finished'
    this.index = 0;          // next note to press (or the note being demonstrated)
    this.litKey = null;      // key shown pressed by the demo or by a correct note
    this.wrongKey = null;    // key pressed by mistake (shown briefly in red)
    this.mistakes = 0;
    this.stars = 0;
    this.hits = 0;           // counts correct notes; the view uses it to retrigger animations
    this.wrongStreak = 0;
    this.timers = new Set();
    this.demoRun = 0;
    this.litToken = 0;
    this.wrongToken = 0;
  }

  get notes() { return this.song?.notes ?? []; }
  get currentNote() { return this.phase !== 'finished' && this.index < this.notes.length ? this.notes[this.index] : null; }
  /** The key the player should press now. */
  get targetKey() { return this.phase === 'play' ? this.currentNote?.midi ?? null : null; }

  after(seconds, fn) {
    const id = setTimeout(() => { this.timers.delete(id); fn(); }, seconds * 1000);
    this.timers.add(id);
    return id;
  }

  // ----- Input -----

  /** A key was touched on screen. */
  touched(midi) {
    audio.play(midi);
    const note = this.currentNote;
    if (this.phase !== 'play' || !note) return;
    if (midi === note.midi) this.advance(note); else this.miss(midi);
  }

  /** The microphone heard a note from the real keyboard. Any octave counts. */
  heard(midi) {
    const note = this.currentNote;
    if (this.phase !== 'play' || !note) return;
    if (pitchClass(midi) === pitchClass(note.midi)) {
      this.advance(note);
    } else {
      // Show the key in the octave nearest to the one we asked for.
      let shown = midi;
      while (shown - note.midi > 6) shown -= 12;
      while (note.midi - shown > 6) shown += 12;
      this.miss(shown >= KEYS[0] && shown <= KEYS[KEYS.length - 1] ? shown : midi);
    }
  }

  advance(note) {
    this.wrongStreak = 0;
    this.wrongKey = null;
    this.hits += 1;
    this.flash(note.midi, 0.18);
    this.index += 1;
    if (this.index >= this.notes.length) this.finish();
    this.onChange();
  }

  miss(midi) {
    this.mistakes += 1;
    this.wrongStreak += 1;
    this.wrongKey = midi;
    const token = ++this.wrongToken;
    this.after(0.45, () => {
      if (this.wrongToken === token) { this.wrongKey = null; this.onChange(); }
    });
    if (this.wrongStreak === 4) audio.say('oops');
    this.onChange();
  }

  flash(midi, seconds) {
    this.litKey = midi;
    const token = ++this.litToken;
    this.after(seconds, () => {
      if (this.litToken === token) { this.litKey = null; this.onChange(); }
    });
  }

  finish() {
    this.phase = 'finished';
    const count = this.notes.length;
    this.stars = this.mistakes * 6 <= count ? 3 : this.mistakes * 2 <= count ? 2 : 1;
    settings.recordStars(this.song.id, this.stars);
    this.after(0.4, () => audio.sayOneOf(['great-1', 'great-2', 'great-3']));
  }

  // ----- Controls -----

  restart() {
    this.stopDemo();
    this.index = 0;
    this.mistakes = 0;
    this.wrongStreak = 0;
    this.wrongKey = null;
    this.phase = 'play';
    this.onChange();
  }

  /** Zoey plays the song once while the keys light up. */
  startDemo() {
    if (!this.song) return;
    this.restart();
    this.phase = 'demo';
    this.onChange();
    const run = ++this.demoRun;
    const secondsPerBeat = 60 / this.song.bpm / (settings.slowDemo ? 0.65 : 1);
    const lead = 0.6;
    for (const note of this.song.notes) {
      this.after(lead + note.start * secondsPerBeat, () => {
        if (run !== this.demoRun) return;
        this.index = note.id;
        this.hits += 1;
        audio.play(note.midi);
        this.flash(note.midi, Math.max(0.12, note.duration * secondsPerBeat * 0.8));
        this.onChange();
      });
    }
    this.after(lead + Math.max(0.3, this.song.totalBeats * secondsPerBeat), () => {
      if (run !== this.demoRun) return;
      this.index = 0;
      this.phase = 'play';
      audio.say('your-turn');
      this.onChange();
    });
  }

  stopDemo() {
    this.demoRun += 1;
    this.timers.forEach(clearTimeout);
    this.timers.clear();
    this.litKey = null;
    if (this.phase === 'demo') {
      this.phase = 'play';
      this.index = 0;
    }
    this.onChange();
  }

  /** Stop all timers when leaving the screen. */
  dispose() {
    this.demoRun += 1;
    this.timers.forEach(clearTimeout);
    this.timers.clear();
    this.onChange = () => {};
  }
}
