import { Image } from '@common/type/image'

export type ImageForList = {
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
  list: Image[] | undefined,
  decoList: ImageForList[] | undefined,
  prev: number | null,
  next: number | null
}

export function newImagePage(): ImagePage {
  return {
    list: undefined,
    decoList: undefined,
    prev: null,
    next: null
  }
}
