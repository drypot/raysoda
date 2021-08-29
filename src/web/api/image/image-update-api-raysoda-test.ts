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
import { loginForTest, User1Login, User2Login } from '../user/user-login-api-fixture.js'
import { IMAGE_SIZE } from '../../../service/image/form/image-form.js'
import { identify } from '../../../file/magick/magick2.js'
import { registerImageUpdateApi } from './image-update-api.js'
import { NOT_AUTHORIZED } from '../../../service/user/form/user-form.js'

describe('Image Update Api with RaySoda FileManager', () => {

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
    it('upload image', async () => {
      const res = await request.post('/api/image').field('comment', 'h')
        .attach('file', 'sample/2560x1440.jpg').expect(200)
      expect(res.body).toEqual({ id: 1})
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('update image', async () => {
      const res = await request.put('/api/image/1').field('comment', 'v')
        .attach('file', 'sample/1440x2560.jpg').expect(200)
      expect(res.body).toEqual({})
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
      const res = await request.put('/api/image/1').field('comment', 'only').expect(200)
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
    it('fails if image too small', async () => {
      const res = await request.put('/api/image/1').attach('file', 'sample/360x240.jpg').expect(200)
      expect(res.body.err).toContain(IMAGE_SIZE)
    })
    it('login as user2', async () => {
      await loginForTest(request, User2Login)
    })
    it('fails if owner not match', async () => {
      const res = await request.put('/api/image/1').expect(200)
      expect(res.body.err).toContain(NOT_AUTHORIZED)
    })
  })

})


