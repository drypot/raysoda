import { configFrom } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ValueDB } from '../../../db/value/value-db.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { AdminLogin, loginForTest, User1Login } from '../../api/user-login/login-api-fixture.js'
import { registerBannerPage } from './banner-page.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Banner Page', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let vdb: ValueDB
  let bdb: BannerDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    vdb = ValueDB.from(db)
    bdb = BannerDB.from(vdb)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerBannerPage(web, bdb)
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

  describe('banner', () => {
    it('init table', async () => {
      await vdb.dropTable()
      await vdb.createTable()
    })
    it('banner-update fails if anonymous', async () => {
      await request.get('/banner-update').expect(302).expect('Location', '/login')
    })
    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('banner-update fails if user', async () => {
      await request.get('/banner-update').expect(302).expect('Location', '/login')
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('banner-update', async () => {
      await request.get('/banner-update').expect(200).expect(/<title>Update Banners/)
    })
  })

})


