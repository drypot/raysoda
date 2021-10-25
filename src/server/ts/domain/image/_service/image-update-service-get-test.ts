import { NOT_AUTHORIZED } from '@common/type/error-const'
import { ImageUploadForm } from '@common/type/image-form'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { ErrorConst } from '@common/type/error'
import { ADMIN, insertUserFix4, USER1, USER2 } from '@server/db/user/fixture/user-fix'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { RaySodaFileManager } from '@server/file/raysoda-fileman'
import { imageUploadService } from '@server/domain/image/_service/image-upload-service'
import { imageUpdateGetService } from '@server/domain/image/_service/image-update-service'

describe('imageUpdateGetService', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetObject('RaySodaFileManager') as RaySodaFileManager
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('remove image dir', async () => {
    await ifm.rmRoot()
  })
  it('upload 1 by user1', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, USER1.id, form, err)
    expect(id).toBe(1)
  })
  it('get image for update by user1', async () => {
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, USER1, 1, err)
    expect(image as any).toEqual({
      comment: 'c'
    })
  })
  it('get image for update by user2', async () => {
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, USER2, 1, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('get image for update by admin', async () => {
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, ADMIN, 1, err)
    expect(image as any).toEqual({
      comment: 'c'
    })
  })

})
