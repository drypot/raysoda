import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Error2 } from '../../_error/error2.js'
import { ImageUploadForm } from './_image-service.js'
import { identify } from '../../file/magick/magick2.js'
import { imageUploadService } from './image-upload-service.js'
import { IMAGE_NO_FILE, IMAGE_SIZE, IMAGE_TYPE } from '../../_error/error-image.js'

describe('Image Upload Service with RaySodaFileManager', () => {

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
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('upload fails if file not sent', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: '', file: undefined, }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_NO_FILE)
    })
    it('upload fails if file is not image', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/text1.txt', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_TYPE)
    })
    it('upload fails if image is too small', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/360x240.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_SIZE)
    })
    it('upload horizontal image', async () => {
      // resize 기능 테스트를 위해 2048 보다 큰 이미지를 업로드한다.
      const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/2560x1440.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(2000)
      expect(r.comment).toBe('c1')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('upload vertical image', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'c2', file: 'sample/1440x2560.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(2)
    })
    it('check db', async () => {
      const r = await idb.findImage(2)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(2000)
      expect(r.comment).toBe('c2')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(2))
      expect(meta.width).toBe(1152)
      expect(meta.height).toBe(2048)
    })
    it('upload small image', async () => {
      const form: ImageUploadForm = { now: new Date(), comment: 'small', file: 'sample/640x360.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
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
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/640x360.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBeUndefined()
    })
  })

})


