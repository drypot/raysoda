export interface Image {
  id: number
  uid: number
  cdate: Date
  vers: number[] | string | undefined
  comment: string
}

export function imageOf(params?: Partial<Image>): Image {
  const now = new Date()
  return {
    id: 0,
    uid: 0,
    cdate: now,
    vers: undefined,
    comment: '',
    ...params
  }
}
