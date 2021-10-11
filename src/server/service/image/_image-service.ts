import { User } from '../../_type/user.js'
import { Image } from '../../_type/image.js'

export function userCanUpdateImage(user: User, image: Image) {
  return image.uid === user.id || user.admin
}
