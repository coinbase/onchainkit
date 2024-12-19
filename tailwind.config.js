/** @type {import('tailwindcss').Config} */

import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  safelist: ['dark'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      spacing: {
        88: '22rem',
      },
      fontFamily: {
        display: 'DM Sans, sans-serif',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
