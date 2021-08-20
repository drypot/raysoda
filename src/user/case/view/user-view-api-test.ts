import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { Router } from 'express'
import { registerUserViewApi } from './user-view-api.js'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { AdminLogin, loginForTest, User1Login } from '../login/user-login-api-fixture.js'

describe('User View Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    registerUserViewApi(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user view', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('get user works without login', async () => {
      const res = await request.get('/api/user/1').expect(200)
      expect(res.body.user.id).toBe(1)
      expect(res.body.user.home).toBe('user1')
      expect(res.body.user.email).toBe(undefined)
    })
    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('get self works, returns email', async () => {
      const res = await request.get('/api/user/1').expect(200)
      expect(res.body.user.id).toBe(1)
      expect(res.body.user.home).toBe('user1')
      expect(res.body.user.email).toBe('user1@mail.test')
    })
    it('get other works', async () => {
      const res = await request.get('/api/user/2').expect(200)
      expect(res.body.user.id).toBe(2)
      expect(res.body.user.home).toBe('user2')
      expect(res.body.user.email).toBe(undefined)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('get other works, returns email', async () => {
      const res = await request.get('/api/user/2').expect(200)
      expect(res.body.user.id).toBe(2)
      expect(res.body.user.home).toBe('user2')
      expect(res.body.user.email).toBe('user2@mail.test')
    })
  })

})