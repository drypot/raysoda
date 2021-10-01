import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { registerClientInitScript } from './client-init-script.js'
import { ValueDB } from '../../../db/value/value-db.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { registerBannerApi } from '../../api/banner/banner-api.js'
import { loginForTest, logoutForTest, User1Login } from '../../api/user-login/login-api-fixture.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Client Init Script', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let vdb: ValueDB
  let bdb: BannerDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    vdb = ValueDB.from(db)
    bdb = BannerDB.from(vdb)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerBannerApi(web, bdb)
    registerClientInitScript(web, bdb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('login', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
      await vdb.dropTable()
      await vdb.createTable()
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('get session script', async () => {
      const res = await request.get('/api/client-init-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.",` +
        `"mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}\n` +
        `const _user = null\n` +
        `const _banner = []\n`
      )
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('get session script with login', async () => {
      const res = await request.get('/api/client-init-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.",` +
        `"mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}\n` +
        `const _user = {"id":1,"name":"User 1","home":"user1","admin":false}\n` +
        `const _banner = []\n`
      )
    })
    it('logout', async () => {
      await logoutForTest(request)
    })
    it('set banner', async () => {
      await bdb.setBanner([{ text: 'text1', url: 'url1' }])
    })
    it('get session script with banner', async () => {
      const res = await request.get('/api/client-init-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.",` +
        `"mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}\n` +
        `const _user = null\n` +
        `const _banner = [{"text":"text1","url":"url1"}]\n`
      )
    })

  })

})