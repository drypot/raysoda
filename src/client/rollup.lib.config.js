import nodeResolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/client/lib.js',
  output: {
    file: 'public/build/lib-rollup.js',
    format: 'iife',
    name: 'lib',
  },
  plugins: [
    nodeResolve(),
  ]
})
