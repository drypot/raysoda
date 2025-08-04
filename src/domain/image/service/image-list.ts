import { UserDB } from '../../../db/user/user-db.ts'
import { ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import type { ImageListItem, ImagePage } from '../../../common/type/image-list.ts'
import type { PageParam } from '../../../common/type/page.ts'
import type { Image } from '../../../common/type/image.ts'
import type { User } from '../../../common/type/user.ts'
import { dateToString } from '../../../common/util/date2.ts'

export async function fillImagePage(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, page: ImagePage, param: PageParam
)
{
  await idb.fillImagePage(page, param)
  await fillImagePageDecoList(udb, ifm, page)
}

async function fillImagePageDecoList(
  udb: UserDB, ifm: ImageFileManager, page: ImagePage
) {
  const list = page.rawList as Image[]
  page.list = await Promise.all(
    list.map(async (image): Promise<ImageListItem> => {
      const owner = await udb.getCachedById(image.uid) as User
      return {
        id: image.id,
        owner: {
          id: owner.id,
          name: owner.name,
          home: owner.home
        },
        cdateStr: dateToString(image.cdate),
        vers: image.vers,
        comment: image.comment,
        thumbUrl: ifm.getThumbUrlFor(image.id)
      }
    })
  )
}
