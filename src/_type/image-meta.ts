export type ImageMeta = {
  format: string | undefined
  width: number
  height: number
  shorter: number
}

export function newImageMeta(params?: Partial<ImageMeta>): ImageMeta {
  return {
    format: undefined,
    width: 0,
    height: 0,
    shorter: 0,
    ...params
  }
}

export type WidthHeight = {
  width: number
  height: number
}
