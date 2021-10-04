import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { ValueDB } from '../../../db/value/value-db.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { loginForTest } from '../../api/user-login/login-api-fixture.js'
import { registerBannerPage } from './banner-page.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('BannerPage', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let vdb: ValueDB
  let bdb: BannerDB

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    vdb = ValueDB.from(db)
    bdb = await BannerDB.from(vdb)

    web = Express2.from(config)
    registerLoginApi(web, uc)
    registerBannerPage(web, bdb)
    await web.start()
    sat = supertest.agent(web.server)
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

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
    await bdb.loadCache()
  })
  it('banner-update fails if anonymous', async () => {
    await sat.get('/banner-update').expect(302).expect('Location', '/login')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('banner-update fails if user', async () => {
    await sat.get('/banner-update').expect(302).expect('Location', '/login')
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('banner-update', async () => {
    await sat.get('/banner-update').expect(200).expect(/<title>Update Banners/)
  })

})


