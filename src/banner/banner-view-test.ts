import { Config, configFrom } from '../config/config.js'
import { DB } from '../lib/db/db.js'
import { UserDB } from '../user/db/user-db.js'
import { Express2 } from '../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/case/login/user-login-api.js'
import { insertUserFix4 } from '../user/db/user-db-fixture.js'
import { ValueDB } from '../lib/db/value-db.js'
import { BannerDB } from './banner-db.js'
import { AdminLogin, loginForTest } from '../user/case/login/user-login-api-fixture.js'
import { registerBannerView } from './banner-view.js'

describe('Banner View', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let vdb: ValueDB
  let bdb: BannerDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    vdb = ValueDB.from(db)
    bdb = BannerDB.from(vdb)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    registerBannerView(web, bdb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('banner', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
      await vdb.dropTable()
      await vdb.createTable()
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })

    it('/support/banner fails', async () => {
      await request.get('/support/banner').expect(302).expect('Location', '/user/login')
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('/support/banner', async () => {
      await request.get('/support/banner').expect(200).expect(/<title>Update Banners/)
    })

  })

})


