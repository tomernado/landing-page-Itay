/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff3b6b',
          light:   '#ff8cab',
          purple:  '#c026d3',
        },
        night: {
          DEFAULT: '#080d1c',
          2:       '#0c1228',
          3:       '#0f1830',
        },
      },
      fontFamily: {
        heebo: ['"Heebo"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp .6s ease both',
        'twinkle':   'twinkle 7s ease-in-out infinite alternate',
        'meteor':    'meteorMove 8s linear infinite',
        'pulse-slow':'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%':   { opacity: '.85', filter: 'brightness(1)' },
          '100%': { opacity: '1',   filter: 'brightness(1.2)' },
        },
        meteorMove: {
          '0%':   { opacity: '0',    transform: 'translate3d(0,0,0) rotate(-32deg)' },
          '8%':   { opacity: '1' },
          '60%':  { opacity: '.2',  transform: 'translate3d(40vw,42vh,0) rotate(-32deg)' },
          '70%':  { opacity: '0' },
          '100%': { opacity: '0',    transform: 'translate3d(42vw,46vh,0) rotate(-32deg)' },
        },
      },
    },
  },
  plugins: [],
}
