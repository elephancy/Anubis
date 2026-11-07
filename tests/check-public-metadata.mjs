import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const origin = 'http://127.0.0.1:18184';
const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  env: { ...process.env, HOSTNAME: '127.0.0.1', PORT: '18184' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', (chunk) => { output = (output + chunk).slice(-8000); });
server.stderr.on('data', (chunk) => { output = (output + chunk).slice(-8000); });
const request = (path) => fetch(`${origin}${path}`, { signal: AbortSignal.timeout(5000) });

try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${output}`);
    try {
      const response = await request('/robots.txt');
      if (response.ok) { ready = true; break; }
    } catch { /* Wait for the standalone server to listen. */ }
    await setTimeout(500);
  }
  assert.ok(ready, `Standalone server did not start: ${output}`);

  const robots = await (await request('/robots.txt')).text();
  assert.ok(robots.includes('Sitemap: https://anubis.elfeel.me/sitemap.xml'));
  const sitemap = await request('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get('content-type'), /xml/);
  assert.deepEqual([...((await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g))].map((match) => match[1]), [
    'https://anubis.elfeel.me/',
    'https://anubis.elfeel.me/hints',
    'https://anubis.elfeel.me/leaderboard',
  ]);

  const hints = await request('/hints');
  assert.equal(hints.status, 200);
  const html = await hints.text();
  assert.ok(html.includes('<title>Spoiler-Free Puzzle Hints | Anubis ARG</title>'));
  assert.ok(html.includes('rel="canonical" href="https://anubis.elfeel.me/hints"'));
  assert.ok(html.includes('No spoilers. All hints are in-level.'));
  console.log('Standalone public sitemap, robots and hints metadata passed');
} finally {
  server.kill();
}
