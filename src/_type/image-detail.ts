import { newDateString } from '../_util/date2.js'

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

export function renderImageDetail(image: ImageDetail) {
  image.cdateStr = newDateString(image.cdate)
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

