import { makeHash } from '../_util/hash'

makeHash(process.argv[2]).then(console.log)
