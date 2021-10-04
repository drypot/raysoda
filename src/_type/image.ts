import { dateNull } from '../_util/date2.js'

export type Image = {
  id: number
  uid: number
  cdate: Date
  vers: number[] | null
  comment: string
}

// vers 등 오브젝트 기본 값은 undefined 대신 null 을 쓰는 것이 좋다.
// JSON.stringify(null) 은 'null' 이지만,
// JSON.stringify(undefined) 는 출력이 없다. 문제가 생긴다.

export function newImage(image: Partial<Image>): Image {
  return {
    id: image.id ?? 0,
    uid: image.uid ?? 0,
    cdate: image.cdate ?? dateNull,
    vers: image.vers ?? null,
    comment: image.comment ?? '',
  }
}
