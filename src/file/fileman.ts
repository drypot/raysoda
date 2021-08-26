import { FormError } from '../lib/base/error2.js'
import { Config } from '../config/config.js'
import { ImageMeta } from '../entity/image-meta.js'

export interface ImageFileManager {

  readonly config: Config
  readonly dir: string
  readonly url: string

  rmRoot(): Promise<void>
  getDirFor(id: number): string
  getPathFor(id: number, width?: number): string
  getDirUrlFor(id: number): string
  getThumbUrlFor(id: number): string
  beforeIdentify(path: string): Promise<void>
  checkMeta(meta: ImageMeta, errs: FormError[]): void
  saveImage(id: number, src: string, meta?: ImageMeta): Promise<any>
  deleteImage(id: number): Promise<void>
}
