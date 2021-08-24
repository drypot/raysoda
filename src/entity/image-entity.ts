
// undefined 는 JSON 에서 사용하지 못한다.
// vers 기본 값은 null 로 해두기로 한다.

export interface Image {
  id: number
  uid: number
  cdate: Date
  vers: { width: number, height: number }[] | string | null
  comment: string
}

export function imageOf(params?: Partial<Image>): Image {
  const now = new Date()
  return {
    id: 0,
    uid: 0,
    cdate: now,
    vers: null,
    comment: '',
    ...params
  }
}
