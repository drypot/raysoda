
export function limitNumber(v: number, min: number, max: number) {
  if (!isNaN(min)) {
    v = Math.max(v, min)
  }
  if (!isNaN(max)) {
    v = Math.min(v, max)
  }
  return v
}

export function newNumber(v: any, def: number = 0) {
  if (v === undefined) {
    return def
  }
  if (v === null) {
    return def
  }
  const v2 = parseInt(v)
  if (Number.isNaN(v2)) {
    return def
  }
  return v2
}

export function newLimitedNumber(v: any, def: number, min: number, max: number) {
  return limitNumber(newNumber(v, def), min, max)
}

export function newString(v: any, d: string = '') {
  if (v === undefined) {
    return d
  }
  if (v === null) {
    return d
  }
  return String(v)
}
