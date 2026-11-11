// Pure logic shared by the app and the tests: pitch names, the .song parser,
// the tone synth and the microphone pitch tracker. No DOM, no Web Audio.

// ---------- Pitch ----------

/** The keyboard mirrors the Yamaha PSS-F30: 37 keys, F2…F5 (MIDI 41…77). */
export const LOWEST_KEY = 41;
export const HIGHEST_KEY = 77;
export const MIDDLE_C = 60;
export const KEYS = Array.from({ length: HIGHEST_KEY - LOWEST_KEY + 1 }, (_, i) => LOWEST_KEY + i);

const DEGREE_OF_CLASS = { 0: 1, 2: 2, 4: 3, 5: 4, 7: 5, 9: 6, 11: 7 };
const LABELS = {
  number: ['1', '2', '3', '4', '5', '6', '7'],
  solfege: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
  letter: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
};
/** One fixed colour per scale degree, used on keys, in the score and in hints. */
export const DEGREE_COLORS = ['#eb4245', '#f78c21', '#e6ad0a', '#45b359', '#21a3db', '#8566e6', '#eb61ab'];

export const pitchClass = (midi) => ((midi % 12) + 12) % 12;
/** Scale degree 1…7 in C major, or null for black keys. */
export const degreeOf = (midi) => DEGREE_OF_CLASS[pitchClass(midi)] ?? null;
export const isWhite = (midi) => degreeOf(midi) !== null;
/** Octave relative to the middle-C octave (C4…B4 = 0). */
export const octaveOf = (midi) => Math.floor((midi - MIDDLE_C) / 12);
export const frequencyOf = (midi) => 440 * 2 ** ((midi - 69) / 12);
export const labelFor = (degree, style) => (LABELS[style] ?? LABELS.number)[degree - 1] ?? '';
export const colorFor = (degree) => DEGREE_COLORS[degree - 1] ?? '#888';

// ---------- Songs ----------

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

/**
 * Parses the plain-text .song format (see README): numbered notation, 1 = middle C.
 *   1…7 note, 0 rest, 5, octave down, 1' octave up, 5_ half beat, 5. dotted,
 *   - hold one more beat, #4 / b7 accidentals, | bar line, "w:" lyrics for the line above.
 */
export function parseSong(id, text) {
  const header = {};
  const notes = [];
  let cursor = 0;
  let bar = 0;
  let lineStart = 0;
  let lineEnd = 0;
  let lastWasRest = false;
  let sawScore = false;

  text.split(/\r?\n/).forEach((rawLine, lineIndex) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('//')) return;

    if (line.startsWith('w:')) {
      const syllables = line.slice(2).trim().split(/\s+/).filter(Boolean);
      if (syllables.length > lineEnd - lineStart) {
        throw new Error(`${id} line ${lineIndex + 1}: ${syllables.length} syllables for ${lineEnd - lineStart} notes`);
      }
      syllables.forEach((syllable, offset) => {
        if (syllable !== '_') notes[lineStart + offset].lyric = syllable;
      });
      return;
    }

    const colon = line.indexOf(':');
    if (!sawScore && colon > 0 && /^\p{L}/u.test(line)) {
      header[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
      return;
    }

    sawScore = true;
    lineStart = notes.length;
    for (const token of line.split(/\s+/)) {
      if (token === '|') { bar += 1; continue; }
      if (token === '-') {
        if (!lastWasRest && notes.length) notes[notes.length - 1].duration += 1;
        cursor += 1;
        continue;
      }
      const match = /^([#b]?)([0-7])([',_.]*)$/.exec(token);
      if (!match) throw new Error(`${id} line ${lineIndex + 1}: bad token '${token}'`);
      const accidental = match[1] === '#' ? 1 : match[1] === 'b' ? -1 : 0;
      const degree = Number(match[2]);
      let octave = 0;
      let duration = 1;
      for (const c of match[3]) {
        if (c === "'") octave += 1;
        else if (c === ',') octave -= 1;
        else if (c === '_') duration /= 2;
        else duration *= 1.5;
      }
      if (degree === 0) {
        lastWasRest = true;
      } else {
        lastWasRest = false;
        notes.push({
          id: notes.length,
          midi: MIDDLE_C + MAJOR_SCALE[degree - 1] + 12 * octave + accidental,
          degree, octave, accidental, start: cursor, duration, lyric: '', bar,
        });
      }
      cursor += duration;
    }
    lineEnd = notes.length;
  });

  if (!notes.length) throw new Error(`${id}: no notes`);
  if (!header.title) throw new Error(`${id}: missing title`);
  return {
    id,
    title: header.title,
    subtitle: header.subtitle ?? '',
    emoji: header.emoji ?? '🎵',
    bpm: Number(header.bpm) || 100,
    beatsPerBar: Number(header.meter) || 4,
    notes,
    totalBeats: cursor,
  };
}

/** Bar lengths in beats as written in the score (used by the checks). */
export function barLengths(text) {
  const lengths = [];
  let current = 0;
  let sawScore = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('//') || line.startsWith('w:')) continue;
    if (!sawScore && line.includes(':') && /^\p{L}/u.test(line)) continue;
    sawScore = true;
    for (const token of line.split(/\s+/)) {
      if (token === '|') { lengths.push(current); current = 0; continue; }
      if (token === '-') { current += 1; continue; }
      let duration = 1;
      for (const c of token) { if (c === '_') duration /= 2; else if (c === '.') duration *= 1.5; }
      current += duration;
    }
  }
  if (current > 0) lengths.push(current);
  return lengths;
}

