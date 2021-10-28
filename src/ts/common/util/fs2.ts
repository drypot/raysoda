import { mkdir, readdir, rm, unlink } from 'fs/promises'
import { mkdirSync, readdirSync, rmSync, unlinkSync } from 'fs'

export async function mkdirRecursive(p: string) {
  await mkdir(p, { recursive: true, mode: 0o755, })
}

export function mkdirRecursiveSync(p: string) {
  mkdirSync(p, { recursive: true, mode: 0o755, })
}

export async function rmRecursive(p: string) {
  await rm(p, { force: true, recursive: true })
}

export function rmRecursiveSync(p: string) {
  rmSync(p, { force: true, recursive: true })
}

export async function emptyDir(p: string) {
  const dirent = await readdir(p, { withFileTypes: true })
  for (const e of dirent) {
    if (e.isFile()) {
      await unlink(p + '/' + e.name)
    }
  }
}

export function emptyDirSync(p: string) {
  const dirent = readdirSync(p, { withFileTypes: true })
  for (const e of dirent) {
    if (e.isFile()) {
      unlinkSync(p + '/' + e.name)
    }
  }
}
