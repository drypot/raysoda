import { checkPasswordHash, makePasswordHash } from './user-password.js'

describe('makePasswordHash/checkPassword', () => {

  it('should work', async () => {
    const hash = await makePasswordHash('abc')
    expect(await checkPasswordHash('abc', hash)).toBe(true)
    expect(await checkPasswordHash('def', hash)).toBe(false)
  })

})
