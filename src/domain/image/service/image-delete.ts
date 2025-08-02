import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../fileman/fileman.js'
import { User } from '../../../common/type/user.js'
import { ErrorConst } from '../../../common/type/error.js'
import { getUpdatableImage } from './image-update.js'

export async function deleteImage(
  idb: ImageDB, ifm: ImageFileManager, user: User, id: number, err: ErrorConst[]
) {
  const image = await getUpdatableImage(idb, user, id, err)
  if (!image || err.length) return

  await idb.deleteImage(id)
  try {
    // 파일이 없을 경우 삭제하면 ENOENT 를 던진다.
    await ifm.deleteImage(id)
  } catch {
  }
}
