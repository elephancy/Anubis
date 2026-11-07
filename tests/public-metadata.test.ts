import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { metadata as hints } from '@/app/(anubis)/hints/page';
import { generateMetadata } from '@/app/(anubis)/leaderboard/page';

describe('public crawl routes', () => {
  it('lists only the three public entry pages, without puzzle or account URLs', () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      'https://anubis.elfeel.me/',
      'https://anubis.elfeel.me/hints',
      'https://anubis.elfeel.me/leaderboard',
    ]);
    expect(robots().sitemap).toBe('https://anubis.elfeel.me/sitemap.xml');
  });

  it('describes the public hints page rather than inheriting the homepage identity', () => {
    expect(hints.title).toContain('Hints');
    expect(hints.alternates.canonical).toBe('https://anubis.elfeel.me/hints');
  });

  it('gives distinct ranking pages their own canonical instead of consolidating to page one', async () => {
    const first = await generateMetadata({ searchParams: Promise.resolve({}) });
    const second = await generateMetadata({ searchParams: Promise.resolve({ pg: '2' }) });
    const invalid = await generateMetadata({ searchParams: Promise.resolve({ pg: '-1' }) });
    expect(first.alternates?.canonical).toBe('https://anubis.elfeel.me/leaderboard');
    expect(second.alternates?.canonical).toBe('https://anubis.elfeel.me/leaderboard?pg=2');
    expect(second.title).not.toEqual(first.title);
    expect(invalid.alternates?.canonical).toEqual(first.alternates?.canonical);
  });
});
