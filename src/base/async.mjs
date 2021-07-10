export function waterfall(...funcs) {
  let i = 0
  let e = funcs.length - 1
  let done = funcs[e]
  let params = [];
  (function loop() {
    if (i === e) {
      return done(null, ...params)
    }
    funcs[i++](...params, (err, ..._params) => {
      if (err) return done(err)
      params = _params
      setImmediate(loop)
    })
  })()
}

export class FuncList {
  constructor() {
    this.funcs = []
  }

  add(...funcs) {
    this.funcs = [...this.funcs, ...funcs]
  }

  run(done) {
    const funcs = this.funcs
    let i = 0;
    (function run() {
      if (i === funcs.length) {
        if (done)
          return done()
        else
          return
      }
      let func = funcs[i++]
      func(function (err) {
        if (err) {
          if (done) {
            return done(err)
          }
          throw err
        }
        setImmediate(run)
      })
    })()
  }
}
