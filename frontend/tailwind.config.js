/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A0E1A',
          light: '#121828',
          medium: '#1a2540',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#a8882e',
        },
        muted: '#7B8AAB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.6)' } },
      },
    },
  },
  plugins: [],
};
