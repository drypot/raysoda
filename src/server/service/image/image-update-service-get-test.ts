import { loadConfigSync } from '../../_util/config-loader'
import { ImageUploadForm } from '../../_type/image-form'
import { ImageFileManager } from '../../file/fileman'
import { ImageDB } from '../../db/image/image-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { UserDB } from '../../db/user/user-db'
import { RaySodaFileManager } from '../../file/raysoda-fileman'
import { DB } from '../../db/_db/db'
import { imageUploadService } from './image-upload-service'
import { imageUpdateGetService } from './image-update-service'
import { Config } from '../../_type/config'
import { ErrorConst } from '../../_type/error'
import { NOT_AUTHORIZED } from '../../_type/error-user'

describe('imageUpdateGetService', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable(false)
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
