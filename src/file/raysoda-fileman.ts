import { ImageFileManager } from './fileman.js'
import { FormError } from '../lib/base/error2.js'
import { Config } from '../config/config.js'
import { deepPathOf } from '../lib/base/deeppath.js'
import { IMAGE_SIZE, IMAGE_TYPE } from '../service/image/form/image-form.js'
import { mkdirRecursive, rmRecursive } from '../lib/base/fs2.js'
import { exec2 } from '../lib/base/exec2.js'
import { unlink } from 'fs/promises'
import { ImageMeta } from '../entity/image-meta.js'
import { identify } from './magick/magick2.js'

const maxWidth = 2048

function subDir(id: number) {
  return deepPathOf((id / 1000) >> 0, 2)
}

export class RaySodaFileManager implements ImageFileManager {

  public readonly config: Config
  public readonly dir: string
  public readonly url: string

  protected constructor(config: Config) {
    this.config = config
    this.dir = config.uploadDir + '/public/images/'
    this.url = config.uploadUrl + '/images/'
  }

  static from(config: Config) {
    return new RaySodaFileManager(config)
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

  checkMeta(meta: ImageMeta, errs: FormError[]) {
    if (!meta.format) {
      errs.push(IMAGE_TYPE)
      return
    }
    // 이미지 파일 타입 확인은 하지 않는다.
    // convert 능력에 그냥 맡긴다.
    if (meta.width < 240 || meta.height < 240) {
      errs.push(IMAGE_SIZE)
    }
  }

  async saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null> {
    await mkdirRecursive(this.getDirFor(id))
    let cmd = 'convert ' + src
    cmd += ' -quality 92'
    cmd += ' -auto-orient'
    cmd += ' -resize ' + maxWidth + 'x' + maxWidth + '\\>'
    cmd += ' ' + this.getPathFor(id)
    await exec2(cmd)
    return null
  }

  async deleteImage(id: number) {
    return unlink(this.getPathFor(id))
  }

}
