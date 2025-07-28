module.exports = {
  content: [
    "./pages/**/*.{html}",
    "./src/script/global/**/*.{js}",
    "./src/script/pages/**/*.{js}",
    "./src/style/**/*.{css}",
  ],
  themeXXX: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "dark-black": "#121212",
        primary: "#166534",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
