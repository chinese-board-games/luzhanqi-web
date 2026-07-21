import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// FlatCompat bridges eslint-plugin-react/jsx-a11y's classic
// "plugin:x/recommended" shareable configs into flat config - both still
// ship those in the pre-flat-config shape
const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

// ESLint 8's bare `eslint .` only ever matched *.js (jsx files were only
// linted via lint-staged's explicit glob at commit time) - listing every
// JS-family extension here makes `npm run lint` actually cover everything
// it always should have, including root-level .cjs config/scripts
const JS_FILES = ['**/*.{js,jsx,cjs,mjs}'];

export default [
  { ignores: ['**/build/**', '**/node_modules/**', '.claude/**'] },
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
    },
  },
];
