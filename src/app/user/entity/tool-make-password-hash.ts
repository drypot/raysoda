import { makePasswordHash } from './user-password.js'

makePasswordHash(process.argv[2]).then(console.log)
