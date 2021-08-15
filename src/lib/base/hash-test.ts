import { checkHash, makeHash } from './hash.js'

describe('hash', () => {

  let hash: string

  it('makeHash should work', async () => {
    hash = await makeHash('abc')
  })
  it('checkHash should ok', async () => {
    expect(await checkHash('abc', hash)).toBe(true)
  })
  it('checkHash should fail with invalid pw', async () => {
    expect(await checkHash('def', hash)).toBe(false)
  })

})
