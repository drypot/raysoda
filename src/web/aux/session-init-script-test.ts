import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/user-login-api.js'
import { registerSessionInitScript } from './session-init-script.js'
import { ValueDB } from '../../db/value/value-db.js'
import { BannerDB } from '../../db/banner/banner-db.js'
import { registerBannerApi } from '../banner/banner-api.js'
import { loginForTest, logoutForTest, User1Login } from '../user/user-login-api-fixture.js'

describe('Session Init Script', () => {

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
    registerBannerApi(web, bdb)
    registerSessionInitScript(web, bdb)
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
      const res = await request.get('/api/session-init-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {}\n` +
        `_config.appName = 'RaySoda'\n` +
        `_config.appNamel = 'raysoda'\n` +
        `_config.appDesc = 'One day, one photo.'\n` +
        `_config.mainUrl = 'http://raysoda.test:8080'\n` +
        `_config.uploadUrl = 'http://file.raysoda.test:8080'\n` +
        `const _user = null\n` +
        `const _banner = []\n`
      )
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('get session script with login', async () => {
      const res = await request.get('/api/session-init-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {}\n` +
        `_config.appName = 'RaySoda'\n` +
        `_config.appNamel = 'raysoda'\n` +
        `_config.appDesc = 'One day, one photo.'\n` +
        `_config.mainUrl = 'http://raysoda.test:8080'\n` +
        `_config.uploadUrl = 'http://file.raysoda.test:8080'\n` +
        `const _user = {"id":1,"name":"User 1","home":"user1"}\n` +
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
      const res = await request.get('/api/session-init-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {}\n` +
        `_config.appName = 'RaySoda'\n` +
        `_config.appNamel = 'raysoda'\n` +
        `_config.appDesc = 'One day, one photo.'\n` +
        `_config.mainUrl = 'http://raysoda.test:8080'\n` +
        `_config.uploadUrl = 'http://file.raysoda.test:8080'\n` +
        `const _user = null\n` +
        `const _banner = [{"text":"text1","url":"url1"}]\n`
      )
    })

  })

})
