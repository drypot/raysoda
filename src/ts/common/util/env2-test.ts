import { inDev, inProduction } from '@common/util/env2'

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
