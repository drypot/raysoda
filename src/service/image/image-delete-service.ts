import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Error2 } from '../../_util/error2.js'

export async function imageDeleteService(
  idb: ImageDB, ifm: ImageFileManager, id: number, err: Error2[]
) {
  await idb.deleteImage(id)
  try {
    // 파일이 없을 경우 삭제하면 ENOENT를 던진다.
    await ifm.deleteImage(id)
  } catch {
  }
}
