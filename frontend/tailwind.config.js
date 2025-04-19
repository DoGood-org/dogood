// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#e6f8f9',
          100: '#cbf1f3',
          200: '#9be5e9',
          300: '#6cd8df',
          400: '#3dced7',
          500: '#1d8a99',
          600: '#13727d',
          700: '#0a5c67',
          800: '#03474f',
          900: '#003239',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
