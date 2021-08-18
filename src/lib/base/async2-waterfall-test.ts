import { waterfall } from './async2.js'

describe('waterfall', () => {
  it('basic structure', (done) => {
    waterfall(
      (done) => {
        done()
      },
      (done) => {
        done()
      }
    ).run(done)
  })
  it('has err handler', (done) => {
    let i = 0
    waterfall(
      (done) => {
        i++
        done()
      },
      (done) => {
        i++
        done()
      },
    ).run(err => {
      expect(err).toBeFalsy()
      expect(i).toBe(2)
      done()
    })
  })
  it('can throw err', (done) => {
    let i = 0
    waterfall(
      (done) => {
        i++
        done(new Error())
      },
      (done) => {
        i++
        done()
      }
    ).run(err => {
      expect(err).toBeTruthy()
      expect(i).toBe(1)
      done()
    })
  })
})
