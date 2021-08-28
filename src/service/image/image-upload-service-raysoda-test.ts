import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { FormError } from '../../lib/base/error2.js'
import { IMAGE_NO_FILE, IMAGE_SIZE, IMAGE_TYPE, ImageUploadForm } from './form/image-form.js'
import { identify } from '../../file/magick/magick2.js'
import { imageUploadService } from './image-upload-service.js'

describe('Image Service with RaySoda FileManager', () => {

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

  describe('upload image', () => {
    it('init able', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('upload fails if file not sent', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: '', file: undefined, }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_NO_FILE)
    })
    it('upload fails if file is not image', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/text1.txt', }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_TYPE)
    })
    it('upload fails if image is too small', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/360x240.jpg', }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_SIZE)
    })
    it('upload horizontal image', async () => {
      // resize 기능 테스트를 위해 2048 보다 큰 이미지를 업로드한다.
      const form: ImageUploadForm = { now: new Date(), comment: 'h', file: 'sample/2560x1440.jpg', }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(id).toBe(1)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(2000)
      expect(r.comment).toBe('h')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('upload vertical image', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'v', file: 'sample/1440x2560.jpg', }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(id).toBe(2)
    })
    it('check db', async () => {
      const r = await idb.findImage(2)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(2000)
      expect(r.comment).toBe('v')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(2))
      expect(meta.width).toBe(1152)
      expect(meta.height).toBe(2048)
    })
    it('upload small image', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'small', file: 'sample/640x360.jpg', }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(id).toBe(3)
    })
    it('check db', async () => {
      const r = await idb.findImage(3)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(2000)
      expect(r.comment).toBe('small')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(3))
      expect(meta.width).toBe(640)
      expect(meta.height).toBe(360)
    })
    it('upload 4th image should fail', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'small', file: 'sample/640x360.jpg', }
      const errs: FormError[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, errs)
      expect(id).toBeUndefined()
    })
  })

})

