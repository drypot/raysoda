import { Config, configFrom } from '../config/config.js'
import { DB } from '../lib/db/db.js'
import { UserDB } from '../user/db/user-db.js'
import { Express2 } from '../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/case/login/user-login-api.js'
import { insertUserFix4 } from '../user/db/user-db-fixture.js'
import { ValueDB } from '../lib/db/value-db.js'
import { BannerDB } from './banner-db.js'
import { registerBannerApi } from './banner-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../user/case/register-form/user-form.js'
import { AdminLogin, loginForTest, User1Login } from '../user/case/login/user-login-api-fixture.js'

describe('Banner Api', () => {

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

    it('get banner without login fails', async () => {
      const res = await request.get('/api/banner').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('get banner as user fails', async () => {
      const res = await request.get('/api/banner').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('get banner', async () => {
      const res = await request.get('/api/banner').expect(200)
      expect(res.body.banner).toEqual([])
    })

    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('set banner fails', async () => {
      const form = {
        banner: []
      }
      const res = await request.put('/api/banner').send(form).expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('set banner', async () => {
      const form = {
        banner: [
          { text: 'text1', url: 'url1' },
          { text: 'text2', url: 'url2' },
          { text: 'text3', url: 'url3' },
        ]
      }
      const res = await request.put('/api/banner').send(form).expect(200)
      expect(res.body).toEqual({})
    })
    it('get banner', async () => {
      const res = await request.get('/api/banner').expect(200)
      expect(res.body.banner).toEqual([
        { text: 'text1', url: 'url1' },
        { text: 'text2', url: 'url2' },
        { text: 'text3', url: 'url3' },
      ])
    })
  })

})


