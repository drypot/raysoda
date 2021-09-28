import { ImageFileManager } from './fileman.js'
import { Error2 } from '../_error/error2.js'
import { Config } from '../_config/config.js'
import { deepPathOf } from '../_util/deeppath.js'
import { mkdirRecursive, rmRecursive } from '../_util/fs2.js'
import { exec2 } from '../_util/exec2.js'
import { unlink } from 'fs/promises'
import { identify } from './magick/magick2.js'
import { ImageMeta } from '../entity/image.js'
import { IMAGE_SIZE, IMAGE_TYPE } from '../_error/error-image.js'

const maxWidth = 2048

function subDir(id: number) {
  return deepPathOf((id / 1000) >> 0, 2)
}

export class OsokyFileManager implements ImageFileManager {

  public readonly config: Config
  public readonly dir: string
  public readonly url: string

  protected constructor(config: Config) {
    this.config = config
    this.dir = config.uploadDir + '/public/images/'
    this.url = config.uploadUrl + '/images/'
  }

  static from(config: Config) {
    return new OsokyFileManager(config)
  }

  async rmRoot() {
    if (!this.config.dev) {
      throw (new Error('only available in development mode'))
    }
    return rmRecursive(this.dir)
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

  async identify(path: string) {
    return identify(path)
  }

  checkMeta(meta: ImageMeta, err: Error2[]) {
    if (!meta.format) {
      err.push(IMAGE_TYPE)
      return
    }
    if (meta.shorter < 640) {
      err.push(IMAGE_SIZE)
    }
  }

  async saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null> {
    await mkdirRecursive(this.getDirFor(id))
    const shorter = meta.shorter
    const max = shorter < maxWidth ? shorter : maxWidth
    const r = (max - 1) / 2
    let cmd = 'convert ' + src
    cmd += ' -quality 92'
    cmd += ' -gravity center'
    cmd += ' -auto-orient'
    cmd += ' -crop ' + shorter + 'x' + shorter + '+0+0'
    cmd += ' +repage' // gif 등에 버추얼 캔버스 개념이 있는데 jpeg 으로 출력하더라고 메타 데이터 소거를 위해 crop 후 repage 하는 것이 좋다.
    cmd += ' -resize ' + max + 'x' + max + '\\>'
    cmd += ' \\( -size ' + max + 'x' + max + ' xc:black -fill white -draw "circle ' + r + ',' + r + ' ' + r + ',0" \\)'
    cmd += ' -alpha off -compose CopyOpacity -composite'
    //cmd += ' \\( +clone -alpha opaque -fill white -colorize 100% \\)'
    //cmd += ' +swap -geometry +0+0 -compose Over -composite -alpha off'
    cmd += ' -background white -alpha remove -alpha off' // alpha remove need IM 6.7.5 or above
    cmd += ' ' + this.getPathFor(id)
    await exec2(cmd)
    return null
  }

  async deleteImage(id: number) {
    return unlink(this.getPathFor(id))
  }

}
