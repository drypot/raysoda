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

  // init 평션을 만들어서 this.dir 을 미리 만들어둘까 하다가 하지 않기로 했다.
  // 어짜피 파일 업로드할 때 패스가 쭉 만들어진다.
  // 실 서비스시 nginx 연결등으로 디렉토리를 미리 생성해야 한다면
  // 쉘에서 수작업으로 만들면 된다.

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
    // 이미지 파일 타입 확인은 하지 않는다.
    // convert 능력에 그냥 맡긴다.
    if (meta.width <= 240 || meta.height <= 240) {
      err.push(IMAGE_SIZE)
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
