// Runs on the audio thread: collects microphone samples and posts them to the page in blocks.
class MicTap extends AudioWorkletProcessor {
  constructor() {
    super();
    this.block = new Float32Array(1024);
    this.filled = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    let read = 0;
    while (read < channel.length) {
      const n = Math.min(channel.length - read, this.block.length - this.filled);
      this.block.set(channel.subarray(read, read + n), this.filled);
      this.filled += n;
      read += n;
      if (this.filled === this.block.length) {
        this.port.postMessage(this.block.slice());
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor('mic-tap', MicTap);
