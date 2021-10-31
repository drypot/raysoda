import { User } from '@common/type/user'

export type ImageUploadForm = {
  comment: string
}

export type ImageUploadPack = {
  user: User
  comment: string
  file: string
}

export type ImageUpdateForm = {
  id: number
  comment: string
}

export type ImageUpdatePack = {
  user: User
  comment: string
  file: string
}
