import { unlink } from 'fs/promises'
import { mkdirRecursive, rmRecursive } from '../common/util/fs2.ts'
import type { Config } from '../common/type/config.ts'
import { IMAGE_SIZE, IMAGE_TYPE } from '../common/type/error-const.ts'
import { getImageMetaOfFile } from './magick/magick2.ts'
import type { ImageFileManager } from './fileman.ts'
import { newDeepPath } from '../common/util/deeppath.ts'
import { getConfig, getObject, registerObjectFactory } from '../oman/oman.ts'
import { inProduction } from '../common/util/env2.ts'
import type { ErrorConst } from '../common/type/error.ts'
import type { ImageMeta } from '../common/type/image-meta.ts'
import sharp from 'sharp'

const maxWidth = 2048

registerObjectFactory('OsokyFileManager', async () => {
  return OsokyFileManager.from(getConfig())
})

export async function getOsokyFileManaer() {
  return await getObject('OsokyFileManager') as OsokyFileManager
}

export class OsokyFileManager implements ImageFileManager {

  readonly dir: string
  readonly url: string

  static from(config: Config) {
    return new OsokyFileManager(config)
  }

  protected constructor(config: Config) {
    this.dir = config.uploadDir + '/public/images/'
    this.url = config.uploadUrl + '/images/'
  }

  async rmRoot() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    return rmRecursive(this.dir)
  }

  async saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null> {
    await mkdirRecursive(this.getDirFor(id))

    const shorter = meta.shorter
    const target = Math.min(maxWidth, shorter)
    const r = (target - 1) / 2   // Math.floor((target - 1) / 2)

    // let cmd = 'convert ' + src
    // cmd += ' -quality 92'
    // cmd += ' -gravity center'
    // cmd += ' -auto-orient'
    // cmd += ' -crop ' + shorter + 'x' + shorter + '+0+0'
    // cmd += ' +repage' // gif 등에 버추얼 캔버스 개념이 있는데 jpeg 으로 출력하더라고 메타 데이터 소거를 위해 crop 후 repage 하는 것이 좋다.
    // cmd += ' -resize ' + target + 'x' + target + '\\>'
    // cmd += ' \\( -size ' + target + 'x' + target + ' xc:black -fill white -draw "circle ' + r + ',' + r + ' ' + r + ',0" \\)'
    // cmd += ' -alpha off -compose CopyOpacity -composite'
    // //cmd += ' \\( +clone -alpha opaque -fill white -colorize 100% \\)'
    // //cmd += ' +swap -geometry +0+0 -compose Over -composite -alpha off'
    // cmd += ' -background white -alpha remove -alpha off' // alpha remove need IM 6.7.5 or above
    // cmd += ' ' + this.getPathFor(id)
    // await exec2(cmd)

    const maskBuffer = Buffer.from(`<svg><circle cx="${r}" cy="${r}" r="${r}" /></svg>`)

    const { data: rawBuffer, info: rawInfo }  = await sharp(src)
      .autoOrient()
      .resize({
        width: target,
        height: target,
        fit: 'cover',
      })
      .composite([{ input: maskBuffer, blend: 'dest-in' }])
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Sharp 에서 js 코드의 체이닝은 libvips 로의 체이닝이 아니다. 인자만 빌딩하는 것이다.
    // 그래서 composition 을 하면 중간에 한번 끊어줘야 추가 작업을 붙일 수 있다.

    // 이어지는 단계에서 알파채널을 쓰려면 .png() 같은 포멧으로 버퍼를 만든다.

    // 2025-08-11
    // 제미나이 딥리서치에 따르면 raw 포멧으로 넘기면 png 보다 오버헤드가 줄어든다고 한다.

    await sharp(rawBuffer, { raw: rawInfo })
      .flatten({ background: '#ffffff'})
      .jpeg({ quality: 92 })
      .toFile(this.getPathFor(id))
      // .toFile('tmp/test.jpg')

    return null
  }

  async deleteImage(id: number) {
    try {
      return await unlink(this.getPathFor(id))
    } catch {
    }
  }

  getDirFor(id: number) {
    return this.dir + subDir(id)
  }

  getPathFor(id: number): string {
    return this.dir + subDir(id) + '/' + id + '.jpg'
  }

  getDirUrlFor(id: number): string {
    return this.url + subDir(id)
  }

  getThumbUrlFor(id: number): string {
    return this.url + subDir(id) + '/' + id + '.jpg'
  }

  async beforeIdentify(path: string) {
    return Promise.resolve()
  }

  async getImageMeta(path: string) {
    return getImageMetaOfFile(path)
  }

  checkMeta(meta: ImageMeta, err: ErrorConst[]) {
    if (!meta.format) {
      err.push(IMAGE_TYPE)
      return
    }
    if (meta.shorter < 640) {
      err.push(IMAGE_SIZE)
    }
  }

}

function subDir(id: number) {
  return newDeepPath((id / 1000) >> 0, 2)
}
