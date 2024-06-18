/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
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
    },
  },
  plugins: [],
};
