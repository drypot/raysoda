import { makeHash } from '../_util/hash.js'

makeHash(process.argv[2]).then(console.log)
