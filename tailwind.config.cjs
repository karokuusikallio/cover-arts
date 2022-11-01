/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spotartPurple: "#905E96",
        spotartLightPurple: "#D58BDD",
      },
      backgroundImage: {
        "record-store": "url('../../public/pexels-lopsan-2191013.jpg')",
      },
    },
  },
  plugins: [],
};
