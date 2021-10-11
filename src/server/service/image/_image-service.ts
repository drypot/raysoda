import { User } from '../../_type/user'
import { Image } from '../../_type/image'

export function userCanUpdateImage(user: User, image: Image) {
  return image.uid === user.id || user.admin
}
