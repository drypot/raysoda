import { unlink } from 'fs/promises'
import { mkdirRecursive, rmRecursive } from '../common/util/fs2.js'
import { Config } from '../common/type/config.js'
import { exec2 } from '../common/util/exec2.js'
import { IMAGE_SIZE, IMAGE_TYPE } from '../common/type/error-const.js'
import { getImageMetaOfFile } from './magick/magick2.js'
import { ImageFileManager } from './fileman.js'
import { newDeepPath } from '../common/util/deeppath.js'
import { getConfig, registerObjectFactory } from '../oman/oman.js'
import { inProduction } from '../common/util/env2.js'
import { ErrorConst } from '../common/type/error.js'
import { ImageMeta } from '../common/type/image-meta.js'

const maxWidth = 2160

registerObjectFactory('SobeautFileManager', async () => {
  return SobeautFileManager.from(getConfig())
})

export class SobeautFileManager implements ImageFileManager {

  readonly dir: string
  readonly url: string

  static from(config: Config) {
    return new SobeautFileManager(config)
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
    const max = shorter < maxWidth ? shorter : maxWidth
    const r = (max - 1) / 2
    let cmd = 'convert ' + src
    cmd += ' -quality 92'
    cmd += ' -gravity center'
    cmd += ' -auto-orient'
    cmd += ' -crop ' + shorter + 'x' + shorter + '+0+0'
    cmd += ' -resize ' + max + 'x' + max + '\\>'
    cmd += ' ' + this.getPathFor(id)
    await exec2(cmd)
    return null
  }

  async deleteImage(id: number) {
    return unlink(this.getPathFor(id))
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
