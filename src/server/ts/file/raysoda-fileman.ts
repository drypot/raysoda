import { unlink } from 'fs/promises'
import { mkdirRecursive, rmRecursive } from '@common/util/fs2'
import { Config } from '@common/type/config'
import { exec2 } from '@common/util/exec2'
import { IMAGE_SIZE, IMAGE_TYPE } from '@common/type/error-const'
import { getImageMetaOfFile } from '@server/file/magick/magick2'
import { ImageFileManager } from '@server/file/_fileman'
import { newDeepPath } from '@common/util/deeppath'
import { omanGetConfig, omanRegisterFactory } from '@server/oman/oman'
import { inProduction } from '@common/util/env2'
import { ErrorConst } from '@common/type/error'
import { ImageMeta } from '@common/type/image-meta'

const maxWidth = 2048

omanRegisterFactory('RaySodaFileManager', async () => {
  return RaySodaFileManager.from(omanGetConfig())
})

export class RaySodaFileManager implements ImageFileManager {

  readonly dir: string
  readonly url: string

  static from(config: Config) {
    return new RaySodaFileManager(config)
  }

  protected constructor(config: Config) {
    this.dir = config.uploadDir + '/public/images/'
    this.url = config.uploadUrl + '/images/'
  }

  // init 평션을 만들어서 this.dir 을 미리 만들어둘까 하다가 하지 않기로 했다.
  // 어짜피 파일 업로드할 때 패스가 쭉 만들어진다.
  // 실 서비스시 nginx 연결등으로 디렉토리를 미리 생성해야 한다면
  // 쉘에서 수작업으로 만들면 된다.

  async rmRoot() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    return rmRecursive(this.dir)
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
    // 이미지 파일 타입 확인은 하지 않는다.
    // convert 능력에 그냥 맡긴다.
    if (meta.width <= 240 || meta.height <= 240) {
      err.push(IMAGE_SIZE)
    }
  }

}

function subDir(id: number) {
  return newDeepPath((id / 1000) >> 0, 2)
}
