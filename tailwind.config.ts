import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/app/**/*.{ts,tsx}','./src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-raleway)'],
        dots: ['var(--font-raleway-dots)'],
        gimmick: ['var(--font-orbitron)'],
        body: ['var(--font-raleway)']
      },
      colors: {
        concrete: { 50: '#f7f8fa', 100: '#eef1f3', 200: '#d8dee6', 800: '#1a1f27', 900: '#0b1016' },
        accent: '#b9924b',
        cyan: '#6ccff6',
        rose: '#f66cb1',
        moss: '#7fa17f',
        amber: '#f2b56b',
        purple: '#8e7cc3',
        linesDark: 'rgba(255,255,255,0.10)',
        linesLight: 'rgba(0,0,0,0.08)'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
}
export default config
