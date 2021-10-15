module.exports = {
  mode: 'jit',
  purge: {
    content: ['src/server-template/ejs/**/*.{ejs}'],
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
