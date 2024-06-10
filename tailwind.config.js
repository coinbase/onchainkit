/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        1: 'var(--ock-spacing-1)',
        2: 'var(--ock-spacing-2)',
      },
    },
  },
  plugins: [],
};
