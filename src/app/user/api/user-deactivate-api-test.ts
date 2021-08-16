import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserFix4 } from '../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserDeactivateApi } from './user-deactivate-api.js'
import { AdminLogin, loginForTest, logoutForTest, User1Login, User2Login } from './user-login-api-fixture.js'
import { registerUserLoginApi } from './user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../form/user-form.js'

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

    web = Express2.from(config)
    registerUserLoginApi(web, udb)
    registerUserDeactivateApi(web, udb)
    await web.start()
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

  // Pages

  describe('page /user/deactivate', () => {
    it('should work', async () => {
      await loginForTest(request, User1Login)
      await request.get('/user/deactivate').expect(200).expect(/<title>Deactivate/)
    })
  })

  // Api

  describe('deactivating self', () => {
    it('after login', async () => {
      await loginForTest(request, User1Login)
    })
    it('get login should ok', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(undefined)
    })

    it('after deactivating user', async () => {
      const res = await request.del('/api/user/1').expect(200)
      expect(res.body.err).toEqual(undefined)
    })
    it('get login should fail', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('user status must be "d"', async () => {
      const user = await udb.findUserById(1)
      expect(user?.status).toBe('d')
    })
  })

  describe('deactivating without login', () => {
    it('without login', async () => {
      await logoutForTest(request)
    })
    it('deactivating should fail', async () => {
      const res = await request.del('/api/user/1').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
  })

  describe('deactivating other', () => {
    it('after login', async () => {
      await loginForTest(request, User2Login)
    })
    it('deactivating other should fail', async () => {
      const res = await request.del('/api/user/3').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
  })

  describe('deactivating other by admin', () => {
    it('after login', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('deactivating other should work', async () => {
      const res = await request.del('/api/user/3').expect(200)
      expect(res.body.err).toEqual(undefined)
    })
  })

})
