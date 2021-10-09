const _inProduction = process.env.NODE_ENV === 'production'
const _inDev = !_inProduction

export function inProduction() {
  return _inProduction
}

export function inDev() {
  return _inDev
}
