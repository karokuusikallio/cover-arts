/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spotartPurple: "#905E96",
        spotartLightPurple: "#D58BDD",
        whiteOpacity: "rgba(255,255,255,0.5)",
      },
      backgroundImage: {
        "record-wall": "url('/img/record-wall.jpg')",
        "record-store": "url('/img/record-store.jpg')",
        record: "url('/img/record.jpg')",
      },
      boxShadow: {
        footer: "0px -4px 3px rgba(0, 0, 0, 0.07)",
        smallShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)",
      },
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(316px, 316px));",
      },
    },
  },
  plugins: [],
};
