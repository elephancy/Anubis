import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://anubis.elfeel.me/' },
    { url: 'https://anubis.elfeel.me/hints' },
    { url: 'https://anubis.elfeel.me/leaderboard' },
  ];
}
