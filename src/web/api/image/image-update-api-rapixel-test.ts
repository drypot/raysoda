import { configFrom } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { loginForTest, User1Login } from '../user-login/login-api-fixture.js'
import { identify } from '../../../file/magick/magick2.js'
import { registerImageUpdateApi } from './image-update-api.js'
import { RapixelFileManager } from '../../../file/rapixel-fileman.js'
import { IMAGE_SIZE } from '../../../_type/error-image.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Image Update Api with Rapixel FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/rapixel-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = RapixelFileManager.from(config)

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
        .attach('file', 'sample/5120x2880.jpg').expect(200)
      expect(res.body.id).toEqual(1)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
      expect(r.comment).toBe('c1')
      expect(r.vers).toEqual([5120, 4096, 2560, 1280])
    })
    it('check file', async () => {
      expect((await identify(ifm.getPathFor(1, 5120))).width).toBe(5120)
      expect((await identify(ifm.getPathFor(1, 4096))).width).toBe(4096)
      expect((await identify(ifm.getPathFor(1, 2560))).width).toBe(2560)
      expect((await identify(ifm.getPathFor(1, 1280))).width).toBe(1280)
    })
    it('update', async () => {
      const res = await request.put('/api/image-update/1').field('comment', 'c2')
        .attach('file', 'sample/4096x2304.jpg').expect(200)
      expect(res.body).toEqual({})
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(3000)
      expect(r.comment).toBe('c2')
      expect(r.vers).toEqual([4096, 2560, 1280])
    })
    it('check file', async () => {
      expect((await identify(ifm.getPathFor(1, 5120))).width).toBe(0)
      expect((await identify(ifm.getPathFor(1, 4096))).width).toBe(4096)
      expect((await identify(ifm.getPathFor(1, 2560))).width).toBe(2560)
      expect((await identify(ifm.getPathFor(1, 1280))).width).toBe(1280)
    })
    it('update fails if image too small', async () => {
      const res = await request.put('/api/image-update/1').attach('file', 'sample/2560x1440.jpg').expect(200)
      expect(res.body.err).toContain(IMAGE_SIZE)
    })
  })

})

