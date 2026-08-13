import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// FlatCompat bridges eslint-plugin-react/jsx-a11y's classic
// "plugin:x/recommended" shareable configs into flat config
const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

const JS_FILES = ['**/*.{js,jsx,cjs,mjs}'];

export default [
  {
    ignores: [
      '**/build/**',
      '**/node_modules/**',
      '.claude/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  ...compat
    .extends('plugin:react/recommended', 'plugin:jsx-a11y/recommended')
    .map((config) => ({ ...config, files: JS_FILES })),
  { ...prettierRecommended, files: JS_FILES },
  {
    files: JS_FILES,
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      'jsx-a11y/label-has-associated-control': 0,
      semi: 1,
      'no-plusplus': [
        'warn',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'prettier/prettier': ['warn', { semi: true }],
      // debug output goes through utils/logger so it stays out of deployed
      // builds; warnings and errors are the client-side signal when something
      // breaks for a real player, so they're allowed straight through
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  // the Playwright suite, its config, and the build scripts run in node, not
  // the browser - and a build script's console output is its whole point, so
  // the no-console rule that keeps debug logging out of the app doesn't apply
  {
    files: ['e2e/**/*.js', 'playwright.config.js', 'scripts/**'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },
];
