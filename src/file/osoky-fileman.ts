import { ImageFileManager } from './fileman.js'
import { FormError } from '../lib/base/error2.js'
import { Config } from '../config/config.js'
import { deepPathOf } from '../lib/base/deeppath.js'
import { IMAGE_SIZE } from '../service/image/form/image-form.js'
import { mkdirRecursive, rmRecursive } from '../lib/base/fs2.js'
import { exec2 } from '../lib/base/exec2.js'
import { unlink } from 'fs/promises'
import { ImageMeta } from '../entity/image-meta.js'

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

  beforeIdentify(path: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  checkMeta(meta: ImageMeta, errs: FormError[]) {
    if (meta.shorter < 640) {
      errs.push(IMAGE_SIZE)
    }
  }

  async saveImage(id: number, src: string, meta: ImageMeta) {
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
  }

  async deleteImage(id: number) {
    return unlink(this.getPathFor(id))
  }

}
