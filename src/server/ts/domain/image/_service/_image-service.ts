import { User } from '@common/type/user'
import { Image } from '@common/type/image'

export function userCanUpdateImage(user: User, image: Image) {
  return image.uid === user.id || user.admin
}
