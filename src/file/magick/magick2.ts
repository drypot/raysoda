import { exec2 } from '../../_util/exec2.js'
import { newNumber } from '../../_util/primitive.js'
import { newImageMeta } from '../../_type/image-meta.js'

export async function mogrifyAutoOrient(path: string) {
  await exec2('mogrify -auto-orient ' + path)
}

export async function getImageMetaOfFile(path: string) {
  const meta = newImageMeta()
  try {
    const out = await exec2('identify -format "%m %w %h" ' + path)
    const a = out.split(/[ \n]/)
    meta.format = a[0].toLowerCase()
    meta.width = newNumber(a[1])
    meta.height = newNumber(a[2])
    meta.shorter = meta.width > meta.height ? meta.height : meta.width
  } catch {
  }
  return meta
}
