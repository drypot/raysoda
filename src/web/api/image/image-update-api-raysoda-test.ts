import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { loginForTest, logoutForTest, User1Login, User2Login } from '../user-login/login-api-fixture.js'
import { identify } from '../../../file/magick/magick2.js'
import { registerImageUpdateApi } from './image-update-api.js'
import { IMAGE_NOT_EXIST, IMAGE_SIZE } from '../../../_type/error-image.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Image Update Api with RaySoda FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = readConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).useUpload().start()
    registerLoginApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageUpdateApi(web, idb, ifm)
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

  describe('update image', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('upload', async () => {
      const res = await request.post('/api/image-upload').field('comment', 'c1')
        .attach('file', 'sample/2560x1440.jpg').expect(200)
      expect(res.body.id).toEqual(1)
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('update', async () => {
      const res = await request.put('/api/image-update/1').field('comment', 'c2')
        .attach('file', 'sample/1440x2560.jpg').expect(200)
      expect(res.body).toEqual({})
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
      expect(meta.width).toBe(1152)
      expect(meta.height).toBe(2048)
    })
    it('update comment', async () => {
      const res = await request.put('/api/image-update/1').field('comment', 'only').expect(200)
      expect(res.body).toEqual({})
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
    it('update fails if image too small', async () => {
      const res = await request.put('/api/image-update/1').attach('file', 'sample/360x240.jpg').expect(200)
      expect(res.body.err).toContain(IMAGE_SIZE)
    })
    it('update fails if image not exist', async () => {
      const res = await request.put('/api/image-update/2').expect(200)
      expect(res.body.err).toContain(IMAGE_NOT_EXIST)
    })
    it('logout', async () => {
      await logoutForTest(request)
    })
    it('update fails if not logged in', async () => {
      const res = await request.put('/api/image-update/1').expect(200)
      expect(res.body.err).toContain(NOT_AUTHENTICATED)
    })
    it('login as user2', async () => {
      await loginForTest(request, User2Login)
    })
    it('update fails if owner not match', async () => {
      const res = await request.put('/api/image-update/1').expect(200)
      expect(res.body.err).toContain(NOT_AUTHORIZED)
    })
  })

})


