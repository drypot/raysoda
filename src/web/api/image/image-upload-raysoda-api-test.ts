import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/user-login-api.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { loginForTest, User1Login } from '../user/user-login-api-fixture.js'
import { FormError } from '../../../lib/base/error2.js'
import { IMAGE_NO_FILE, IMAGE_SIZE, IMAGE_TYPE } from '../../../service/image/form/image-form.js'
import { identify } from '../../../file/magick/magick2.js'

describe('Image Upload RaySoda Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)

    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).useUpload().start()
    registerUserLoginApi(web, udb)
    registerImageUploadApi(web, udb, idb, ifm)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
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
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('upload fails if file not sent', async () => {
      const res = await request.post('/api/image').expect(200)
      const errs: FormError[] = res.body.err
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_NO_FILE)
    })
    it('upload fails if file is not image', async () => {
      const res = await request.post('/api/image').attach('file', 'sample/text1.txt').expect(200)
      const errs: FormError[] = res.body.err
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_TYPE)
    })
    it('upload fails if image is too small', async () => {
      const res = await request.post('/api/image').attach('file', 'sample/360x240.jpg').expect(200)
      const errs: FormError[] = res.body.err
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_SIZE)
    })
    it('upload horizontal image', async () => {
      // resize 기능 테스트를 위해 2048 보다 큰 이미지를 업로드한다.
      const res = await request.post('/api/image')
        .field('comment', 'h')
        .attach('file', 'sample/2560x1440.jpg')
        .expect(200)
      expect(res.body.id).toBe(1)
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
      const res = await request.post('/api/image')
        .field('comment', 'v')
        .attach('file', 'sample/1440x2560.jpg')
        .expect(200)
      expect(res.body.id).toBe(2)
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
      const res = await request.post('/api/image')
        .field('comment', 'small')
        .attach('file', 'sample/640x360.jpg')
        .expect(200)
      expect(res.body.id).toBe(3)
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
      const res = await request.post('/api/image')
        .field('comment', 'small')
        .attach('file', 'sample/640x360.jpg')
        .expect(200)
      expect(res.body.err).toBeUndefined()
      expect(res.body.id).toBeUndefined()
    })
  })

})


