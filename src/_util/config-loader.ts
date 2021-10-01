import { readFileSync } from 'fs'
import { Config } from '../_type/config.js'

export function readConfigSync(path: string): Config {
  const data = readFileSync(path, 'utf8')
  const config: Config = JSON.parse(data)
  return config
}
