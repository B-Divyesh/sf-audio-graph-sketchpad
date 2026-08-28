import type { NodeId, Patch } from './types';

type NodePort = { input: AudioNode | null; output: AudioNode | null };

export class AudioEngine {
  private context: AudioContext | null = null;
  private ports = new Map<NodeId, NodePort>();
  private oscillator: OscillatorNode | null = null;
  private noise: AudioBufferSourceNode | null = null;
  private oscGate: GainNode | null = null;
  private noiseGate: GainNode | null = null;
  private noiseLevel: GainNode | null = null;
  private delayFeedback: GainNode | null = null;
  private timer: number | null = null;
  private nextBeat = 0;
  private beat = 0;
  private bpm = 108;
  private onBeat: (beat: number) => void = () => undefined;

  get running(): boolean {
    return this.context?.state === 'running';
  }

  async start(patch: Patch, onBeat: (beat: number) => void): Promise<void> {
    if (!window.AudioContext) throw new Error('Web Audio is not available in this browser. Try a current browser.');
    if (this.context) await this.stop();
    this.context = new AudioContext({ latencyHint: 'interactive' });
    await this.context.resume();
    this.onBeat = onBeat;
    this.bpm = patch.bpm;
    this.buildGraph(patch);
    this.nextBeat = this.context.currentTime + 0.06;
    this.beat = 0;
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.schedule();
  }

  async stop(): Promise<void> {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    const context = this.context;
    this.context = null;
    this.ports.clear();
    this.oscillator = null;
    this.noise = null;
    this.oscGate = null;
    this.noiseGate = null;
    this.noiseLevel = null;
    this.delayFeedback = null;
    if (context && context.state !== 'closed') await context.close();
  }

  update(patch: Patch): void {
    this.bpm = patch.bpm;
    if (!this.context) return;
    const now = this.context.currentTime;
    const osc = this.oscillator;
    if (osc) {
      osc.type = patch.params.osc.wave;
      osc.frequency.setTargetAtTime(patch.params.osc.frequency, now, 0.015);
    }
    this.noiseLevel?.gain.setTargetAtTime(patch.params.noise.level, now, 0.015);
    const filter = this.ports.get('filter')?.input as BiquadFilterNode | undefined;
    filter?.frequency.setTargetAtTime(patch.params.filter.cutoff, now, 0.02);
    filter?.Q.setTargetAtTime(patch.params.filter.resonance, now, 0.02);
    const delay = this.ports.get('delay')?.input as DelayNode | undefined;
    delay?.delayTime.setTargetAtTime(patch.params.delay.time, now, 0.02);
    this.delayFeedback?.gain.setTargetAtTime(patch.params.delay.feedback, now, 0.02);
    const gain = this.ports.get('gain')?.input as GainNode | undefined;
    gain?.gain.setTargetAtTime(patch.params.gain.gain, now, 0.015);
    const speaker = this.ports.get('speaker')?.input as GainNode | undefined;
    speaker?.gain.setTargetAtTime(patch.params.speaker.volume * 0.42, now, 0.015);
  }

  reconnect(patch: Patch): void {
    if (!this.context) return;
    for (const [id, port] of this.ports) {
      if (id !== 'speaker') port.output?.disconnect();
    }
    const delay = this.ports.get('delay')?.output;
    if (delay && this.delayFeedback) {
      delay.connect(this.delayFeedback);
      this.delayFeedback.connect(this.ports.get('delay')!.input!);
    }
    patch.connections.forEach(({ from, to }) => {
      const output = this.ports.get(from)?.output;
      const input = this.ports.get(to)?.input;
      if (output && input) output.connect(input);
    });
  }

  private buildGraph(patch: Patch): void {
    const context = this.context!;
    const oscillator = context.createOscillator();
    const oscGate = context.createGain();
    oscGate.gain.value = 0.0001;
    oscillator.connect(oscGate);
    oscillator.start();

    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    noise.loop = true;
    const noiseLevel = context.createGain();
    const noiseGate = context.createGain();
    noiseGate.gain.value = 0.0001;
    noise.connect(noiseLevel).connect(noiseGate);
    noise.start();

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    const delay = context.createDelay(1);
    const delayFeedback = context.createGain();
    const gain = context.createGain();
    const speaker = context.createGain();
    speaker.connect(context.destination);

    this.oscillator = oscillator;
    this.noise = noise;
    this.oscGate = oscGate;
    this.noiseGate = noiseGate;
    this.noiseLevel = noiseLevel;
    this.delayFeedback = delayFeedback;
    this.ports = new Map<NodeId, NodePort>([
      ['osc', { input: null, output: oscGate }],
      ['noise', { input: null, output: noiseGate }],
      ['filter', { input: filter, output: filter }],
      ['delay', { input: delay, output: delay }],
      ['gain', { input: gain, output: gain }],
      ['speaker', { input: speaker, output: null }],
    ]);
    this.update(patch);
    this.reconnect(patch);
  }

  private schedule(): void {
    const context = this.context;
    if (!context) return;
    const secondsPerBeat = 60 / this.bpm;
    while (this.nextBeat < context.currentTime + 0.1) {
      const time = this.nextBeat;
      const length = Math.min(0.18, secondsPerBeat * 0.42);
      const oscLevel = this.beat % 4 === 0 ? 0.74 : 0.48;
      this.pulse(this.oscGate?.gain, time, length, oscLevel);
      this.pulse(this.noiseGate?.gain, time, Math.min(length, 0.075), 0.7);
      const beatNumber = this.beat;
      const wait = Math.max(0, (time - context.currentTime) * 1000);
      window.setTimeout(() => this.onBeat(beatNumber), wait);
      this.beat = (this.beat + 1) % 16;
      this.nextBeat += secondsPerBeat;
    }
  }

  private pulse(param: AudioParam | undefined, time: number, length: number, level: number): void {
    if (!param) return;
    param.cancelScheduledValues(time);
    param.setValueAtTime(0.0001, time);
    param.exponentialRampToValueAtTime(level, time + 0.008);
    param.exponentialRampToValueAtTime(0.0001, time + length);
  }
}
