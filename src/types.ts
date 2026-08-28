export type NodeId = 'osc' | 'noise' | 'filter' | 'delay' | 'gain' | 'speaker';

export type NodeParams = {
  osc: { wave: OscillatorType; frequency: number };
  noise: { level: number };
  filter: { cutoff: number; resonance: number };
  delay: { time: number; feedback: number };
  gain: { gain: number };
  speaker: { volume: number };
};

export type Connection = { from: NodeId; to: NodeId };

export type Patch = {
  name: string;
  bpm: number;
  params: NodeParams;
  connections: Connection[];
};

export type Session = {
  version: 1;
  active: 'A' | 'B';
  variants: { A: Patch; B: Patch };
  calmMotion: boolean;
  edits: number;
};

export type NodeDefinition = {
  id: NodeId;
  name: string;
  kind: string;
  glyph: string;
  acceptsInput: boolean;
  sendsOutput: boolean;
};
