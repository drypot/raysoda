import { copyFile, unlink } from 'fs/promises'
import { ErrorConst } from '@common/type/error'
import { IMAGE_TYPE } from '@common/type/error-const'
import { mkdirRecursive, rmRecursive } from '@common/util/fs2'
import { Config } from '@common/type/config'
import { ImageMeta } from '@common/type/image-meta'
import { getImageMetaOfFile } from '@server/fileman/magick/magick2'
import { ImageFileManager } from '@server/fileman/_fileman'
import { newDeepPath } from '@common/util/deeppath'
import { getConfig, registerObjectFactory } from '@server/oman/oman'
import { inProduction } from '@common/util/env2'

registerObjectFactory('DrypotFileManager', async () => {
  return DrypotFileManager.from(getConfig())
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

