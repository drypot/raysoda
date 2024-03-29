export function dupe(src: any) {
  if (!(src instanceof Object)) {
    return src
  }
  if (src instanceof Array) {
    const a: any[] = []
    for (const e of src) {
      if (e instanceof Object) {
        a.push(dupe(e))
      } else {
        a.push(e)
      }
    }
    return a
  }
  if (src instanceof Date) {
    return new Date(src.getTime())
  }
  const obj: any = {}
  for (const [k, v] of Object.entries(src)) {
    if (v instanceof Object) {
      obj[k] = dupe(v)
    } else {
      obj[k] = v
    }
  }
  return obj
}
