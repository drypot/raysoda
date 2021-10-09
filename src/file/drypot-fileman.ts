import { ImageFileManager } from './fileman.js'
import { newDeepPath } from '../_util/deeppath.js'
import { mkdirRecursive, rmRecursive } from '../_util/fs2.js'
import { copyFile, unlink } from 'fs/promises'
import { getImageMetaOfFile } from './magick/magick2.js'
import { IMAGE_TYPE } from '../_type/error-image.js'
import { ImageMeta } from '../_type/image-meta.js'
import { Config } from '../_type/config.js'
import { ErrorConst } from '../_type/error.js'
import { inProduction } from '../_util/env2.js'

function subDir(id: number) {
  return newDeepPath((id / 1000) >> 0, 2)
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
    if (inProduction()) {
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

  async getImageMeta(path: string) {
    return getImageMetaOfFile(path)
  }

  checkMeta(meta: ImageMeta, err: ErrorConst[]) {
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
