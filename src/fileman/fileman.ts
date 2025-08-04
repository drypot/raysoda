import { type ImageMeta } from '../common/type/image-meta.ts'
import { type ErrorConst } from '../common/type/error.ts'

export interface ImageFileManager {

  readonly dir: string
  readonly url: string

  rmRoot(): Promise<void>

  saveImage(id: number, src: string, meta: ImageMeta): Promise<number[] | null>

  deleteImage(id: number): Promise<void>

  getDirFor(id: number): string

  getPathFor(id: number, width?: number): string

  getDirUrlFor(id: number): string

  getThumbUrlFor(id: number): string

  beforeIdentify(path: string): Promise<void>

  getImageMeta(path: string): Promise<ImageMeta>

  checkMeta(meta: ImageMeta, err: ErrorConst[]): void

}
