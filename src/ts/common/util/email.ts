const emailPattern = /^[a-z0-9-_+.]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i

export function emailPatternIsOk(email: string) {
  return emailPattern.test(email)
}
