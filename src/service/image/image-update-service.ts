import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { IMAGE_NOT_EXIST, ImageUpdateForm } from './form/image-form.js'
import { Error2 } from '../../lib/base/error2.js'
import { User } from '../../entity/user-entity.js'
import { NOT_AUTHORIZED } from '../user/form/user-form.js'
import { Image } from '../../entity/image-entity.js'

export async function checkImageUpdatable(
  image: Image | undefined, user: User, err: Error2[]
) {
  if (!image) {
    err.push(IMAGE_NOT_EXIST)
    return
  }
  if (image.uid !== user.id && !user.admin) {
    throw NOT_AUTHORIZED
  }
}

export async function imageUpdateService(
  idb: ImageDB, ifm: ImageFileManager, id: number, form: ImageUpdateForm, err: Error2[]
) {
  const image: Partial<Image> = {}
  if (form.file) {
    await ifm.beforeIdentify(form.file)
    const meta = await ifm.identify(form.file)
    ifm.checkMeta(meta, err)
    if (err.length) return
    image.vers = await ifm.saveImage(id, form.file, meta)
  }
  image.comment = form.comment
  await idb.updateImage(id, image)
}

