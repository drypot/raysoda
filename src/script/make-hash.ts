import { makeHash } from '../common/util/hash.js'

makeHash(process.argv[2]).then(console.log)
