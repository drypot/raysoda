import { inDev, inProduction } from './env2.js'

describe('inDev', () => {
  it('1', () => {
    expect(inDev()).toBeTrue()
  })
})

describe('inProduction', () => {
  it('1', () => {
    expect(inProduction()).toBeFalse()
  })
})
