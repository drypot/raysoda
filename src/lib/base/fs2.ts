import * as fs from 'fs'

export function rmSync2(p: string) {
  fs.rmSync(p, { force: true, recursive: true })
}

export function mkdirSync2(p: string) {
  fs.mkdirSync(p, { recursive: true, mode: 0o755, })
}

export function deepPathOf(id: number, iter: number) {
  let path = ''
  for (iter--; iter > 0; iter--) {
    path = '/' + id % 1000 + path
    id = Math.floor(id / 1000)
  }
  return id + path
}
