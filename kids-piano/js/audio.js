// Sound out (key tones, Zoey's voice) and sound in (the real keyboard through the microphone).
import { KEYS, renderTone, NoteTracker } from './core.js';
import { settings } from './settings.js';

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.tones = new Map();        // midi -> AudioBuffer
    this.voices = new Map();       // clip key -> Promise<AudioBuffer|null>
    this.voiceSource = null;
    this.voiceToken = 0;
    this.listening = false;
    this.tracker = null;
    this.mic = null;               // { stream, source, node, sink }
    this.workletReady = null;
    /** Called with the MIDI note the microphone just heard. */
    this.onHeardNote = null;
  }

  /**
   * Browsers only allow sound after a touch. Call this from every user gesture;
   * it creates the audio context once and wakes it up if the system suspended it.
   */
  unlock() {
    if (!this.ctx) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      this.ctx = new Context({ latencyHint: 'interactive' });
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      this.setSessionType('playback');
      this.prerender();
    }
    if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
  }

  /** iOS: 'playback' ignores the silent switch; 'play-and-record' is needed while the mic is on. */
  setSessionType(type) {
    try { if (navigator.audioSession) navigator.audioSession.type = type; } catch { /* not supported */ }
  }

  /** Render the 37 tones a few at a time so the first touch is not delayed. */
  prerender() {
    const queue = [...KEYS].sort((a, b) => Math.abs(a - 64) - Math.abs(b - 64)); // middle keys first
    const step = () => {
      const midi = queue.shift();
      if (midi === undefined) return;
      this.tone(midi);
      setTimeout(step, 15);
    };
    setTimeout(step, 50);
  }

  tone(midi) {
    let buffer = this.tones.get(midi);
    if (!buffer) {
      const samples = renderTone(midi, this.ctx.sampleRate);
      buffer = this.ctx.createBuffer(1, samples.length, this.ctx.sampleRate);
      buffer.copyToChannel(samples, 0);
      this.tones.set(midi, buffer);
    }
    return buffer;
  }

  play(midi) {
    if (!this.ctx || midi < KEYS[0] || midi > KEYS[KEYS.length - 1]) return;
    // The app's own sound must not be heard as the child's key press.
    this.tracker?.mute(0.45);
    const source = this.ctx.createBufferSource();
    source.buffer = this.tone(midi);
    source.connect(this.master);
    source.start();
  }

  // ----- Zoey's voice -----

  loadVoice(key) {
    if (!this.voices.has(key)) {
      this.voices.set(key, fetch(`assets/voice/${key}.m4a`)
        .then((response) => (response.ok ? response.arrayBuffer() : Promise.reject(new Error('missing clip'))))
        .then((data) => new Promise((resolve, reject) => this.ctx.decodeAudioData(data, resolve, reject)))
        .catch(() => null));
    }
    return this.voices.get(key);
  }

  /** Plays a clip by key, e.g. "hello" or "song-twinkle". Unknown keys are ignored. */
  async say(key) {
    if (!settings.voiceEnabled || !this.ctx) return;
    const token = ++this.voiceToken;
    const buffer = await this.loadVoice(key);
    if (!buffer || token !== this.voiceToken) return;
    this.stopVoice(false);
    this.tracker?.mute(buffer.duration + 0.3);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.master);
    source.start();
    this.voiceSource = source;
  }

  sayOneOf(keys) {
    return this.say(keys[Math.floor(Math.random() * keys.length)]);
  }

  stopVoice(cancelPending = true) {
    if (cancelPending) this.voiceToken += 1;
    try { this.voiceSource?.stop(); } catch { /* already stopped */ }
    this.voiceSource = null;
  }

  muteListening(seconds) {
    this.tracker?.mute(seconds);
  }

  // ----- Microphone -----

  /** Turns microphone listening on or off. Resolves false when the microphone is not available. */
  async setListening(on) {
    if (on === this.listening) return true;
    if (!on) {
      this.stopMic();
      return true;
    }
    if (!this.ctx || !navigator.mediaDevices?.getUserMedia || !this.ctx.audioWorklet) return false;
    try {
      this.setSessionType('play-and-record');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
      });
      this.workletReady ??= this.ctx.audioWorklet.addModule('js/mic-worklet.js');
      await this.workletReady;
      const tracker = new NoteTracker(this.ctx.sampleRate);
      tracker.onNote = (midi) => this.onHeardNote?.(midi);
      const source = this.ctx.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(this.ctx, 'mic-tap');
      node.port.onmessage = (event) => tracker.feed(event.data);
      // A silent path to the output keeps the tap running in every browser.
      const sink = this.ctx.createGain();
      sink.gain.value = 0;
      source.connect(node).connect(sink).connect(this.ctx.destination);
      this.tracker = tracker;
      this.mic = { stream, source, node, sink };
      this.listening = true;
      if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
      return true;
    } catch (error) {
      console.warn('Microphone unavailable:', error);
      this.workletReady = null;
      this.stopMic();
      return false;
    }
  }

  stopMic() {
    if (this.mic) {
      this.mic.stream.getTracks().forEach((track) => track.stop());
      this.mic.node.port.onmessage = null;
      this.mic.source.disconnect();
      this.mic.node.disconnect();
      this.mic.sink.disconnect();
    }
    this.mic = null;
    this.tracker = null;
    this.listening = false;
    this.setSessionType('playback');
  }
}

export const audio = new AudioEngine();
