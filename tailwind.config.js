/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./criador-aeronaves.html",
    "./criador-navios.html",
    "./criador-veiculos-refatorado.html",
    "./dashboard.html",
    "./narrador.html",
    "./js/**/*.{js,ts,jsx,tsx}",
    "./templates/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b1020",
          soft: "#10172a",
          ring: "#1e293b"
        },
        brand: {
          50:"#fff7e6",
          100:"#ffefcc",
          200:"#ffe099",
          300:"#ffd166",
          400:"#ffc233",
          500:"#ffb400",
          600:"#e09f00",
          700:"#b37d00",
          800:"#805900",
          900:"#4d3600"
        }
      }
    }
  },
  plugins: [],
}
