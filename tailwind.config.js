const { url } = require('inspector');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'sea': "url('/public/sea-7484743_1920.jpg')",
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        btns: "rgb(var(--color-btns) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        bkg2: "rgb(var(--color-bkg2) / <alpha-value>)",
        btnText: "rgb(var(--color-btnText) / <alpha-value>)",
        tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
        highlights: "rgb(var(--color-highlights) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        pinkish: "rgb(var(--color-pinkish) / <alpha-value>)",
        permblack: "rgb(var(--color-permblack) / <alpha-value>)",
        mellowblue: "rgb(var(--color-mellowblue) / <alpha-value>)",
        darkmellowblue: "rgb(var(--color-darkmellowblue) / <alpha-value>)",
        mellowgreen: "rgb(var(--color-mellowgreen) / <alpha-value>)",
        darkmellowgreen: "rgb(var(--color-darkmellowgreen) / <alpha-value>)",
        mellowpurple: "rgb(var(--color-mellowpurple) / <alpha-value>)",
        darkmellowpurple: "rgb(var(--color-darkmellowpurple) / <alpha-value>)",
        mellowred: "rgb(var(--color-mellowred) / <alpha-value>)",
        darkmellowred: "rgb(var(--color-darkmellowred) / <alpha-value>)",
        mellowturquoise: "rgb(var(--color-mellowturquoise) / <alpha-value>)",
        darkmellowturquoise: "rgb(var(--color-darkmellowturquoise) / <alpha-value>)",
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
      },
      maxWidth: {
        "10xl": "1512px",
      },
      borderRadius: {
        "5xl": "40px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
