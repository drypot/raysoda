import { Image } from '@common/type/image'

export type ImageListItem = {
  id: number
  owner: {
    id: number
    name: string
    home: string
  }
  cdateStr: string
  vers: number[] | string | null
  comment: string
  thumbUrl: string
}

export type ImagePage = {
  rawList: Image[] | undefined,
  list: ImageListItem[] | undefined,
  prev: number | null,
  next: number | null
}

export function newImagePage(): ImagePage {
  return {
    rawList: undefined,
    list: undefined,
    prev: null,
    next: null
  }
}
