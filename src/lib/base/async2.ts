export type Done = (err?: any) => void
type WaterfallMember = (done: Done) => void

class WaterfallRunner {
  private readonly funcs: WaterfallMember[]

  constructor(funcs: WaterfallMember[]) {
    this.funcs = funcs
  }

  run(done: Done) {
    let funcs = this.funcs
    let i = 0
    let e = funcs.length
    ;(function loop() {
      if (i === e) {
        return done()
      }
      funcs[i++]((err:any) => {
        if (err) return done(err)
        setImmediate(loop)
      })
    })()
  }
}

export function waterfall(...funcs: WaterfallMember[]): WaterfallRunner {
  return new WaterfallRunner(funcs)
}

export function setTimeout2(ms: number, callback: () => void) {
  setTimeout(callback, ms)
}
