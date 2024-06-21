import path from 'node:path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/**/*.{js,ts,jsx,tsx,md,mdx}',
    path.join(path.dirname(require.resolve('@coinbase/onchainkit')), '**/*.js'),
  ],
  darkMode: 'class',
  important: true,
  safelist: ['dark'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      fontFamily: {
        display: 'DM Sans, sans-serif',
      },
      textColor: {
        inverse: 'var(--text-inverse)',
        foreground: 'var(--text-foreground)',
        'foreground-muted': 'var(--text-foreground-muted)',
        error: 'var(--text-error)',
        primary: 'var(--text-primary)',
        success: 'var(--text-success)',
        warning: 'var(--text-warning)',
        disabled: 'var(--text-disabled)',
      },
      screens: {
        md: '848px',
      },
    },
  },
  plugins: [],
};
