/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        axiom: {
          'bg-page':       '#1C1B23',
          'bg-panel':      '#14131A',
          'bg-card':       '#1E1D27',
          'bg-card-hover': '#232230',
          'bg-nav-active': '#2A2935',
          'border':        'rgba(255,255,255,0.06)',
          'accent':        '#8B5CF6',
          'accent-light':  '#A78BFA',
          'text-primary':  '#F5F5F7',
          'text-secondary':'#8B8A99',
          'text-tertiary': '#6B6A78',
          'success':       '#34D399',
          'danger':        '#F87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'app': '0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(139,92,246,0.08), 0 32px 64px rgba(0,0,0,0.6)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.4)',
        'glow-sm': '0 0 20px rgba(139,92,246,0.2)',
        'glow-md': '0 0 40px rgba(139,92,246,0.15)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
        'accent-gradient-subtle': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(167,139,250,0.08) 100%)',
      },
    },
  },
  plugins: [],
}
