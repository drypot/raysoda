import { exec2 } from '../../lib/base/exec2.js'
import { ImageMeta } from '../../entity/image-meta.js'

export async function mogrify(path: string) {
  // identify 에 -auto-orient 를 적용할 수가 없다.
  // 필요하다면 identify 전에 mogrify 를 한번 한다. 예, rapixel.
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
