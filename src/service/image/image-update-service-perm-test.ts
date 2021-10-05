import { loadConfigSync } from '../../_util/config-loader.js'
import { ImageUpdateForm, ImageUploadForm } from '../../_type/image-form.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix.js'
import { UserDB } from '../../db/user/user-db.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { DB } from '../../db/_db/db.js'
import { imageUploadService } from './image-upload-service.js'
import { imageUpdateService } from './image-update-service.js'
import { Config } from '../../_type/config.js'
import { ErrorConst } from '../../_type/error.js'
import { NOT_AUTHORIZED } from '../../_type/error-user.js'

describe('imageUpdateService Permission', () => {

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
  it('upload image', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(1)
  })
  it('update by USER1 works', async () => {
    const form: ImageUpdateForm = { comment: 'c2' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, USER1, 1, form, err)
    expect(err.length).toBe(0)
  })
  it('update by USER2 fails', async () => {
    const form: ImageUpdateForm = { comment: 'c2' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, USER2, 1, form, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('update by ADMIN works', async () => {
    const form: ImageUpdateForm = { comment: 'c2' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, ADMIN, 1, form, err)
    expect(err.length).toBe(0)
  })

})