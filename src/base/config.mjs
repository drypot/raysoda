import { readFileSync } from 'fs'

export function loadConfig(path) {
  const data = readFileSync(path, 'utf8');
  const config = JSON.parse(data)
  config.dev = process.env.NODE_ENV !== 'production'
  return config
}

export function loadTestConfig() {
  return loadConfig('config/test.json')
}
