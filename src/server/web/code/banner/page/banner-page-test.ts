import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ValueDB } from '../../../../db/value/value-db'
import { BannerDB } from '../../../../db/banner/banner-db'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { registerBannerPage } from './banner-page'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

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
    registerUserAuthApi(web, uc)
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


