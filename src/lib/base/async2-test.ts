import { setTimeout2 } from './async2.js'

describe('setTimeout2', () => {
  it('should work', done => {
    setTimeout2(0, () => {
      done()
    })
  })
})
