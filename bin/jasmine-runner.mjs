import { lstatSync } from "fs"
import Jasmine from "jasmine"
import JasmineConsoleReporter from "jasmine-console-reporter"

const jasmine = new Jasmine()

const config = {
  "spec_dir": "src",
  "spec_files": [
    "**/*-test.mjs"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}

let execParams = process.argv.slice(2)
//console.log(`${execParams}`);

if (lstatSync(execParams[0]).isDirectory()) {
  config.spec_dir = execParams[0]
  execParams = []
}

jasmine.loadConfig(config)

jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

const reporter = new JasmineConsoleReporter({
  colors: 1,           // (0|false)|(1|true)|2
  cleanStack: 1,       // (0|false)|(1|true)|2|3
  verbosity: 4,        // (0|false)|1|2|(3|true)|4|Object
  listStyle: 'indent', // "flat"|"indent"
  timeUnit: 'ms',      // "ms"|"ns"|"s"
  timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
  activity: true,
  emoji: false,         // boolean or emoji-map object
  beep: true
})
jasmine.env.clearReporters()
jasmine.addReporter(reporter)

//console.log(config)
//console.log(execParams)

jasmine.execute(execParams)
