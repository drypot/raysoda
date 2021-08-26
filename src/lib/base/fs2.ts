import { mkdir, readdir, rm, unlink } from 'fs/promises'

export async function mkdirRecursive(p: string) {
  return mkdir(p, { recursive: true, mode: 0o755, })
}

export async function rmRecursive(p: string) {
  return rm(p, { force: true, recursive: true })
}

export async function emptyDir(p: string) {
  const dirent = await readdir(p, { withFileTypes: true })
  for (const e of dirent) {
    if (e.isFile()) {
      await unlink(p + '/' + e.name)
    }
  }
}
