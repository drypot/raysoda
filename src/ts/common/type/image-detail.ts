import { Image } from '@common/type/image'

export type ImageDetail = {
  id: number
  owner: {
    id: number
    name: string
    home: string
  }
  cdate: Date
  cdateNum: number
  cdateStr: string
  vers: number[] | string | null
  comment: string
  dirUrl: string
  thumbUrl: string
  updatable: boolean
}

export function packImageDetail(image: ImageDetail) {
  image.cdateNum = image.cdate.getTime()
}

export function unpackImageDetail(image: ImageDetail) {
  image.cdate = new Date(image.cdateNum)
}

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
  listDecorated: ImageForList[] | undefined,
  prev: number | null,
  next: number | null
}

export function newImagePage() : ImagePage {
  return {
    list: undefined,
    listDecorated: undefined,
    prev: null,
    next: null
  }
}
