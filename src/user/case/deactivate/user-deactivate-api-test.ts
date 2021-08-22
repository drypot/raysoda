import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserDeactivateApi } from './user-deactivate-api.js'
import { AdminLogin, loginForTest, User1Login, User2Login } from '../login/user-login-api-fixture.js'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../register-form/user-form.js'

describe('UserDeactivateApi', () => {

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
    registerUserLoginApi(web, udb)
    registerUserDeactivateApi(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('deactivating', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })

    it('deactivating fails before login', async () => {
      const res = await request.del('/api/user/1').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })

    it('login', async () => {
      await loginForTest(request, User1Login)
    })
    it('get login works', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('deactivate user', async () => {
      const res = await request.del('/api/user/1').expect(200)
      expect(res.body).toEqual({})
    })
    it('get login fails', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('user status must be "d"', async () => {
      const user = await udb.findUserById(1)
      expect(user?.status).toBe('d')
    })

    it('login as user2', async () => {
      await loginForTest(request, User2Login)
    })
    it('deactivating other fails', async () => {
      const res = await request.del('/api/user/3').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })

    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('deactivating other works', async () => {
      const res = await request.del('/api/user/3').expect(200)
      expect(res.body).toEqual({})
    })
  })

})
