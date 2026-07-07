import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.json', './messages/**/*.json'],
  theme: {
    extend: {
      colors: {
        olive: '#6F7243',
        'olive-dark': '#565932',
        'olive-light': '#A4A887',
        sand: '#F5F0E8',
        cream: '#FAF7F2',
        earth: '#2C1810',
        dusk: '#1A1A14',
        mist: '#EDE8DF'
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif']
      },
      keyframes: {
        breathe: {
          '0%, 100%': {transform: 'scale(1)'},
          '50%': {transform: 'scale(1.06)'}
        },
        drift: {
          '0%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(8px)'},
          '100%': {transform: 'translateY(0)'}
        }
      },
      animation: {
        breathe: 'breathe 20s ease-in-out infinite',
        drift: 'drift 2.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
