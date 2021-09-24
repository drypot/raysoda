import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/user-login-api.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { ValueDB } from '../../db/value/value-db.js'
import { BannerDB } from '../../db/banner/banner-db.js'
import { registerBannerApi } from './banner-api.js'
import { NOT_AUTHORIZED } from '../../service/user/form/user-form.js'
import { AdminLogin, loginForTest, logoutForTest, User1Login } from '../user/user-login-api-fixture.js'

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
      expect(res.body.err).toContain(NOT_AUTHORIZED)
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
    it('logout', async () => {
      await logoutForTest(request)
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


