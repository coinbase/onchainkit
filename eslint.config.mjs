import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    ignores: [
      '**/coverage',
      '**/public',
      '**/dist',
      '**/esm',
      '**/.next',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      '.changeset',
      'packages/create-onchain',
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  eslintPluginPrettierRecommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    rules: {
      complexity: ['error', 10],
      'no-restricted-imports': ['error', 'node:*'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      // 'sort-keys': [
      //   'error',
      //   'asc',
      //   { caseSensitive: true, natural: false, minKeys: 2 },
      // ],
      '@typescript-eslint/parameter-properties': [
        'error',
        { prefer: 'class-property' },
      ],
      // 'id-match': ['error', '^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$'],
      'no-lonely-if': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    },
  },
];
