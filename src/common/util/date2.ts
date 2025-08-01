
// undefined 는 JSON 에 들어가지 않으므로
// null 을 리턴하기로 했다.

export function parseDate(s: any) {
  if (!s) {
    return null
  }
  const dts = Date.parse(s)
  if (isNaN(dts)) {
    return null
  }
  return new Date(dts)
}

export function setTimeZero(d: Date) {
  d.setHours(0, 0, 0, 0)
}

function pad(number: number) {
  let r = String(number)
  if (r.length === 1) {
    r = '0' + r
  }
  return r
}

export function dateToString(d: Date | null | undefined) {
  if (!d) {
    return ''
  }
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

export function dateToStringNoTime(d: Date | null | undefined) {
  if (!d) {
    return ''
  }
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export function dateToStringNoTimeNoDash(d: Date | null | undefined) {
  if (!d) {
    return ''
  }
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
}

export function dateDiffMs(a:Date, b:Date) {
  return a.getTime() - b.getTime()
}

export function dateDiffSecond(a:Date, b:Date) {
  return Math.ceil((a.getTime() - b.getTime()) / 1000)
}

export function dateDiffMins(a:Date, b:Date) {
  return Math.ceil((a.getTime() - b.getTime()) / 1000 / 60)
}

export function dateDiffHours(a:Date, b:Date) {
  return Math.ceil((a.getTime() - b.getTime()) / 1000 / 60 / 60)
}

export function dateDiffDays(a:Date, b:Date) {
  return Math.ceil((a.getTime() - b.getTime()) / 1000 / 60 / 60 / 24)
}
