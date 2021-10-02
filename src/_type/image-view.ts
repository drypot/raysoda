export type ImageView = {
  id: number
  owner: {
    id: number
    name: string
    home: string
  }
  cdate: number
  cdateStr: string
  vers: number[] | string | null
  comment: string
  dirUrl: string
  thumbUrl: string
  updatable: boolean
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

