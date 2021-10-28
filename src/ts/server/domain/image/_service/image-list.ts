import { User } from '@common/type/user'
import { newDateString } from '@common/util/date2'
import { ImageDB } from '@server/db/image/image-db'
import { ImageForList } from '@common/type/image-detail'
import { UserDB } from '@server/db/user/user-db'
import { Image } from '@common/type/image'
import { ImageFileManager } from '@server/fileman/_fileman'

async function newDecoratedImageList(udb: UserDB, ifm: ImageFileManager, list: Image[]) {
  return await Promise.all(
    list.map(async (image): Promise<ImageForList> => {
      const owner = await udb.getCachedById(image.uid) as User
      return {
        id: image.id,
        owner: {
          id: owner.id,
          name: owner.name,
          home: owner.home
        },
        cdateStr: newDateString(image.cdate),
        vers: image.vers,
        comment: image.comment,
        thumbUrl: ifm.getThumbUrlFor(image.id)
      }
    })
  )
}

export async function imageGetList(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number
) {
  const il = await idb.findImageList((p - 1) * ps, ps)
  return newDecoratedImageList(udb, ifm, il)
}

export async function imageGetListByCdate(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, d: Date, p: number, ps: number
) {
  const il = await idb.findImageListByCdate(d, (p - 1) * ps, ps)
  return newDecoratedImageList(udb, ifm, il)
}

export async function imageGetListByUser(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, uid: number, p: number, ps: number
) {
  const il = await idb.findImageListByUser(uid, (p - 1) * ps, ps)
  return await newDecoratedImageList(udb, ifm, il)
}
