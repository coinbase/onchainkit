import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Pixelify Sans", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "dpad-gradient":
          "linear-gradient(180deg, #1D1B1C 0%, #191718 81.19%, #252120 96.35%)",
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
        "dpad-hover": `
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
        "dpad-pressed": `
          inset 0px 0px 0.25px 1.25px #262524,
          inset 1px 1px 3px 3px #1A1818,
          inset 0px -1px 1px rgba(0, 0, 0, 0.5)
        `,
      },
      animation: {
        "fade-out": "1s fadeOut 3s ease-out forwards",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
