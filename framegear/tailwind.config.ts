import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundColor: {
        content: '#27282B',
        banner: '#141519',
        'content-light': '#f3f3f3',
        farcaster: '#855DCD',
        input: '#191918',
        'input-light': '#DBDBDB',
        'link-button': '#2E3137',
        'button-gutter-light': '#CBC8C7',
      },
      borderColor: {
        button: '#cfd0d2',
        'pallette-line': 'rgba(138, 145, 158, 0.20)',
        light: '#CFD0D2',
      },
      maxWidth: {
        'layout-max': '1280px',
      },
    },
  },
  plugins: [],
};
export default config;
