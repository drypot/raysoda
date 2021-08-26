import { exec2 } from '../../lib/base/exec2.js'
import { ImageMeta } from '../../entity/image-meta.js'

export async function mogrifyAutoOrient(path: string) {
  await exec2('mogrify -auto-orient ' + path)
}

export async function identify(path: string) {
  const out = await exec2('identify -format "%m %w %h" ' + path)
  const a = out.split(/[ \n]/)
  const width = parseInt(a[1]) || 0
  const height = parseInt(a[2]) || 0
  return {
    format: a[0].toLowerCase(),
    width: width,
    height: height,
    shorter: width > height ? height : width
  } as ImageMeta
}
