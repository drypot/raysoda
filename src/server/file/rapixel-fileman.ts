import { ImageFileManager } from './fileman'
import { newDeepPath } from '../_util/deeppath'
import { emptyDir, mkdirRecursive, rmRecursive } from '../_util/fs2'
import { exec2 } from '../_util/exec2'
import { getImageMetaOfFile, mogrifyAutoOrient } from './magick/magick2'
import { IMAGE_SIZE, IMAGE_TYPE } from '../_type/error-image'
import { ImageMeta, WidthHeight } from '../_type/image-meta'
import { Config } from '../_type/config'
import { ErrorConst } from '../_type/error'
import { inProduction } from '../_util/env2'

const _minWidth = 3840
const _minHeight = 2160

const _vers: WidthHeight[] = [
  { width: 5120, height: 2880 }, // iMac 27 Retina
  { width: 4096, height: 2304 }, // iMac 21 Retina
  //{ width: 3840, height: 2160 }, // 4K TV
  //{ width: 2880, height: 1620 }, // MacBook Retina 15
  { width: 2560, height: 1440 }, // iMac 27, MacBook Retina 13
  //{ width: 2048, height: 1152 }, // iPad mini 2
  //{ width: 1920, height: 1080 }, // iMac 21, Full HD TV
  //{ width: 1680, height: 945 }, // MacBook Pro 15
  //{ width: 1440, height: 810 }, // MacBook Air 13
  //{ width: 1366, height: 768 }, // MacBook Air 11
  { width: 1280, height: 720 },  // HD TV // 혹시 미래에 작은 섬네일이 필요할지 모르니 만들어 둔다.
  //{ width: 1136, height: 640 },
  //{ width: 1024, height: 576 },
  //{ width: 960 , height: 540 },
  //{ width: 640 , height: 360 }
]

function subDir(id: number) {
  return newDeepPath(id, 3)
}

export class RapixelFileManager implements ImageFileManager {

  public readonly config: Config
  public readonly dir: string
  public readonly url: string

  protected constructor(config: Config) {
    this.config = config
    this.dir = config.uploadDir + '/public/images/'
    this.url = config.uploadUrl + '/images/'
  }

  static from(config: Config) {
    return new RapixelFileManager(config)
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

  getPathFor(id: number, width: number): string {
    return this.dir + subDir(id) + '/' + id + '-' + width + '.jpg'
  }

  getDirUrlFor(id: number): string {
    return this.url + subDir(id)
  }

  getThumbUrlFor(id: number): string {
    return this.url + subDir(id) + '/' + id + '-2560.jpg'
  }

  async beforeIdentify(path: string) {
    return mogrifyAutoOrient(path)
  }

  async getImageMeta(path: string) {
    return getImageMetaOfFile(path)
  }

  checkMeta(meta: ImageMeta, err: ErrorConst[]) {
    if (!meta.format) {
      err.push(IMAGE_TYPE)
      return
    }
    if (meta.width < _minWidth - 15 || meta.height < _minHeight - 15) {
      err.push(IMAGE_SIZE)
    }
  }

  async saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null> {
    await mkdirRecursive(this.getDirFor(id))

    let cmd = 'convert ' + src
    cmd += ' -quality 92'
    cmd += ' -gravity center'

    let i = 0
    const vers: number[] = []
    for (; i < _vers.length; i++) {
      if (_vers[i].width < meta.width + (_vers[i].width - _vers[i + 1].width) / 2) {
        break
      }
    }
    for (; i < _vers.length; i++) {
      const ver = _vers[i]
      vers.push(ver.width)
      // '^' : 최소값이라는 의미
      cmd += ' -resize ' + ver.width + 'x' + ver.height + '^'
      cmd += ' -crop ' + ver.width + 'x' + ver.height + '+0+0'
      cmd += ' +repage'
      if (i === _vers.length - 1) {
        cmd += ' ' + this.getPathFor(id, ver.width)
      } else {
        cmd += ' -write ' + this.getPathFor(id, ver.width)
      }
    }
    await exec2(cmd)
    return vers
  }

  async deleteImage(id: number) {
    return emptyDir(this.getDirFor(id))
  }

}
