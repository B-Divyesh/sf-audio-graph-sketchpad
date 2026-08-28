import type { NodeId, Patch } from './types';

const variableNames: Record<NodeId, string> = {
  osc: 'oscillator',
  noise: 'noise',
  filter: 'filter',
  delay: 'delay',
  gain: 'gain',
  speaker: 'speaker',
};

export function generateWebAudioCode(patch: Patch): string {
  const connections = patch.connections
    .map(({ from, to }) => `  ${variableNames[from]}.connect(${variableNames[to]});`)
    .join('\n');

  return `async function startPatch(context = new AudioContext()) {
  await context.resume();

  const oscillator = context.createOscillator();
  oscillator.type = ${JSON.stringify(patch.params.osc.wave)};
  oscillator.frequency.value = ${patch.params.osc.frequency};

  const noise = context.createBufferSource();
  const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let index = 0; index < noiseData.length; index += 1) {
    noiseData[index] = Math.random() * 2 - 1;
  }
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = ${patch.params.filter.cutoff};
  filter.Q.value = ${patch.params.filter.resonance};

  const delay = context.createDelay(1);
  delay.delayTime.value = ${patch.params.delay.time};
  const delayFeedback = context.createGain();
  delayFeedback.gain.value = ${patch.params.delay.feedback};
  delay.connect(delayFeedback).connect(delay);

  const gain = context.createGain();
  gain.gain.value = ${patch.params.gain.gain};
  const speaker = context.createGain();
  speaker.gain.value = ${patch.params.speaker.volume * 0.42};
  speaker.connect(context.destination);

${connections}

  oscillator.start();
  noise.start();
  return { context, nodes: { oscillator, noise, filter, delay, gain, speaker } };
}`;
}
