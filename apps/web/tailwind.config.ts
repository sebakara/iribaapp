import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf8f4',
          100: '#d3efe6',
          200: '#a8dfce',
          300: '#72c7b0',
          400: '#3fa890',
          500: '#268672',
          600: '#1c6b5c',
          700: '#18564b',
          800: '#16453d',
          900: '#143a34',
          950: '#0a211e',
        },
        ink: {
          DEFAULT: '#12201c',
          muted: '#2a3d37',
        },
        canvas: '#f3efe6',
        sand: {
          50: '#faf7f1',
          100: '#f3efe6',
          200: '#e7e0d2',
          300: '#d4c9b4',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 32, 28, 0.04), 0 8px 24px rgba(18, 32, 28, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
