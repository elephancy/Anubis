import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Linter } from 'eslint';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { getRootDirs } = require('@next/eslint-plugin-next/dist/utils/get-root-dirs');
const nextPlugin = require('@next/eslint-plugin-next');
const fixtures: string[] = [];

afterEach(() => {
  for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true });
});

describe('Next ESLint root discovery with the scoped glob replacement', () => {
  it('discovers directory globs and arrays while excluding matching files', () => {
    const root = mkdtempSync(path.join(path.dirname(process.cwd()), 'anubis-eslint-'));
    fixtures.push(root);
    for (const name of ['one', 'two']) mkdirSync(path.join(root, 'apps', name), { recursive: true });
    writeFileSync(path.join(root, 'apps', 'file.txt'), 'not an application');
    const pattern = `${path.relative(process.cwd(), root).replaceAll('\\', '/')}/apps/*`;
    const expected = ['one', 'two'].map(name => path.join(root, 'apps', name)).sort();
    const discover = (rootDir: string | string[]) => getRootDirs({ cwd: root, settings: { next: { rootDir } } })
      .map((directory: string) => path.resolve(directory)).sort();

    expect(discover(pattern)).toEqual(expected);
    expect(discover([pattern])).toEqual(expected);
    expect(discover(`${root.replaceAll('\\', '/')}/apps/*`)).toEqual(expected);
    expect(getRootDirs({ cwd: root, settings: {} })).toEqual([root]);
  });

  it('preserves absolute paths on the system temporary drive', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'anubis-eslint-'));
    fixtures.push(root);
    mkdirSync(path.join(root, 'application'));
    const directories = getRootDirs({ cwd: process.cwd(), settings: {
      next: { rootDir: `${root.replaceAll('\\', '/')}/*` },
    } });

    expect(directories.map((directory: string) => path.resolve(directory)))
      .toEqual([path.join(root, 'application')]);
  });

  it('still rejects plain anchors to internal Next pages', () => {
    const root = mkdtempSync(path.join(path.dirname(process.cwd()), 'anubis-eslint-'));
    fixtures.push(root);
    const pages = path.join(root, 'pages');
    mkdirSync(pages);
    writeFileSync(path.join(pages, 'about.tsx'), 'export default function About() { return null; }');
    const messages = new Linter().verify('const link = <a href="/about/">About</a>;', [{
      files: ['**/*.jsx'],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      plugins: { next: nextPlugin },
      settings: { next: { rootDir: root } },
      rules: { 'next/no-html-link-for-pages': ['error', pages] },
    }], { filename: 'fixture.jsx' });

    expect(messages.map(message => message.ruleId)).toContain('next/no-html-link-for-pages');
  });
});
