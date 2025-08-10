import { copyFile, unlink } from "fs/promises"
import type { Config } from "../common/type/config.ts"
import { IMAGE_TYPE } from "../common/type/error-const.ts"
import type { ErrorConst } from "../common/type/error.ts"
import type { ImageMeta } from "../common/type/image-meta.ts"
import { newDeepPath } from "../common/util/deeppath.ts"
import { inProduction } from "../common/util/env2.ts"
import { rmRecursive, mkdirRecursive } from "../common/util/fs2.ts"
import { registerObjectFactory, getConfig, getObject } from "../oman/oman.ts"
import type { ImageFileManager } from "./fileman.ts"
import { getImageMetaOfFile } from "./magick/magick2.ts"


registerObjectFactory('DrypotFileManager', async () => {
  return DrypotFileManager.from(getConfig())
})

export async function getDrypotFileManaer() {
  return await getObject('DrypotFileManager') as DrypotFileManager
}

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
    try {
      return await unlink(this.getPathFor(id))
    } catch {
    }
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

