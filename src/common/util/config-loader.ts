import { readFileSync } from 'fs'
import type { Config } from '../type/config.ts'

export function loadConfigSync(path: string): Config {
  const data = readFileSync(path, 'utf8')
  return JSON.parse(data)
}
