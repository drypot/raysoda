import { Config, configFrom } from '../../config/config.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUploadForm } from './form/image-form.js'
import { existsSync } from 'fs'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { UserDB } from '../../db/user/user-db.js'
import { DB } from '../../db/_db/db.js'
import { Error2 } from '../../lib/base/error2.js'
import { imageUploadService } from './image-upload-service.js'
import { imageDeleteService } from './image-delete-service.js'
import { OsokyFileManager } from '../../file/osoky-fileman.js'

describe('Image Delete Service with Osoky FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/osoky-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
    ifm = OsokyFileManager.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  describe('update image', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('upload 1', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'c', file: 'sample/1280x720.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('check file 1', async () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('delete 1', async () => {
      const err: Error2[] = []
      await imageDeleteService(idb, ifm, 1, err)
      expect(err.length).toBe(0)
    })
    it('check file 1 after delete', async () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
    it('delete 1 again', async () => {
      const err: Error2[] = []
      await imageDeleteService(idb, ifm, 1, err)
      // Service 는 파일이 없어도 에러 보고를 하지 않는다.
      expect(err.length).toBe(0)
    })
  })

})
