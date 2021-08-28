import { exec2 } from '../../lib/base/exec2.js'
import { imageMetaOf } from '../../entity/image-meta.js'

export async function mogrifyAutoOrient(path: string) {
  await exec2('mogrify -auto-orient ' + path)
}

export async function identify(path: string) {
  const meta = imageMetaOf()
  try {
    const out = await exec2('identify -format "%m %w %h" ' + path)
    const a = out.split(/[ \n]/)
    meta.format = a[0].toLowerCase()
    meta.width = parseInt(a[1]) || 0
    meta.height = parseInt(a[2]) || 0
    meta.shorter = meta.width > meta.height ? meta.height : meta.width
  } catch {
  }
  return meta
}
