import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('static hosting structure', () => {
  it('routes missing pages to a designed 404 without a catch-all rewrite', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  it('ships required metadata and crawl files', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain('rel="apple-touch-icon"');
    expect(readFileSync('public/robots.txt', 'utf8')).toContain('Sitemap:');
    expect(readFileSync('public/sitemap.xml', 'utf8')).toContain('<urlset');
  });

  it('maps every registered claim to exactly one tagged browser test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{
      id: string;
      claim: string;
      where: string;
      test: string;
      sandbox: string;
    }>;
    const claimTests = readFileSync('tests/e2e/claims.spec.ts', 'utf8');
    const tags = [...claimTests.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);

    expect(claims).toHaveLength(16);
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    expect([...tags].sort()).toEqual(claims.map(({ id }) => id).sort());
    for (const claim of claims) {
      expect(claim.claim.length).toBeGreaterThan(0);
      expect(claim.where.length).toBeGreaterThan(0);
      expect(claim.sandbox.length).toBeGreaterThan(0);
      expect(claim.test).toBe(`npm run test:claims -- --grep @claim:${claim.id}`);
      expect(tags.filter((tag) => tag === claim.id)).toHaveLength(1);
    }
  });
});
