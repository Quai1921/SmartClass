module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1D2E',
        primary: '#F5A623',
        secondary: '#4CAF50',
        'surface-variant': '#49454F',
        surface2: '#1D1B20',
        surface: '#2B3646',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B6C1',
        'accent-blue': '#0099FF',
        success: '#00C853',
        warning: '#FFAB00',
        error: '#FF5252',
        'zinc-500': '#71717A',
      },
      keyframes: {
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-down": "slide-in-down 0.5s ease-out",
        "slide-in-up": "slide-in-up 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
    },  },
  plugins: [],
};