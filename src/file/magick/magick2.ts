import { exec2 } from '../../_util/exec2.js'
import { paramToNumber } from '../../_util/param.js'
import { imageMetaOf } from '../../_type/image-meta.js'

export async function mogrifyAutoOrient(path: string) {
  await exec2('mogrify -auto-orient ' + path)
}

export async function identify(path: string) {
  const meta = imageMetaOf()
  try {
    const out = await exec2('identify -format "%m %w %h" ' + path)
    const a = out.split(/[ \n]/)
    meta.format = a[0].toLowerCase()
    meta.width = paramToNumber(a[1])
    meta.height = paramToNumber(a[2])
    meta.shorter = meta.width > meta.height ? meta.height : meta.width
  } catch {
  }
  return meta
}
