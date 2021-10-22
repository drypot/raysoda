//import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/client/ts/_all.ts',
  output: {
    file: 'public/build/client-rollup.js',
    format: 'iife',
    name: 'app',
  },
  watch: {
    include: [
      "src/client/ts/**/*"
    ]
  },
  plugins: [
    typescript({
      tsconfig: "src/client/tsconfig.json",
      "sourceMap": true,
    }),
    //nodeResolve(),
  ]
})
