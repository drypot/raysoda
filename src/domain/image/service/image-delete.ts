import { ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import type { User } from '../../../common/type/user.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { getUpdatableImage } from './image-update.ts'

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