// ---------- Tone synth ----------

/** A soft toy-piano tone: a few harmonics that each fade out, higher ones faster. */
export function renderTone(midi, sampleRate, seconds = 2.4) {
  const frequency = frequencyOf(midi);
  const count = Math.floor(sampleRate * seconds);
  const partials = [1.0, 0.42, 0.2, 0.1, 0.05, 0.025];
  const baseDecay = Math.max(0.8, 2.0 + (midi - 60) * 0.045); // higher notes ring shorter
  const samples = new Float32Array(count);
  partials.forEach((amplitude, k) => {
    const f = frequency * (k + 1);
    if (f > sampleRate * 0.45) return;
    const decay = baseDecay * (1 + 0.7 * k);
    const step = (2 * Math.PI * f) / sampleRate;
    for (let i = 0; i < count; i++) {
      samples[i] += amplitude * Math.exp((-decay * i) / sampleRate) * Math.sin(step * i);
    }
  });
  const attack = 0.004 * sampleRate;
  const release = 0.06 * sampleRate;
  for (let i = 0; i < count; i++) {
    let gain = 0.38;
    if (i < attack) gain *= i / attack;
    const fromEnd = count - 1 - i;
    if (fromEnd < release) gain *= fromEnd / release;
    samples[i] *= gain;
  }
  return samples;
}

// ---------- Pitch tracking ----------

/** Monophonic pitch detection (YIN) for one window of samples. */
export class PitchDetector {
  constructor(sampleRate, windowSize = 2048, minFrequency = 75, maxFrequency = 1500) {
    this.sampleRate = sampleRate;
    this.windowSize = windowSize;
    this.minLag = Math.max(2, Math.floor(sampleRate / maxFrequency));
    this.maxLag = Math.min(windowSize >> 1, Math.floor(sampleRate / minFrequency) + 2);
    this.threshold = 0.15;
    this.cmnd = new Float32Array(this.maxLag + 2);
  }

  /** Returns { frequency, clarity } or null when the window has no clear pitch. */
  detect(samples, offset = 0) {
    const half = this.windowSize >> 1;
    const cmnd = this.cmnd;
    cmnd[0] = 1;
    let runningSum = 0;
    let best = -1;
    let falling = false;
    // Cumulative-mean-normalised difference; stop at the first dip under the threshold.
    for (let lag = 1; lag <= this.maxLag; lag++) {
      let d = 0;
      for (let i = 0; i < half; i++) {
        const diff = samples[offset + i] - samples[offset + i + lag];
        d += diff * diff;
      }
      runningSum += d;
      cmnd[lag] = runningSum > 0 ? (d * lag) / runningSum : 1;
      if (falling) {
        if (cmnd[lag] >= cmnd[lag - 1]) { best = lag - 1; break; }
      } else if (lag >= this.minLag && cmnd[lag] < this.threshold) {
        falling = true;
      }
    }
    if (best < 0) {
      if (!falling) return null;
      best = this.maxLag - 1;
    }
    // Parabolic interpolation for sub-sample accuracy.
    let refined = best;
    if (best > 1 && best < this.maxLag) {
      const a = cmnd[best - 1], b = cmnd[best], c = cmnd[best + 1];
      const denominator = a - 2 * b + c;
      if (Math.abs(denominator) > 1e-9) refined += (0.5 * (a - c)) / denominator;
    }
    return { frequency: this.sampleRate / refined, clarity: 1 - cmnd[best] };
  }
}

