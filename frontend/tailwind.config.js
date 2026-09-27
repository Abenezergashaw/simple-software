/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#07111f',
          light: '#0f172a',
          medium: '#002b45',
        },
        gold: {
          DEFAULT: '#00d2ff',
          light: '#6eeaff',
          dark: '#009cc7',
        },
        muted: '#8fa8bb',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(0,210,255,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(0,210,255,0.45)' } },
      },
    },
  },
  plugins: [],
};
