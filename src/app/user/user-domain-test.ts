import { checkPassword, makePasswordHash, newUser, User } from './user-domain.js'
import { Done, waterfall } from '../../lib/base/async2.js'

describe('User', () => {
  it('can be created', () => {
    const user = newUser()
    expect(user).toBeDefined()
    expect(user.id).toBe(0)
    expect(user.status).toBe('v')
  })
})

describe('makePasswordHash/checkPassword', () => {
  it('should work', done => {
    let hash: string
    waterfall(
      (done: Done) => {
        makePasswordHash('abc', (err, _hash) => {
          expect(err).toBeFalsy()
          hash = _hash
          done()
        })
      },
      (done: Done) => {
        checkPassword('abc', hash, (err, matched) => {
          expect(err).toBeFalsy()
          expect(matched).toBe(true)
          done()
        })
      },
      (done: Done) => {
        checkPassword('def', hash, (err, matched) => {
          expect(err).toBeFalsy()
          expect(matched).toBe(false)
          done()
        })
      },
      done
    )
  })

})
