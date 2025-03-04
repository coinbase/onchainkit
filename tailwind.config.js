/** @type {import('tailwindcss').Config} */

import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: ['./src/**/*.{ts,tsx}'], // I think we can remove in v4
  darkMode: ['class'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      spacing: {
        88: '22rem',
        120: '30rem',
      },
      fontFamily: {
        display: 'DM Sans, sans-serif',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
