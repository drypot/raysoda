import { Config, configFrom } from '../../config/config.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUploadForm } from './form/image-form.js'
import { constants, existsSync } from 'fs'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { UserDB } from '../../db/user/user-db.js'
import { DB } from '../../db/_db/db.js'
import { dateNull } from '../../lib/base/date2.js'
import { Error2 } from '../../lib/base/error2.js'
import { imageUploadService } from './image-upload-service.js'
import { imageDeleteService } from './image-delete-service.js'
import { RapixelFileManager } from '../../file/rapixel-fileman.js'
import { copyFile } from 'fs/promises'

describe('Image Delete Service with Rapixel FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/rapixel-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
    ifm = RapixelFileManager.from(config)
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
      await copyFile('sample/3840x2160.jpg', 'tmp/3840x2160.jpg', constants.COPYFILE_FICLONE)
      const form: ImageUploadForm = { now: dateNull, comment: 'c', file: 'tmp/3840x2160.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('check file 1', async () => {
      expect(existsSync(ifm.getPathFor(1, 4096))).toBe(true)
    })
    it('delete 1', async () => {
      const err: Error2[] = []
      await imageDeleteService(idb, ifm, 1, err)
      expect(err.length).toBe(0)
    })
    it('check file 1 after delete', async () => {
      expect(existsSync(ifm.getPathFor(1, 4096))).toBe(false)
    })
    it('delete 1 again', async () => {
      const err: Error2[] = []
      await imageDeleteService(idb, ifm, 1, err)
      // Service 는 파일이 없어도 에러 보고를 하지 않는다.
      expect(err.length).toBe(0)
    })
  })

})
