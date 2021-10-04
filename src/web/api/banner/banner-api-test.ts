import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { ValueDB } from '../../../db/value/value-db.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { registerBannerApi } from './banner-api.js'
import { loginForTest, logoutForTest } from '../user-login/login-api-fixture.js'
import { NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('Banner Api', () => {

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
    registerBannerApi(web, bdb)
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
  it('get banner empty', async () => {
    const res = await sat.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([])
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('set banner fails', async () => {
    const form = {
      banner: []
    }
    const res = await sat.put('/api/banner-update').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('set banner', async () => {
    const form = {
      banner: [
        { text: 'text1', url: 'url1' },
        { text: 'text2', url: 'url2' },
        { text: 'text3', url: 'url3' },
      ]
    }
    const res = await sat.put('/api/banner-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('get banner filled', async () => {
    const res = await sat.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' },
      { text: 'text3', url: 'url3' },
    ])
  })

})


