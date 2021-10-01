import { readConfigSync } from '../../_util/config-loader.js'
import { identify } from '../../file/magick/magick2.js'
import { ImageUpdateForm, ImageUploadForm } from './_image-service.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { UserDB } from '../../db/user/user-db.js'
import { DB } from '../../db/_db/db.js'
import { imageUploadService } from './image-upload-service.js'
import { imageUpdateService } from './image-update-service.js'
import { OsokyFileManager } from '../../file/osoky-fileman.js'
import { IMAGE_SIZE } from '../../_type/error-image.js'
import { Config } from '../../_type/config.js'
import { ErrorConst } from '../../_type/error.js'

describe('Image Update Service with OsokyFileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = readConfigSync('config/osoky-test.json')
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
    it('upload', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/1280x720.jpg', }
      const err: ErrorConst[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
      expect(r.comment).toBe('c1')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(720)
      expect(meta.height).toBe(720)
    })
    it('update', async () => {
      const form: ImageUpdateForm = { comment: 'c2', file: 'sample/4096x2304.jpg' }
      const err: ErrorConst[] = []
      await imageUpdateService(idb, ifm, 1, form, err)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(3000)
      expect(r.comment).toBe('c2')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(2048)
    })
    it('fails if image too small', async () => {
      const form: ImageUpdateForm = { comment: '', file: 'sample/640x360.jpg' }
      const err: ErrorConst[] = []
      await imageUpdateService(idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_SIZE)
    })
  })

})
