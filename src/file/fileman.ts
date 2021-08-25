import { FormError } from '../lib/base/error2.js'
import { ImageMeta } from './magick2.js'
import { Config } from '../config/config.js'

export interface ImageFileManager {
  readonly config: Config
  readonly dir: string
  readonly url: string

  rmRootSync(): void
  getDirFor(id: number): string
  getPathFor(id: number): string
  getDirUrlFor(id: number): string
  getThumbUrlFor(id: number): string
  checkMeta(meta: ImageMeta, errs: FormError[]): void
  saveImage(id: number, src: string, meta?: ImageMeta): Promise<void>
  deleteImage(id: number): void
}
