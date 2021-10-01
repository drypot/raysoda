import { checkHash, makeHash } from './hash.js'

describe('hash', () => {

  let hash: string

  it('makeHash', async () => {
    hash = await makeHash('abc')
  })
  it('checkHash', async () => {
    expect(await checkHash('abc', hash)).toBe(true)
  })
  it('checkHash fails if password invalid', async () => {
    expect(await checkHash('def', hash)).toBe(false)
  })
})
