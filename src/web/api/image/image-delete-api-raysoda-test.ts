import { configFrom } from '../../../_util/config-loader.js'
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
import { AdminLogin, loginForTest, User1Login, User2Login } from '../user-login/login-api-fixture.js'
import { registerImageDeleteApi } from './image-delete-api.js'
import { existsSync } from 'fs'
import { IMAGE_NOT_EXIST } from '../../../_type/error-image.js'
import { NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Image Delete Api with RaySoda FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).useUpload().start()
    registerLoginApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageDeleteApi(web, idb, ifm)
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
    it('upload 1', async () => {
      const res = await request.post('/api/image-upload').field('comment', 'c')
        .attach('file', 'sample/640x360.jpg').expect(200)
      expect(res.body.id).toEqual(1)
    })
    it('check file 1', async () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('delete 1', async () => {
      const res = await request.delete('/api/image-delete/1').expect(200)
      expect(res.body.err).toBeUndefined()
    })
    it('check file 1 after delete', async () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
    it('delete 1 again, fails', async () => {
      const res = await request.delete('/api/image-delete/1').expect(200)
      expect(res.body.err).toContain(IMAGE_NOT_EXIST)
    })
    it('upload 2', async () => {
      const res = await request.post('/api/image-upload').field('comment', 'c')
        .attach('file', 'sample/640x360.jpg').expect(200)
      expect(res.body.id).toEqual(2)
    })
    it('login as user2', async () => {
      await loginForTest(request, User2Login)
    })
    it('delete 2 fails, owner not match', async () => {
      const res = await request.delete('/api/image-delete/2').expect(200)
      expect(res.body.err).toContain(NOT_AUTHORIZED)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('delete 2 by admin', async () => {
      const res = await request.delete('/api/image-delete/2').expect(200)
      expect(res.body.err).toBeUndefined()
    })
  })

})
