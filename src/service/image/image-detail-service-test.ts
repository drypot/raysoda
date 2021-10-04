import { UserDB } from '../../db/user/user-db.js'
import { loadConfigSync } from '../../_util/config-loader.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUploadForm } from '../../_type/image-form.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { DB } from '../../db/_db/db.js'
import { imageUploadService } from './image-upload-service.js'
import { imageDetailService } from './image-detail-service.js'
import { IMAGE_NOT_EXIST } from '../../_type/error-image.js'
import { Config } from '../../_type/config.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'

describe('imageDetailService', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
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

  let now: Date

  it('upload image', async () => {
    now = new Date
    const form: ImageUploadForm = { now: now, comment: 'c1', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, USER1.id, form, err)
    expect(id).toBe(1)
  })
  it('get image 1 by user1', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, USER1, 1, err)
    if (!image) throw new Error()
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: 0,
      cdateStr: '',
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('get image 1 by user2', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, USER2, 1, err)
    if (!image) throw new Error()
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: 0,
      cdateStr: '',
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: false // ***
    })
  })
  it('get image 1 by admin', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, ADMIN, 1, err)
    if (!image) throw new Error()
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: 0,
      cdateStr: '',
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('get image fails if id invalid', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, USER1, 99, err)
    expect(err).toContain(IMAGE_NOT_EXIST)
  })

})
