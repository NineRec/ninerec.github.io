// Zoey on screen: a vector figure whose pose (idle, wave, cheer) is a data attribute the CSS animates.
import { zoeySvg } from './art/girl.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class Zoey {
  constructor(node) {
    this.el = node;
    node.classList.add('zoey');
    node.innerHTML = zoeySvg();
    this.token = 0;
    this.setPose('idle');
  }
  setPose(pose) { this.token++; this.pose = pose; this.el.dataset.pose = pose; }
  /** Cheer for a moment, then stand again. */
  async hooray(ms = 1500) {
    this.setPose('cheer');
    const token = this.token;
    await sleep(ms);
    if (token === this.token) this.setPose('idle');
  }
  stop() { this.token++; }
}
