import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/_fileman'
import { Image } from '../../_type/image'
import { User } from '../../_type/user'
import { newDateString } from '../../_util/date2'
import { ImageForList } from '../../_type/image-detail'
import { UserDB } from '../../db/user/user-db'

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

export async function imageListService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number
) {
  const il = await idb.findImageList((p - 1) * ps, ps)
  return newDecoratedImageList(udb, ifm, il)
}

export async function imageListByCdateService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, d: Date, p: number, ps: number
) {
  const il = await idb.findImageListByCdate(d, (p - 1) * ps, ps)
  return newDecoratedImageList(udb, ifm, il)
}

export async function imageListByUserService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, uid: number, p: number, ps: number
) {
  const il = await idb.findImageListByUser(uid, (p - 1) * ps, ps)
  return await newDecoratedImageList(udb, ifm, il)
}
