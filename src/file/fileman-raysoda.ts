import { ImageFileManager } from './fileman.js'
import { FormError } from '../lib/base/error2.js'
import { Config } from '../config/config.js'
import { deepPathOf } from '../lib/base/deeppath.js'
import { ImageMeta } from './magick2.js'
import { IMAGE_SIZE } from '../service/image/form/image-form.js'
import { unlinkSync } from 'fs'
import { exec } from 'child_process'
import { mkdirRecursiveSync, rmRecursiveSync } from '../lib/base/fs2.js'

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

  rmRootSync() {
    if (!this.config.dev) {
      throw (new Error('only available in development mode'))
    }
    rmRecursiveSync(this.dir)
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

  checkMeta(meta: ImageMeta, errs: FormError[]) {
    if (meta.width < 240 || meta.height < 240) {
      errs.push(IMAGE_SIZE)
    }
  }

  async saveImage(id: number, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      mkdirRecursiveSync(this.dir + subDir(id))
      let cmd = 'convert ' + src +
        ' -quality 92' +
        ' -auto-orient' +
        ' -resize ' + maxWidth + 'x' + maxWidth + '\\>' +
        ' ' + this.getPathFor(id)
      exec(cmd, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  deleteImage(id: number): void {
    try {
      unlinkSync(this.getPathFor(id))
    } catch {
    }
  }

}
