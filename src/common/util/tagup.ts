
const patterns = [
  { // url
    pattern: /(https?:\/\/[^ "'><)\n\r]+)/g,
    replace: '<a href="$1" target="_blank">$1</a>'
  }
]

export function tagUp(s: string, pi: number = 0) {
  if (pi === patterns.length) {
    return s
  }
  let p = patterns[pi]
  let r = ''
  let a = 0
  let match
  while (match = p.pattern.exec(s)) {
    r += tagUp(s.slice(a, match.index), pi + 1)
    r += p.replace.replace(/\$1/g, match[1])
    a = match.index + match[0].length
  }
  r += tagUp(s.slice(a), pi + 1)
  return r
}
