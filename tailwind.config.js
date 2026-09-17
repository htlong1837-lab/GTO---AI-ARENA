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
          gold: '#C59338',
          'gold-light': '#DFB058',
          'gold-dark': '#9A6E20',
          indigo: '#182747',
          'indigo-light': '#2A3F6D',
          jade: '#1D6246',
          'jade-light': '#2E8562',
          lotus: '#CA4F76',
          'lotus-light': '#E27A9C',
          purple: '#6B3074',
          ivory: '#FAF7F0',
          parchment: '#F3EDE2',
          ink: '#111215',
          charcoal: '#1E1F24',
          sand: '#E8DFD0',
          border: '#E2D8C7',
          'border-dark': '#2E3039'
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
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        'editorial': '0 20px 40px -15px rgba(27, 28, 34, 0.12)',
        'silk': '0 8px 32px 0 rgba(155, 29, 32, 0.08)',
        'gold-glow': '0 0 25px -5px rgba(197, 147, 56, 0.35)',
        'red-glow': '0 0 25px -5px rgba(155, 29, 32, 0.35)'
      },
      backgroundImage: {
        'silk-texture': 'radial-gradient(ellipse at top, rgba(250, 247, 240, 0.95), rgba(243, 237, 226, 0.98))',
        'mesh-heritage': 'radial-gradient(at 0% 0%, rgba(155, 29, 32, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(197, 147, 56, 0.08) 0px, transparent 50%)'
      }
    },
  },
  plugins: [],
}
