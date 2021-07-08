import { waterfall } from './async2.mjs'

describe('waterfall', () => {
  it('should succeed', (done) => {
    let i = 0
    waterfall(
      (done) => {
        i++
        done(null)
      },
      (done) => {
        i++
        done(null)
      },
      (err) => {
        expect(err).toBeNull()
        expect(i).toBe(2)
        done()
      }
    )
  })
  it('should succeed with err', (done) => {
    let i = 0
    waterfall(
      (done) => {
        i++
        done(new Error())
      },
      (done) => {
        i++
        done(null)
      },
      (err) => {
        expect(err).toBeDefined()
        expect(i).toBe(1)
        done()
      }
    )
  })
  it('should succeed with param', (done) => {
    waterfall(
      (done) => {
        done(null, 1, 2)
      },
      (p1, p2, done) => {
        expect(p1).toBe(1)
        expect(p2).toBe(2)
        done(null, p1, p2, 3, 4)
      },
      (err, p1, p2, p3, p4) => {
        expect(err).toBeNull()
        expect(p1).toBe(1)
        expect(p2).toBe(2)
        expect(p3).toBe(3)
        expect(p4).toBe(4)
        done()
      }
    )
  })
  it('should succeed with param, err', (done) => {
    waterfall(
      (done) => {
        done(null, 1, 2)
      },
      (p1, p2, done) => {
        expect(p1).toBe(1)
        expect(p2).toBe(2)
        done('err')
      },
      (err, p1, p2, p3, p4) => {
        expect(err).toBeDefined()
        done()
      }
    )
  })
})
