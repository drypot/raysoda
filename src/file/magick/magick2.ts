import { exec2 } from '../../_util/exec2.js'
import { newNumber } from '../../_util/primitive.js'
import { ImageMeta, newImageMeta } from '../../_type/image-meta.js'

export async function mogrifyAutoOrient(path: string) {
  await exec2('mogrify -auto-orient ' + path)
}

export async function getImageMetaOfFile(path: string): Promise<ImageMeta> {
  try {
    const out = await exec2('identify -format "%m %w %h" ' + path)
    const a = out.split(/[ \n]/)
    const format = a[0].toLowerCase()
    const width = newNumber(a[1])
    const height = newNumber(a[2])
    const shorter = width > height ? height : width
    return {
      format, width, height, shorter
    }
  } catch {
  }
  return newImageMeta({})
}
