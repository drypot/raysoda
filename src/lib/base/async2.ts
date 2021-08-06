export type Done = (err?: any) => void
type WaterFallMember = ((done: Done) => void) | Done

export function waterfall(...funcs: WaterFallMember[]): void {
  let i = 0
  let e = funcs.length - 1
  let done: Done = funcs[e]

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
