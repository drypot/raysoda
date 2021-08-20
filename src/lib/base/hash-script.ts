import { makeHash } from './hash.js'

makeHash(process.argv[2]).then(console.log)
