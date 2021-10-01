import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { ImageUploadForm } from './_image-service.js'
import { identify } from '../../file/magick/magick2.js'
import { imageUploadService } from './image-upload-service.js'
import { RapixelFileManager } from '../../file/rapixel-fileman.js'
import { copyFile } from 'fs/promises'
import { constants } from 'fs'
import { IMAGE_SIZE } from '../../_type/error-image.js'
import { Config } from '../../_type/config.js'
import { ErrorConst } from '../../_type/error.js'

describe('Image Upload Service with RapixelFileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = readConfigSync('config/rapixel-test.json')
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

  describe('upload image', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('upload fails if image is too small', async () => {
      // mogrify 가 소스를 업데이트한다.
      // tmp 로 복사해 놓고 쓴다.
      await copyFile('sample/2560x1440.jpg', 'tmp/2560x1440.jpg', constants.COPYFILE_FICLONE)
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'tmp/2560x1440.jpg', }
      const err: ErrorConst[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_SIZE)
    })
    it('upload fails if image is vertical', async () => {
      await copyFile('sample/2160x3840.jpg', 'tmp/2160x3840.jpg', constants.COPYFILE_FICLONE)
      const form: ImageUploadForm = { now: new Date(), comment: '', file: 'tmp/2160x3840.jpg', }
      const err: ErrorConst[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(err).toContain(IMAGE_SIZE)
    })
    it('upload 1', async () => {
      await copyFile('sample/5120x2880.jpg', 'tmp/5120x2880.jpg', constants.COPYFILE_FICLONE)
      const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'tmp/5120x2880.jpg', }
      const err: ErrorConst[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(8000)
      expect(r.comment).toBe('c1')
      expect(r.vers).toEqual([5120, 4096, 2560, 1280])
    })
    it('check file', async () => {
      expect((await identify(ifm.getPathFor(1, 5120))).width).toBe(5120)
      expect((await identify(ifm.getPathFor(1, 4096))).width).toBe(4096)
      expect((await identify(ifm.getPathFor(1, 2560))).width).toBe(2560)
      expect((await identify(ifm.getPathFor(1, 1280))).width).toBe(1280)
    })
    it('upload 2', async () => {
      await copyFile('sample/3840x2160.jpg', 'tmp/3840x2160.jpg', constants.COPYFILE_FICLONE)
      const form: ImageUploadForm = { now: new Date(), comment: 'c2', file: 'tmp/3840x2160.jpg', }
      const err: ErrorConst[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(2)
    })
    it('check db', async () => {
      const r = await idb.findImage(2)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(8000)
      expect(r.comment).toBe('c2')
      expect(r.vers).toEqual([4096, 2560, 1280])
    })
    it('check file', async () => {
      expect((await identify(ifm.getPathFor(2, 5120))).width).toBe(0)
      expect((await identify(ifm.getPathFor(2, 4096))).width).toBe(4096)
      expect((await identify(ifm.getPathFor(2, 2560))).width).toBe(2560)
      expect((await identify(ifm.getPathFor(2, 1280))).width).toBe(1280)
    })
  })

})


