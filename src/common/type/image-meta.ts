export type ImageMeta = {
  format: string | undefined
  width: number
  height: number
  longer: number
  shorter: number
}

export function newImageMeta(meta: Partial<ImageMeta>): ImageMeta {
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const longer = width > height ? width : height
  const shorter = width > height ? height : width

  return {
    format: meta.format,
    width,
    height,
    longer,
    shorter,
  }
}

export type WidthHeight = {
  width: number
  height: number
}
