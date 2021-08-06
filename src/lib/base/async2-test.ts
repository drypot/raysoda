import { Done, waterfall } from './async2.js'

describe('waterfall', () => {
  it('should work', (done) => {
    waterfall(
      (done: Done) => {
        done(null)
      },
      (done: Done) => {
        done(null)
      },
      done
    )
  })
  it('should work with err handler', (done) => {
    let i = 0
    waterfall(
      (done: Done) => {
        i++
        done(null)
      },
      (done: Done) => {
        i++
        done(null)
      },
      (err: any) => {
        expect(err).toBeFalsy()
        expect(i).toBe(2)
        done()
      }
    )
  })
  it('should work with err', (done) => {
    let i = 0
    waterfall(
      (done: Done) => {
        i++
        done(new Error())
      },
      (done: Done) => {
        i++
        done(null)
      },
      (err: any) => {
        expect(err).toBeTruthy()
        expect(i).toBe(1)
        done()
      }
    )
  })
})
