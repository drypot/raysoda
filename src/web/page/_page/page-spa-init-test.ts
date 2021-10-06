import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { registerPageSupport } from './page.js'
import { ValueDB } from '../../../db/value/value-db.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { registerBannerApi } from '../../api/banner/banner-api.js'
import { loginForTest, logoutForTest } from '../../api/user-login/login-api-fixture.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('SpaInitScript', () => {

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
    registerPageSupport(web, bdb)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await vdb.dropTable()
    await vdb.createTable()
    await bdb.loadCache()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('get session script', async () => {
    const res = await sat.get('/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
`const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":-1,"name":"","home":"","admin":false}
const _banner = []
`
    )
  })
  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get session script with login', async () => {
    const res = await sat.get('/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
`const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":1,"name":"User 1","home":"user1","admin":false}
const _banner = []
`
    )
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('set banner', async () => {
    await bdb.updateBannerList([{ text: 'text1', url: 'url1' }])
  })
  it('get session script with banner', async () => {
    const res = await sat.get('/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
`const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":-1,"name":"","home":"","admin":false}
const _banner = [{"text":"text1","url":"url1"}]
`
    )
  })

})
