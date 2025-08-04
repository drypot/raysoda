import { makeHash } from '../common/util/hash.ts'

makeHash(process.argv[2]).then(console.log)
