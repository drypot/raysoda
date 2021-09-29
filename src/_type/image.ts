import { dateNull } from '../_util/date2.js'

export type Image = {
  id: number
  uid: number
  cdate: Date
  vers: number[] | string | null
  comment: string
}

// vers 등 오브젝트 기본 값은 undefined 대신 null 을 쓰는 것이 좋다.
// JSON.stringify(null) 은 'null' 이지만,
// JSON.stringify(undefined) 는 출력이 없다. 문제가 생긴다.

export function imageOf(params?: Partial<Image>): Image {
  return {
    id: 0,
    uid: 0,
    cdate: dateNull,
    vers: null,
    comment: '',
    ...params
  }
}


