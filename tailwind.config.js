module.exports = {
  content: [
    "./content/**/*.md",
    "./static/js/*.js",
    "./content/**/*.html",
    "./templates/**/*.html",
  ],
  darkMode: "class", // 'media' or 'class'
  theme: {
    fontFamily: {
      sans: '"Quattrocento Sans", ui-sans-serif, system-ui, sans-serif',
      serif: '"Playfair Display", ui-serif, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
