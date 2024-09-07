/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
      },
      
      variants: {},

      fontFamily: {
        amatic: ["Amatic SC", "sans-serif"],
        dekko: ["Dekko", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      },

      colors: {
        primary: "#1D3557",
        secondary: "#F1FAEE",
        terciary: "#A8DADC",
        quaternary: "#E63946",
        quinary: "#FFD166"
      },
    },
    plugins: [],
  },
};