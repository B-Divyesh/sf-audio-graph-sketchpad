import { describe, expect, it } from 'vitest';
import {
  connectionError,
  decodeSession,
  encodeSession,
  hasPath,
  isValidSession,
  makeDefaultPatch,
  makeDefaultSession,
  makeDemoSession,
  SHARE_SESSION_ERROR,
} from '../../src/patch';

describe('graph rules', () => {
  it('finds downstream paths', () => {
    const graph = makeDefaultPatch().connections;
    expect(hasPath(graph, 'osc', 'speaker')).toBe(true);
    expect(hasPath(graph, 'speaker', 'osc')).toBe(false);
  });

  it('blocks source inputs, duplicates, and graph feedback', () => {
    const patch = makeDefaultPatch();
    expect(connectionError(patch, 'gain', 'osc')).toMatch(/sound source/);
    expect(connectionError(patch, 'osc', 'filter')).toMatch(/already exists/);
    expect(connectionError(patch, 'speaker', 'filter')).toMatch(/final output/);
    expect(connectionError(patch, 'gain', 'filter')).toMatch(/feedback loop/);
  });

  it('allows a useful parallel source route', () => {
    expect(connectionError(makeDefaultPatch(), 'noise', 'filter')).toBeNull();
  });
});

describe('share codec', () => {
  it('round-trips both A/B variants and unicode names', () => {
    const session = makeDefaultSession();
    session.variants.B.name = 'Bell lab №2';
    session.variants.B.params.filter.cutoff = 2345;
    const restored = decodeSession(encodeSession(session));
    expect(restored).toEqual(session);
  });

  it('rejects malformed and unsafe session values', () => {
    const session = makeDefaultSession();
    session.variants.A.params.delay.feedback = 4;
    expect(isValidSession(session)).toBe(false);
    expect(() => decodeSession('not-json')).toThrow(SHARE_SESSION_ERROR);
  });
});

describe('demo fixture', () => {
  it('keeps meaningful distinct A and B sample variants', () => {
    const demo = makeDemoSession();
    expect(demo.variants.A.name).toBe('Neon steps');
    expect(demo.variants.B.params.filter.cutoff).not.toBe(demo.variants.A.params.filter.cutoff);
    expect(demo.variants.B.connections).not.toEqual(demo.variants.A.connections);
  });
});
