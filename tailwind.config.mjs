import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'rgb(217, 119, 66)',
        'accent-light': 'rgb(230, 150, 100)',
        'accent-dark': 'rgb(180, 90, 30)',
        text: 'var(--text)',
        'text-light': 'var(--text-light)',
        background: 'var(--background)',
        border: 'var(--border)',

        'dark-accent': 'rgb(230, 150, 100)',
        'dark-accent-light': 'rgb(217, 119, 66)',
        'dark-accent-dark': 'rgb(180, 90, 30)',
        'dark-text': '#f0f0f0',
        'dark-text-light': '#aaaaaa',
        'dark-background': '#252525',
        'dark-border': '#404040',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        handwritten: ['Caveat', 'cursive'],
      },
      keyframes: {
        fadeInDepth: {
          from: {
            opacity: '0',
            transform: 'scale(0.98)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'fade-in-depth': 'fadeInDepth 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
} 