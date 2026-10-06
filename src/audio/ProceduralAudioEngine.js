/**
 * ProceduralAudioEngine: Bộ tổng hợp âm thanh thủ tục Web Audio API cho Fulldy Center
 */
export class ProceduralAudioEngine {
  constructor({ headless = false } = {}) {
    this.headless = headless;
    this.ctx = null;
  }

  initAudio() {
    if (this.headless || typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq = 440, duration = 0.1, type = 'sine') {
    if (this.headless || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playBarcodeScan() {
    this.playTone(880, 0.08, 'triangle');
  }

  playForkliftReverse() {
    this.playTone(320, 0.18, 'square');
  }

  playSlaAlarm() {
    this.playTone(1050, 0.25, 'sawtooth');
  }
}
