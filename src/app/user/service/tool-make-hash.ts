import { makePasswordHash } from './user-service-hash.js'

makePasswordHash(process.argv[2]).then(console.log)
