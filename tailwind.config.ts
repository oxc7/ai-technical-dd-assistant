import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0b12',
        panel: '#141726',
        'panel-2': '#191d30',
        border: '#262b42',
        dim: '#a2a8c0',
        faint: '#737a97',
        accent: '#7c5cff',
        'accent-2': '#34e0d0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
