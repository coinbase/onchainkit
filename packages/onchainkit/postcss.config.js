import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindcssAnimate from 'tailwindcss-animate';
import postcssImport from 'postcss-import';
import postcssPrefixClassnames from './plugins/postcss-prefix-classnames.js';

export default {
  plugins: [
    postcssImport(),
    tailwindcss({
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
            120: '30rem',
          },
          fontFamily: {
            display: 'DM Sans, sans-serif',
          },
        },
      },
      plugins: [tailwindcssAnimate],
    }),
    autoprefixer(),
    postcssPrefixClassnames({
      prefix: 'ock-',
    }),
  ],
};
