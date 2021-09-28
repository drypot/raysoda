import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUpdateForm } from './form/image-form.js'
import { Error2 } from '../../_error/error2.js'
import { User } from '../../entity/user.js'
import { Image } from '../../entity/image.js'
import { IMAGE_NOT_EXIST } from '../../_error/error-image.js'
import { NOT_AUTHORIZED } from '../../_error/error-user.js'

export async function checkImageUpdatable(
  user: User, image: Image | undefined, err: Error2[]
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
    await ifm.deleteImage(id)
    image.vers = await ifm.saveImage(id, form.file, meta)
  }
  image.comment = form.comment
  await idb.updateImage(id, image)
}

