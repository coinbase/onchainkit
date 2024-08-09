/** @type {import('tailwindcss').Config} */
export default {
  content: ['./docs/**/*.{js,ts,jsx,tsx,md,mdx}'],
  important: true,
  darkMode: ['class'],
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
      keyframes: {
        fadeInRight: {
          '0%': {
            opacity: '0',
            transform: 'translate(2rem)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(0)',
          },
        },
      },
      animation: {
        enter: 'fadeInRight 500ms ease-out',
      },
    },
  },
  plugins: [],
};
