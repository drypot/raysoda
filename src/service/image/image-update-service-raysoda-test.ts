import { Config, configFrom } from '../../config/config.js'
import { identify } from '../../file/magick/magick2.js'
import { IMAGE_SIZE, ImageUpdateForm, ImageUploadForm } from './form/image-form.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { UserDB } from '../../db/user/user-db.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { DB } from '../../db/_db/db.js'
import { Error2 } from '../../lib/base/error2.js'
import { imageUploadService } from './image-upload-service.js'
import { dateNull } from '../../lib/base/date2.js'
import { imageUpdateService } from './image-update-service.js'

describe('Image Update Service with RaySoda FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')
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

  describe('update image', () => {
    it('init able', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('upload image', async () => {
      const form: ImageUploadForm = { now: dateNull, comment: 'h', file: 'sample/2560x1440.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('update image', async () => {
      const form: ImageUpdateForm = { comment: 'v', file: 'sample/1440x2560.jpg' }
      const err: Error2[] = []
      await imageUpdateService(idb, ifm, 1, form, err)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(3000)
      expect(r.comment).toBe('v')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(1152)
      expect(meta.height).toBe(2048)
    })
    it('update comment only', async () => {
      const form: ImageUpdateForm = { comment: 'only' }
      const err: Error2[] = []
      await imageUpdateService(idb, ifm, 1, form, err)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.comment).toBe('only')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(1152)
      expect(meta.height).toBe(2048)
    })
    it('fails if image too small', async () => {
      const form: ImageUpdateForm = { comment: 'only', file: 'sample/360x240.jpg' }
      const err: Error2[] = []
      await imageUpdateService(idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_SIZE)
    })
  })

})