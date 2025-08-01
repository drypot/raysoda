const _inProduction = process.env.NODE_ENV === 'production'
const _inDev = process.env.NODE_ENV === 'development'

export function inProduction() {
  return _inProduction
}

export function inDev() {
  return _inDev
}
