export const dateNull = new Date(0)

export function newDate(s: string | null | undefined) {
  if (!s) {
    return null
  }
  const dts = Date.parse(s)
  if (isNaN(dts)) {
    return null
  }
  return new Date(dts)
}

export function newTimeZeroDate(s: string | null | undefined) {
  const d = newDate(s)
  if (d) d.setHours(0, 0, 0, 0)
  return d
}

function pad(number: number) {
  let r = String(number)
  if (r.length === 1) {
    r = '0' + r
  }
  return r
}

export function newDateString(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

export function newDateStringNoTime(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export function newDateStringNoTimeNoDash(d: Date) {
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
}
