import { UserDB } from '../../db/user/user-db.js'
import { Config, configFrom } from '../../config/config.js'
import { ImageFileManager } from '../../file/fileman.js'
import { IMAGE_NOT_EXIST, ImageUploadForm } from './form/image-form.js'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { dateNull, dateTimeStringFrom } from '../../lib/base/date2.js'
import { DB } from '../../db/_db/db.js'
import { Error2 } from '../../lib/base/error2.js'
import { imageUploadService } from './image-upload-service.js'
import { imageViewService } from './image-view-service.js'

describe('Image View Service', () => {

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

  describe('view image', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('upload image', async () => {
      const form: ImageUploadForm = { now: dateNull, comment: 'c1', file: 'sample/640x360.jpg', }
      const err: Error2[] = []
      const id = await imageUploadService(udb, idb, ifm, 1, form, err)
      expect(id).toBe(1)
    })
    it('get image fails if id invalid', async () => {
      const err: Error2[] = []
      const image = await imageViewService(udb, idb, ifm, 2, err)
      expect(err).toContain(IMAGE_NOT_EXIST)
    })
    it('get image', async () => {
      const err: Error2[] = []
      const image = await imageViewService(udb, idb, ifm, 1, err)
      if (!image) throw new Error()
      // image: {
      //   id: 1,
      //   owner: { id: 1, name: 'User 1', home: 'user1' },
      //   cdate: 1630675275332,
      //   cdateStr: '2021-09-03 22:21:15',
      //   vers: null,
      //   comment: 'small',
      //   dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      //   thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      //   updatable: false
      // }
      expect(image.id).toBe(1)
      expect(image.owner).toEqual({ id: 1, name: 'User 1', home: 'user1' })
      expect(Date.now() - image.cdate).toBeLessThan(2000)
      expect(dateTimeStringFrom(new Date(image.cdate))).toBe(image.cdateStr)
      expect(image.vers).toBeNull()
      expect(image.comment).toBe('c1')
      expect(image.dirUrl).toBe(ifm.getDirUrlFor(1))
      expect(image.thumbUrl).toBe(ifm.getThumbUrlFor(1))
      expect(image.updatable).toBe(false)
    })
  })

})
