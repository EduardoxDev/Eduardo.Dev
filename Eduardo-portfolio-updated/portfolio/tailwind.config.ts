import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', ...fontFamily.sans],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', ...fontFamily.mono],
      },
      colors: {
        bg: {
          DEFAULT: '#000000',
          2: '#0a0a0a',
          3: '#141414',
        },
        accent: {
          green: '#60a5fa',
          cyan: '#38bdf8',
          red: '#f87171',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          accent: 'rgba(96,165,250,0.25)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'blink': 'blink 1s step-end infinite',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        scan: {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(96,165,250,0.08), transparent)',
      },
      backgroundSize: {
        'grid': '64px 64px',
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#94a3b8',
            '--tw-prose-headings': '#e2e8f0',
            '--tw-prose-code': '#60a5fa',
            '--tw-prose-pre-bg': '#0d1218',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
