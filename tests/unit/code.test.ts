import { describe, expect, it } from 'vitest';
import { generateWebAudioCode } from '../../src/code';
import { makeDefaultPatch } from '../../src/patch';

describe('Web Audio code export', () => {
  it('serializes parameters and graph connections without network code', () => {
    const code = generateWebAudioCode(makeDefaultPatch());
    expect(code).toContain("filter.type = 'lowpass'");
    expect(code).toContain('oscillator.connect(filter)');
    expect(code).toContain('gain.connect(speaker)');
    expect(code).toContain('async function startPatch');
    expect(code).not.toContain('fetch(');
  });
});
