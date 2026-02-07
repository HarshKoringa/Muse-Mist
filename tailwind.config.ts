import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          main: "var(--bg-main)",
          "soft-alt": "var(--bg-soft-alt)",
          surface: "var(--surface)",
          ink: "var(--ink-main)",
          "ink-muted": "var(--ink-muted)",
          border: "var(--border-subtle)",
          lilac: "var(--accent-lilac)",
          "lilac-soft": "var(--accent-lilac-soft)",
          sky: "var(--accent-sky)",
          footer: "var(--footer-bg)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
        ],
      },
      keyframes: {
        blob: {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        blob: "blob 8s infinite",
        "fade-in": "fadeIn 0.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
