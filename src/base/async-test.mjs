import { FuncList, waterfall } from './async.mjs'

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
        expect(err).toBeFalsy()
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
        expect(err).toBeTruthy()
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
        expect(err).toBeFalsy()
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
      (err) => {
        expect(err).toBeTruthy()
        done()
      }
    )
  })
})

describe('FuncList', () => {
  it('should succeed with 3 adds', (done) => {
    const funcs = new FuncList()
    const a = []
    funcs.add((done) => {
      a.push(1)
      done()
    })
    funcs.add(
      (done) => {
        a.push(2)
        done()
      },
      (done) => {
        a.push(3)
        done()
      }
    )
    funcs.run((err) => {
      expect(err).toBeFalsy()
      expect(a.length).toBe(3)
      expect(a[0]).toBe(1)
      expect(a[1]).toBe(2)
      expect(a[2]).toBe(3)
      done()
    })
  })
  it('should succeed with no funcs', (done) => {
    const funcs = new FuncList()
    funcs.run(done)
  })
  it('should succeed without done', (done) => {
    const funcs = new FuncList()
    funcs.run()
    done()
  })
  it('can throw error', (done) => {
    const funcs = new FuncList()
    let a = []
    funcs.add(
      (done) => {
        a.push(1)
        done()
      },
      (done) => {
        done(new Error('err1'))
      },
      (done) => {
        a.push(3)
        done()
      }
    )
    funcs.run((err) => {
      expect(err).toBeTruthy()
      expect(err.message).toBe('err1')
      expect(a.length).toBe(1)
      expect(a[0]).toBe(1)
      done()
    })
  })
})
