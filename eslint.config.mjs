import js from '@eslint/js';
import nextPlugin from 'eslint-config-next';
import globals from 'globals';

const nextConfigs = typeof nextPlugin === 'function' ? nextPlugin() : nextPlugin;

const config = [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      'node_modules/**',
      'levels/**/assets/**',
      'public/**',
    ],
  },
  {
    files: ['**/*.{js,cjs,jsx,ts,tsx}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...nextConfigs,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
    },
  },
  {
    files: ['tests/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];

export default config;

