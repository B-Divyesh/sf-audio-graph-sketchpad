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
});
