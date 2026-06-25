import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ff: {
          bg: '#f7f4ef',
          text: '#2d2825',
          green: '#2f7261',
          sage: '#5b9182',
          muted: '#a89d8e',
          'muted-d': '#8a7f70',
          'muted-l': '#b8ad9d',
          border: '#efe7da',
          'border-d': '#e7dfd3',
          ring: '#ece4d8',
          'green-pale': '#eaf1ee',
          done: '#f3efe7',
          card: '#ffffff',
          amber: '#b08948',
          'amber-bg': '#f5eee2',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        fade: 'ff-fade 260ms ease both',
        breathe: 'ff-breathe 6s ease-in-out infinite',
        'spin-slow': 'ff-spin 900ms linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
