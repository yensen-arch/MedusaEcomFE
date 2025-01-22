module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include your React files
  ],
  theme: {
    extend: {
      fontFamily:{
        aboutUs: ["Neue-Helvetica", "Helvetica", "Arial", "sans-serif"]
      },
      backgroundImage: {
        'career-bg' : "url('https://static.zara.net/photos//contents/mkt/spots/ss24-zara-careers/layout//ss24-zara-careers-layout-layout-e47f898edc7eb4e3a2d9394847c9707b9ac5070a-crop-1-778_0.jpg?ts=1735223003955&imwidth=1920')",
      }
    },
  },
  plugins: [],
};
