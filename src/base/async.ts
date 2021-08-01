export function waterfall(...funcs: Function[]): void {
  let i = 0
  let e = funcs.length - 1
  let done = funcs[e]
  let params:any[] = [];
  (function loop() {
    if (i === e) {
      return done(null, ...params)
    }
    funcs[i++](...params, (err:any, ..._params:any[]) => {
      if (err) return done(err)
      params = _params
      setImmediate(loop)
    })
  })()
}

export class FuncList {
  constructor(
    public funcs: Function[] = []
  ) {
  }

  add(...funcs:Function[]) {
    this.funcs = [...this.funcs, ...funcs]
  }

  run(done?: Function) {
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
      func(function (err:any) {
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