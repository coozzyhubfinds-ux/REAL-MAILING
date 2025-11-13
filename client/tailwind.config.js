/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b0b0f',
        neonPink: '#ff2d95',
        electricPink: '#ff5db1',
        slateGray: '#1f1f2e'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(255,45,149,0.9), rgba(11,11,15,0.95))'
      },
      boxShadow: {
        glow: '0 20px 40px -15px rgba(255,45,149,0.65)'
      }
    }
  },
  plugins: []
};

