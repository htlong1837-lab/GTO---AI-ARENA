/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: '#9B1D20',
          'red-dark': '#741416',
          'red-light': '#C83337',
          vermilion: '#A8282B',
          cinnabar: '#BA2D2D',
          gold: '#C59338',
          'gold-light': '#DFB058',
          'gold-dark': '#9A6E20',
          'gold-foil': '#D4AF37',
          indigo: '#182747',
          'indigo-light': '#2A3F6D',
          'indigo-deep': '#0F1A30',
          jade: '#1D6246',
          'jade-light': '#2E8562',
          lotus: '#CA4F76',
          'lotus-light': '#E27A9C',
          purple: '#6B3074',
          ivory: '#FAF7F0',
          parchment: '#F3EDE2',
          'silk-cream': '#FAF7F2',
          'silk-warm': '#F4EFE6',
          'paper-do': '#EDE6D8',
          ink: '#111215',
          'ink-black': '#0D0E11',
          charcoal: '#1E1F24',
          sand: '#E8DFD0',
          border: '#E2D8C7',
          'border-gold': '#D4AF37',
          'border-dark': '#2E3039'
        },
        noir: {
          DEFAULT: '#08090B',
          card: '#0E0F12',
          surface: '#13151A',
          muted: '#1B1E24',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.15)',
        },
        genz: {
          accent: '#FF4757',
          vibe: '#5352ED',
          mint: '#2ED573',
          sun: '#FFA502'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif']
      },
      boxShadow: {
        'editorial': '0 20px 40px -15px rgba(27, 28, 34, 0.12)',
        'editorial-xl': '0 25px 50px -12px rgba(17, 18, 21, 0.15)',
        'floria-glow': '0 0 50px -10px rgba(197, 147, 56, 0.18)',
        'dark-card': '0 20px 50px -10px rgba(0, 0, 0, 0.5)',
        'silk': '0 8px 32px 0 rgba(155, 29, 32, 0.08)',
        'gold-glow': '0 0 25px -5px rgba(197, 147, 56, 0.35)',
        'gold-fine': '0 0 0 1px rgba(197, 147, 56, 0.25), 0 10px 25px -5px rgba(197, 147, 56, 0.12)',
        'card-hover': '0 20px 35px -10px rgba(17, 18, 21, 0.12), 0 0 1px 1px rgba(197, 147, 56, 0.15)',
        'red-glow': '0 0 25px -5px rgba(155, 29, 32, 0.35)'
      },
      backgroundImage: {
        'silk-texture': 'radial-gradient(ellipse at top, rgba(250, 247, 242, 0.98), rgba(244, 239, 230, 0.95))',
        'noir-gradient': 'linear-gradient(180deg, #08090B 0%, #0D0E12 100%)',
        'mesh-heritage': 'radial-gradient(at 0% 0%, rgba(155, 29, 32, 0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(197, 147, 56, 0.08) 0px, transparent 50%)',
        'gold-gradient': 'linear-gradient(135deg, #DFB058 0%, #C59338 50%, #9A6E20 100%)',
        'red-gradient': 'linear-gradient(135deg, #C83337 0%, #9B1D20 50%, #741416 100%)'
      }
    },
  },
  plugins: [],
}
