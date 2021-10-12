import { ImageFileManager } from './_fileman'
import { newDeepPath } from '../_util/deeppath'
import { mkdirRecursive, rmRecursive } from '../_util/fs2'
import { copyFile, unlink } from 'fs/promises'
import { getImageMetaOfFile } from './magick/magick2'
import { IMAGE_TYPE } from '../_type/error-image'
import { ImageMeta } from '../_type/image-meta'
import { Config } from '../_type/config'
import { ErrorConst } from '../_type/error'
import { inProduction } from '../_util/env2'
import { omanGetConfig, omanRegisterFactory } from '../oman/oman'

omanRegisterFactory('DrypotFileManager', async () => {
  return DrypotFileManager.from(omanGetConfig())
})

export class DrypotFileManager implements ImageFileManager {

  readonly dir: string
  readonly url: string

  static from(config: Config) {
    return new DrypotFileManager(config)
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
    await copyFile(src, this.getPathFor(id))
    return null
  }

  async deleteImage(id: number) {
    return unlink(this.getPathFor(id))
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

}

function subDir(id: number) {
  return newDeepPath((id / 1000) >> 0, 2)
}

