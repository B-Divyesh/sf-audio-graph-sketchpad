import type { Connection, NodeDefinition, NodeId, Patch, Session } from './types';

export const NODE_DEFINITIONS: NodeDefinition[] = [
  { id: 'osc', name: 'Oscillator', kind: 'Source', glyph: 'OSC', acceptsInput: false, sendsOutput: true },
  { id: 'noise', name: 'Noise', kind: 'Source', glyph: 'RND', acceptsInput: false, sendsOutput: true },
  { id: 'filter', name: 'Filter', kind: 'Shape', glyph: 'FLT', acceptsInput: true, sendsOutput: true },
  { id: 'delay', name: 'Delay', kind: 'Space', glyph: 'DLY', acceptsInput: true, sendsOutput: true },
  { id: 'gain', name: 'Gain', kind: 'Level', glyph: 'AMP', acceptsInput: true, sendsOutput: true },
  { id: 'speaker', name: 'Speaker', kind: 'Output', glyph: 'OUT', acceptsInput: true, sendsOutput: false },
];

export const NODE_IDS = NODE_DEFINITIONS.map((node) => node.id);
export const SHARE_SESSION_ERROR = 'This share link does not contain a compatible Patchboard session.';

export function makeDefaultPatch(): Patch {
  return {
    name: 'First light',
    bpm: 108,
    params: {
      osc: { wave: 'sawtooth', frequency: 164.81 },
      noise: { level: 0.16 },
      filter: { cutoff: 920, resonance: 3.2 },
      delay: { time: 0.24, feedback: 0.28 },
      gain: { gain: 0.52 },
      speaker: { volume: 0.5 },
    },
    connections: [
      { from: 'osc', to: 'filter' },
      { from: 'filter', to: 'delay' },
      { from: 'delay', to: 'gain' },
      { from: 'gain', to: 'speaker' },
    ],
  };
}

export function makeDefaultSession(): Session {
  const patch = makeDefaultPatch();
  return {
    version: 1,
    active: 'A',
    variants: { A: structuredClone(patch), B: structuredClone(patch) },
    calmMotion: false,
    edits: 0,
  };
}

export function makeDemoSession(): Session {
  const session = makeDefaultSession();
  session.variants.A.name = 'Neon steps';
  session.variants.B.name = 'Neon steps — bright echo';
  session.variants.B.params.filter.cutoff = 2600;
  session.variants.B.params.filter.resonance = 7.5;
  session.variants.B.params.delay.time = 0.36;
  session.variants.B.params.delay.feedback = 0.42;
  session.variants.B.connections.push({ from: 'noise', to: 'filter' });
  return session;
}

export function hasPath(connections: Connection[], start: NodeId, goal: NodeId): boolean {
  const seen = new Set<NodeId>();
  const visit = (node: NodeId): boolean => {
    if (node === goal) return true;
    if (seen.has(node)) return false;
    seen.add(node);
    return connections.filter((edge) => edge.from === node).some((edge) => visit(edge.to));
  };
  return visit(start);
}

export function connectionError(patch: Patch, from: NodeId, to: NodeId): string | null {
  const source = NODE_DEFINITIONS.find((node) => node.id === from)!;
  const target = NODE_DEFINITIONS.find((node) => node.id === to)!;
  if (from === to) return 'A module cannot feed itself.';
  if (!source.sendsOutput) return 'Speaker is the final output and cannot send a cable.';
  if (!target.acceptsInput) return `${target.name} is a sound source and cannot receive a cable.`;
  if (patch.connections.some((edge) => edge.from === from && edge.to === to)) return 'That cable already exists.';
  if (hasPath(patch.connections, to, from)) return 'That cable would create a feedback loop.';
  return null;
}

function isNodeId(value: unknown): value is NodeId {
  return typeof value === 'string' && NODE_IDS.includes(value as NodeId);
}

export function isValidPatch(value: unknown): value is Patch {
  if (!value || typeof value !== 'object') return false;
  const patch = value as Partial<Patch>;
  if (typeof patch.name !== 'string' || typeof patch.bpm !== 'number' || patch.bpm < 40 || patch.bpm > 240) return false;
  if (!patch.params || !Array.isArray(patch.connections)) return false;
  const params = patch.params as Partial<Patch['params']>;
  const inRange = (number: unknown, min: number, max: number): number is number =>
    typeof number === 'number' && Number.isFinite(number) && number >= min && number <= max;
  const waves: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
  if (!params.osc || !waves.includes(params.osc.wave) || !inRange(params.osc.frequency, 55, 880)) return false;
  if (!params.noise || !inRange(params.noise.level, 0, 0.5)) return false;
  if (!params.filter || !inRange(params.filter.cutoff, 80, 12000) || !inRange(params.filter.resonance, 0.1, 18)) return false;
  if (!params.delay || !inRange(params.delay.time, 0, 0.8) || !inRange(params.delay.feedback, 0, 0.72)) return false;
  if (!params.gain || !inRange(params.gain.gain, 0, 1)) return false;
  if (!params.speaker || !inRange(params.speaker.volume, 0, 1)) return false;
  const built: Connection[] = [];
  for (const edge of patch.connections) {
    if (!edge || !isNodeId(edge.from) || !isNodeId(edge.to)) return false;
    const partial = { ...patch, connections: built } as Patch;
    if (connectionError(partial, edge.from, edge.to)) return false;
    built.push(edge);
  }
  return true;
}

export function isValidSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<Session>;
  const edits = session.edits;
  return session.version === 1 && (session.active === 'A' || session.active === 'B') &&
    !!session.variants && isValidPatch(session.variants.A) && isValidPatch(session.variants.B) &&
    typeof session.calmMotion === 'boolean' && typeof edits === 'number' && Number.isInteger(edits) && edits >= 0;
}

export function encodeSession(session: Session): string {
  const json = JSON.stringify(session);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSession(value: string): Session {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!isValidSession(parsed)) throw new Error(SHARE_SESSION_ERROR);
    return parsed;
  } catch {
    // URL fragments are user-controlled. Never expose browser codec/parser
    // implementation details in the product's recovery path.
    throw new Error(SHARE_SESSION_ERROR);
  }
}
