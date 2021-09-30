import { configFrom } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { registerImageUploadPage } from './image-upload-page.js'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { loginForTest, User1Login } from '../../api/user-login/login-api-fixture.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Image Upload Page', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerImageUploadPage(web, udb, idb)
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

  describe('image upload page', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable()
    })
    it('fails if anonymous', async () => {
      await request.get('/image-upload').expect(302).expect('Location', '/login')
    })
    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('succeeds', async () => {
      await request.get('/image-upload').expect(200)
    })
  })

})

