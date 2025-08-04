import type { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'

// 2025-08-05
// @rollup/plugin-typescript ^12.1.4 의 출력 디렉토리 제한 문제.
// rollup 의 최종 출력이 tsconfig.json 의 outDir 아래에 있어야 한다고 오류가 난다.
// 나의 경우 tsc 는 build/client 아래에 출력하고,
// rollup 은 public/build/client-bundle.js 하게 되어 있다.
// 이렇게 출력 위치를 분리하는 것이 안 된다고 한다.
// rollup 용으로 tsconfig.json 을 한벌 더 만들면 되겠지만, 다른 플러그인을 찾아보자.

// 2025-08-05
// esbuild 로 갈아탔다.
// typescript 플러그인 필요없다. 그냥 된다.
// 출력 위치 자유롭게 지정할 수 있다.
// 빠르다.

const config: RollupOptions = {
  input: 'src-client/main.ts',
  output: {
    // file: 'public/build/client-bundle.js',
    file: 'build/client/client-bundle.js',
    sourcemap: true,
    format: 'iife',
    name: 'page',
  },
  watch: {
    include: [
      "src/common/**/*",
      "src-client/**/*"
    ]
  },
  plugins: [
    typescript({
      tsconfig: "src-client/tsconfig.json",
      // tsconfig: "tsconfig.rollup.json",
    }),
    //nodeResolve(),
  ]
}

export default config

