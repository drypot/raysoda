module.exports = {
  mode: 'jit',
  purge: {
    content: ['src/server/web/template/ejs/**/*.{ejs}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
