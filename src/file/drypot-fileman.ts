import { ImageFileManager } from './fileman.js'
import { Error2 } from '../lib/base/error2.js'
import { Config } from '../config/config.js'
import { deepPathOf } from '../lib/base/deeppath.js'
import { IMAGE_TYPE } from '../service/image/form/image-form.js'
import { mkdirRecursive, rmRecursive } from '../lib/base/fs2.js'
import { copyFile, unlink } from 'fs/promises'
import { ImageMeta } from '../entity/image-meta.js'
import { identify } from './magick/magick2.js'

function subDir(id: number) {
  return deepPathOf((id / 1000) >> 0, 2)
}

export class DrypotFileManager implements ImageFileManager {

  public readonly config: Config
  public readonly dir: string
  public readonly url: string

  protected constructor(config: Config) {
    this.config = config
    this.dir = config.uploadDir + '/public/images/'
    this.url = config.uploadUrl + '/images/'
  }

  static from(config: Config) {
    return new DrypotFileManager(config)
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
    return this.dir + subDir(id) + '/' + id + '.svg'
  }

  getDirUrlFor(id: number): string {
    return this.url + subDir(id)
  }

  getThumbUrlFor(id: number): string {
    return this.url + subDir(id) + '/' + id + '.svg'
  }

  async beforeIdentify(path: string) {
    return Promise.resolve()
  }

  async identify(path: string) {
    return identify(path)
  }

  checkMeta(meta: ImageMeta, err: Error2[]) {
    if (meta.format !== 'svg') {
      err.push(IMAGE_TYPE)
    }
  }

  async saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null> {
    await mkdirRecursive(this.getDirFor(id))
    await copyFile(src, this.getPathFor(id))
    return null
  }

  async deleteImage(id: number) {
    return unlink(this.getPathFor(id))
  }

}
