import { readFileSync } from 'fs'
import { Config } from '../_type/config'

export function loadConfigSync(path: string): Config {
  const data = readFileSync(path, 'utf8')
  return JSON.parse(data)
}
