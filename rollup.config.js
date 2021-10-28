//import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/ts/client/all.ts',
  output: {
    file: 'public/build/client-rollup.js',
    sourcemap: true,
    format: 'iife',
    name: 'app',
  },
  watch: {
    include: [
      "src/ts/common/**/*",
      "src/ts/client/**/*"
    ]
  },
  plugins: [
    typescript({
      //tsconfig: "src/client/tsconfig.json",
      tsconfig: "tsconfig.rollup.json",
    }),
    //nodeResolve(),
  ]
})
