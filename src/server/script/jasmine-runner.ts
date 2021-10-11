import { lstatSync } from 'fs'
import Jasmine from 'jasmine'

const jasmine = new Jasmine({})

jasmine.loadConfig({
  "spec_dir": "src/server",
  "spec_files": [
    "**/*-test.ts"
  ],
  "stopSpecOnExpectationFailure": false,
  "stopOnSpecFailure": true,
  "random": false,
  // "jsLoader": "import" // esm 을 .js 확장자로 읽을 때만 필요하다.
})

// jasmine.addReporter(new JasmineConsoleReporter({
//   colors: 1,           // (0|false)|(1|true)|2
//   cleanStack: 1,       // (0|false)|(1|true)|2|3
//   verbosity: 4,        // (0|false)|1|2|(3|true)|4|Object
//   listStyle: 'indent', // "flat"|"indent"
//   timeUnit: 'ms',      // "ms"|"ns"|"s"
//   timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
//   activity: true,
//   emoji: false,         // boolean or emoji-map object
//   beep: true
// }))

; (jasmine.jasmine as any).DEFAULT_TIMEOUT_INTERVAL = 15000

let execParams = process.argv.slice(2)
execParams.forEach((v, i) => {
  if (lstatSync(v).isDirectory()) {
    execParams[i] += '/**/*-test.ts'
  }
})

console.log(execParams)

jasmine.execute(execParams)
