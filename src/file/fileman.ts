import { ImageMeta } from '../_type/image-meta.js'
import { Config } from '../_type/config.js'
import { ErrorConst } from '../_type/error.js'

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

  getImageMeta(path: string): Promise<ImageMeta>

  checkMeta(meta: ImageMeta, err: ErrorConst[]): void

  saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null>

  deleteImage(id: number): Promise<void>
}
