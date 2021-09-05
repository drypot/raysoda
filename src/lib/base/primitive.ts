export function limitNumber(v: number, min: number, max: number) {
  if (!isNaN(min)) {
    v = Math.max(v, min)
  }
  if (!isNaN(max)) {
    v = Math.min(v, max)
  }
  return v
}

export function numberFrom(v: any, d: number = 0) {
  if (v === undefined) {
    return d
  }
  if (v === null) {
    return d
  }
  const v2 = parseInt(v)
  if (Number.isNaN(v2)) {
    return d
  }
  return v2
}

export function stringFrom(v: any, d: string = '') {
  if (v === undefined) {
    return d
  }
  if (v === null) {
    return d
  }
  return String(v)
}
