import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { loginForTest, User1Login, User2Login } from '../../api/user-login/login-api-fixture.js'
import { registerImageUpdatePage } from './image-update-page.js'
import { imageOf } from '../../../_type/image.js'
import { IMAGE_NOT_EXIST } from '../../../_type/error-image.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Image Update Page', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = readConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerImageUpdatePage(web, udb, idb)
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

  describe('image update view', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable()
    })
    it('fails if anonymous', async () => {
      await request.get('/image-update/1').expect(302).expect('Location', '/login')
    })
    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('fails if image not exist', async () => {
      const res = await request.get('/image-update/1').expect(200)
      expect(res.body.err).toContain(IMAGE_NOT_EXIST)
    })
    it('insert image', async () => {
      await idb.insertImage(imageOf({ id: 1, uid: 1 }))
    })
    it('succeeds', async () => {
      const res = await request.get('/image-update/1').expect(200)
      expect(res.body.err).toBeUndefined()
    })
    it('login as user2', async () => {
      await loginForTest(request, User2Login)
    })
    it('fails if owner not match', async () => {
      const res = await request.get('/image-update/1').expect(302).expect('Location', '/login')
    })
  })

})


