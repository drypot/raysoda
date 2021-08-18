export function today() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function dateFrom(s: string) {
  const d = new Date(s)
  d.setHours(0, 0, 0, 0)
  return d
}

function pad(number: number) {
  let r = String(number)
  if (r.length === 1) {
    r = '0' + r
  }
  return r
}

export function dateTimeStringFrom(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

export function dateStringFrom(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export function dateNoDashStringFrom(d: Date) {
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
}
