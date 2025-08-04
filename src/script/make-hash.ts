import { makeHash } from '../util/hash.ts'

makeHash(process.argv[2]).then(console.log)
