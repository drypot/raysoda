import { exec2 } from '../../lib/base/exec2.js'
import { imageMetaOf } from '../../entity/image-meta.js'
import { numberFrom } from '../../lib/base/primitive.js'

export async function mogrifyAutoOrient(path: string) {
  await exec2('mogrify -auto-orient ' + path)
}

export async function identify(path: string) {
  const meta = imageMetaOf()
  try {
    const out = await exec2('identify -format "%m %w %h" ' + path)
    const a = out.split(/[ \n]/)
    meta.format = a[0].toLowerCase()
    meta.width = numberFrom(a[1])
    meta.height = numberFrom(a[2])
    meta.shorter = meta.width > meta.height ? meta.height : meta.width
  } catch {
  }
  return meta
}
