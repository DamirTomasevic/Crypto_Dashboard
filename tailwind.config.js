/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-green': '#0DFF00',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'text-flicker': 'text-flicker 3s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shine': 'shine 5s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(13, 255, 0, 0.2)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(13, 255, 0, 0.6)'
          },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'text-flicker': {
          '0%, 100%': { textShadow: '0 0 4px rgba(13, 255, 0, 0.5), 0 0 10px rgba(13, 255, 0, 0.3)' },
          '50%': { textShadow: '0 0 4px rgba(13, 255, 0, 0.8), 0 0 15px rgba(13, 255, 0, 0.5), 0 0 20px rgba(13, 255, 0, 0.3)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', filter: 'blur(8px)' },
          '50%': { opacity: '0.6', filter: 'blur(12px)' },
        },
        'shine': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(13, 255, 0, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-size': '30px 30px',
      },
    },
  },
  plugins: [],
};