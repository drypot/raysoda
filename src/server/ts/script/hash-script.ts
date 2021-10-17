import { makeHash } from '@common/util/hash'

makeHash(process.argv[2]).then(console.log)
