import { User } from '@common/type/user'
import { dateToString } from '@common/util/date2'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { Image } from '@common/type/image'
import { ImageFileManager } from '@server/fileman/_fileman'
import { PageParam } from '@common/type/page'
import { ImageListItem, ImagePage } from '@common/type/image-list'

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