/** Turns a stream of microphone samples into "a key was just pressed" events. */
export class NoteTracker {
  constructor(sampleRate) {
    this.onNote = null;
    this.window = sampleRate > 30000 ? 2048 : 1024;
    this.hop = this.window >> 1;
    this.sampleRate = sampleRate;
    this.detector = new PitchDetector(sampleRate, this.window);
    this.pending = new Float32Array(this.window * 8);
    this.pendingLength = 0;

    // Tunables
    this.gate = 0.006;             // quieter than this counts as silence
    this.stableFrames = 2;         // frames a pitch must hold to count
    this.silentFramesToRelease = 3;
    this.reattackRatio = 1.7;      // loudness jump that means "same key pressed again"
    this.minFramesBetweenOnsets = 4;

    // State
    this.candidate = -1;
    this.candidateCount = 0;
    this.current = -1;
    this.silentCount = 0;
    this.dipLevel = Infinity;
    this.framesSinceOnset = 1000;
    this.muteFrames = 0;
  }

  /** Ignore new notes for a moment (while the app itself is making sound). */
  mute(seconds) {
    this.muteFrames = Math.max(this.muteFrames, Math.floor((seconds * this.sampleRate) / this.hop));
  }

  feed(samples) {
    if (this.pendingLength + samples.length > this.pending.length) {
      const grown = new Float32Array((this.pendingLength + samples.length) * 2);
      grown.set(this.pending.subarray(0, this.pendingLength));
      this.pending = grown;
    }
    this.pending.set(samples, this.pendingLength);
    this.pendingLength += samples.length;
    let offset = 0;
    while (this.pendingLength - offset >= this.window) {
      this.process(offset);
      offset += this.hop;
    }
    if (offset > 0) {
      this.pending.copyWithin(0, offset, this.pendingLength);
      this.pendingLength -= offset;
    }
  }

  process(offset) {
    const frame = this.pending;
    let sum = 0;
    for (let i = 0; i < this.window; i++) sum += frame[offset + i] * frame[offset + i];
    const level = Math.sqrt(sum / this.window);
    this.framesSinceOnset += 1;
    const muted = this.muteFrames > 0;
    if (muted) this.muteFrames -= 1;

    if (level <= this.gate) {
      this.silentCount += 1;
      if (this.silentCount >= this.silentFramesToRelease) { this.current = -1; this.candidate = -1; this.candidateCount = 0; }
      this.dipLevel = Math.min(this.dipLevel, level);
      return;
    }
    this.silentCount = 0;
    this.dipLevel = Math.min(this.dipLevel, level);

    let heard = -1;
    const reading = this.detector.detect(frame, offset);
    if (reading && reading.clarity > 0.8) {
      const exact = 69 + 12 * Math.log2(reading.frequency / 440);
      const rounded = Math.round(exact);
      if (Math.abs(exact - rounded) < 0.4) heard = rounded;
    }
    if (heard < 0) return;

    if (heard === this.candidate) this.candidateCount += 1;
    else { this.candidate = heard; this.candidateCount = 1; }
    if (this.candidateCount < this.stableFrames) return;

    const isNewPitch = heard !== this.current;
    const louder = level > this.dipLevel * this.reattackRatio;
    const isReattack = !isNewPitch && louder && this.framesSinceOnset >= this.minFramesBetweenOnsets;
    if (isNewPitch || isReattack) {
      this.current = heard;
      this.dipLevel = level;
      this.framesSinceOnset = 0;
      if (!muted && this.onNote) this.onNote(heard);
    } else if (louder) {
      // Still rising after the onset: follow the peak so the decay is not read as a new attack.
      this.dipLevel = level;
    }
  }
}
