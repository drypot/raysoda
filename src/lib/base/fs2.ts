import * as fs from 'fs'

export function rmSync2(p: string) {
  fs.rmSync(p, { force: true, recursive: true })
}

export function mkdirSync2(p: string) {
  fs.mkdirSync(p, { recursive: true, mode: 0o755, })
}
