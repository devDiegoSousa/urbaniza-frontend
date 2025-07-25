module.exports = {
  content: [
    "./pages/**/*.{html}",
    "./src/script/global/**/*.{js}",
    "./src/script/pages/**/*.{js}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-black': '#121212',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
