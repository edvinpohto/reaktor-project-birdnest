/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "navbarBG": "#363B3F",
        "tableBG": "#2B3135",
        "whiteText": "#FFFFFF",
        "grayText": "#A1A3A5",
        "borderGray": "#4E5356",
        "xColor": "#717578",
        "titleBlack": "#0e1111"
      },
      width: {
        'fullGrid': '763px',
      },
      height: {
        'headerHeight': '38px',
      },
      fontSize: {
        // "normal": "14px",
        "small": "12px",
        "titleLarge": "25px"
      }
    },
  },
  plugins: [],
}
