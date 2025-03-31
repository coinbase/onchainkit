import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  safelist: ['dark'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Pixelify Sans', 'serif'],
      },
      boxShadow: {
        dpad: `
          inset 0px 0px 0.25px 1.25px #262524,
          inset 3px 5px 2px -4.75px #FFFFFF,
          inset 1.25px 1.5px 0px rgba(0, 0, 0, 0.75),
          inset 0px 4.75px 0.25px -2.5px #FBFBFB,
          inset 1px 1px 3px 3px #1A1818,
          inset 0px -3px 1px rgba(0, 0, 0, 0.5),
          inset 2.5px -2px 3px rgba(124, 108, 94, 0.75),
          inset 0px -3px 3px 1px rgba(255, 245, 221, 0.1)
        `,
        'dpad-hover': `
          inset 0px 0px 0.25px 1.25px #262524,
          inset 3px 5px 2px -4.75px #FFFFFF,
          inset 1.25px 1.5px 0px rgba(0, 0, 0, 0.75),
          inset 0px 4.75px 0.25px -2.5px #FBFBFB,
          inset 1px 1px 3px 3px #1A1818,
          inset 0px -3px 1px rgba(0, 0, 0, 0.5),
          inset 2.5px -2px 3px rgba(124, 108, 94, 0.75),
          inset 0px -3px 3px 1px rgba(255, 245, 221, 0.4),
          0px 0px 10px 1px rgba(255, 255, 255, 0.4)
        `,
        'dpad-pressed': `
          inset 0px 0px 0.25px 1.25px #262524,
          inset 1px 1px 3px 3px #1A1818,
          inset 0px -1px 1px rgba(0, 0, 0, 0.5)
        `,
      },
      animation: {
        'fade-out': '1s fadeOut 3s ease-out forwards',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dpad-gradient':
          'linear-gradient(180deg, #1D1B1C 0%, #191718 81.19%, #252120 96.35%)',
      },
    },
    colors: {
      ...colors,
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    keyframes: {
      'accordion-down': {
        from: {
          height: '0',
        },
        to: {
          height: 'var(--radix-accordion-content-height)',
        },
      },
      'accordion-up': {
        from: {
          height: 'var(--radix-accordion-content-height)',
        },
        to: {
          height: '0',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
