import { FuncList, waterfall } from './async.js'

describe('waterfall', () => {
  it('should work', (done) => {
    let i = 0
    waterfall(
      (done: Function) => {
        i++
        done(null)
      },
      (done: Function) => {
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
      (done: Function) => {
        i++
        done(new Error())
      },
      (done: Function) => {
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
  it('should work with param', (done) => {
    waterfall(
      (done: Function) => {
        done(null, 1, 2)
      },
      (p1: number, p2: number, done: Function) => {
        expect(p1).toBe(1)
        expect(p2).toBe(2)
        done(null, p1, p2, 3, 4)
      },
      (err: any, p1: number, p2: number, p3: number, p4: number) => {
        expect(err).toBeFalsy()
        expect(p1).toBe(1)
        expect(p2).toBe(2)
        expect(p3).toBe(3)
        expect(p4).toBe(4)
        done()
      }
    )
  })
  it('should work with param, err', (done) => {
    waterfall(
      (done: Function) => {
        done(null, 1, 2)
      },
      (p1: number, p2: number, done: Function) => {
        expect(p1).toBe(1)
        expect(p2).toBe(2)
        done('err')
      },
      (err: any) => {
        expect(err).toBeTruthy()
        done()
      }
    )
  })
})

describe('FuncList', () => {
  it('should work with 3 adds', (done) => {
    const funcs = new FuncList()
    const a: number[] = []
    funcs.add((done: Function) => {
      a.push(1)
      done()
    })
    funcs.add(
      (done: Function) => {
        a.push(2)
        done()
      },
      (done: Function) => {
        a.push(3)
        done()
      }
    )
    funcs.run((err: any) => {
      expect(err).toBeFalsy()
      expect(a.length).toBe(3)
      expect(a[0]).toBe(1)
      expect(a[1]).toBe(2)
      expect(a[2]).toBe(3)
      done()
    })
  })
  it('should work with no funcs', (done: Function) => {
    const funcs = new FuncList()
    funcs.run(done)
  })
  it('should work without done', (done: Function) => {
    const funcs = new FuncList()
    funcs.run()
    done()
  })
  it('can throw error', (done: Function) => {
    const funcs = new FuncList()
    let a: number[] = []
    funcs.add(
      (done: Function) => {
        a.push(1)
        done()
      },
      (done: Function) => {
        done(new Error('err1'))
      },
      (done: Function) => {
        a.push(3)
        done()
      }
    )
    funcs.run((err: any) => {
      expect(err).toBeTruthy()
      expect(err.message).toBe('err1')
      expect(a.length).toBe(1)
      expect(a[0]).toBe(1)
      done()
    })
  })
})
