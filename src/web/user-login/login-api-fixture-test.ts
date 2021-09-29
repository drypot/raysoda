import { configFrom } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from './login-api.js'
import { loginForTest, logoutForTest, User1Login } from './login-api-fixture.js'
import { NOT_AUTHENTICATED } from '../../_type/error-user.js'
import { Config } from '../../_type/config.js'

describe('Login Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = await Express2.from(config).start()
    registerLoginApi(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('login/logout', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })

    it('login', async () => {
      await loginForTest(request, User1Login)
    })
    it('get login works', async () => {
      const res = await request.get('/api/session-user').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('logout', async () => {
      await logoutForTest(request)
    })
    it('get login fails', async () => {
      const res = await request.get('/api/session-user').expect(200)
      expect(res.body.err).toContain(NOT_AUTHENTICATED)
    })
  })

})