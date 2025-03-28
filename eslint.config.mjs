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
      'no-lonely-if': 'error',
      'no-restricted-imports': ['error', 'node:*'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/parameter-properties': [
        'error',
        { prefer: 'class-property' },
      ],

      // TODO: These rules are temporarily disabled due to existing errors in codebase
      // They will be enabled and fixed as soon as the worskapce PR is merged
      complexity: ['off', 10],
      'no-unused-vars': 'off',
      'sort-keys': [
        'off',
        'asc',
        { caseSensitive: true, natural: false, minKeys: 2 },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
