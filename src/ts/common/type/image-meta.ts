export type ImageMeta = {
  format: string | undefined
  width: number
  height: number
  shorter: number
}

export function newImageMeta(meta: Partial<ImageMeta>): ImageMeta {
  return {
    format: meta.format,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    shorter: meta.shorter ?? 0,
  }
}

export type WidthHeight = {
  width: number
  height: number
}
