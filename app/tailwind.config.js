/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        // MoVi brand — neon purple + lime green on black (from the logo)
        movi: {
          purple: '#8B2FE0',
          'purple-deep': '#5E1DA6',
          'purple-light': '#B57BF0',
          green: '#7ED321',
          'green-deep': '#5CA614',
          black: '#07060C',
          surface: '#0E0A18',
          card: '#160E28',
          border: '#2A1B45',
          muted: '#9B8FB5',
          red: '#FF4D6D',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'movi-gradient': 'linear-gradient(135deg, #8B2FE0 0%, #7ED321 100%)',
        'purple-gradient': 'linear-gradient(135deg, #8B2FE0 0%, #5E1DA6 100%)',
        'green-gradient': 'linear-gradient(135deg, #7ED321 0%, #5CA614 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0E0A18 0%, #07060C 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(139,47,224,0.08) 0%, rgba(126,211,33,0.03) 100%)',
        'glow': 'radial-gradient(ellipse at center, rgba(139,47,224,0.20) 0%, transparent 70%)',
      },
      animation: {
        'pulse-purple': 'pulsePurple 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulsePurple: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139, 47, 224, 0)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(139, 47, 224, 0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'purple': '0 0 24px rgba(139, 47, 224, 0.35)',
        'purple-lg': '0 0 48px rgba(139, 47, 224, 0.25)',
        'green': '0 0 24px rgba(126, 211, 33, 0.30)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
