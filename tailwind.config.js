module.exports = {
  mode: 'jit',
  purge: {
    content: ['src/server/web/template/ejs/**/*.{ejs}'],
    // extractors: [
    //   {
    //     extractor: require('purgecss-from-pug'),
    //     extensions: ['pug']
    //   }
    // ]
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
