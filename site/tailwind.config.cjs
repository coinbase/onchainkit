/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./docs/**/*.{js,ts,jsx,tsx,md,mdx}'],
  darkMode: 'class',
  important: true,
  theme: {
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
