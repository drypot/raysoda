import { mkdirSync, readdirSync, rmSync, unlinkSync } from 'fs'

export function mkdirRecursiveSync(p: string) {
  mkdirSync(p, { recursive: true, mode: 0o755, })
}

export function rmRecursiveSync(p: string) {
  rmSync(p, { force: true, recursive: true })
}

export function emptyDirSync(p: string) {
  try {
    const dirent = readdirSync(p, { withFileTypes: true })
    for (const e of dirent) {
      if (e.isFile()) {
        unlinkSync(p + '/' + e.name)
      }
    }
  } catch {
  }
}
