module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  jsxSingleQuote: false,
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['clsx'],
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json-stringify',
      },
    },
  ],
};
