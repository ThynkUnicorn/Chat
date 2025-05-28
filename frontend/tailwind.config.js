/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html,css}"
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        ...colors,
      },

      /* ------------ animations ------------ */
      keyframes: {
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulse: {                       // ⬅︎  added
          '0%, 80%, 100%': { opacity: 0.2 },
          '40%':           { opacity: 1   },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        pulse:  'pulse 1.2s infinite',   // ⬅︎  added
      },
    },
  },
  plugins: [],
}
