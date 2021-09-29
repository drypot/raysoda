import { Error2 } from '../_util/error2.js'
import { ImageMeta } from '../_type/image-meta.js'
import { Config } from '../_type/config.js'

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

  identify(path: string): Promise<ImageMeta>

  checkMeta(meta: ImageMeta, err: Error2[]): void

  saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null>

  deleteImage(id: number): Promise<void>
}
