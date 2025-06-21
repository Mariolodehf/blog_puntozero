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
        text: '#444444',
        'text-light': '#777777',
        background: '#fafafa',
        border: '#e0e0e0',

        'dark-accent': 'rgb(230, 150, 100)',
        'dark-accent-light': 'rgb(217, 119, 66)',
        'dark-accent-dark': 'rgb(180, 90, 30)',
        'dark-text': '#f0f0f0',
        'dark-text-light': '#aaaaaa',
        'dark-background': '#252525',
        'dark-border': '#404040',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 