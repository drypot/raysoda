import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserFix4 } from '../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { Router } from 'express'
import { NOT_AUTHENTICATED } from '../api-register-form/user-form.js'
import { loginForTest, logoutForTest, User1Login } from './user-login-api-fixture.js'

describe('UserLoginApi', () => {

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

    web = Express2.from(config)
    registerUserLoginApi(web, udb)
    await web.start()
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('auto login', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })

    it('before login', () => {
      //
    })
    it('get login should fail', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookie should be empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })

    it('login', async () => {
      await loginForTest(request, User1Login, true)
    })
    it('get login should work', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('cookie should be filled', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe('user1@mail.test')
    })

    it('destroy session', async () => {
      await request.post('/api/destroy-session').expect(200)
    })
    it('get login should work (autologin worked)', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('cookie should still exist', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe('user1@mail.test')
    })

    it('logout', async () => {
      await logoutForTest(request)
    })
    it('get login should fail', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookie should be empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })

    it('login 2', async () => {
      await loginForTest(request, User1Login, true)
    })
    it('get login should work', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toBe(undefined)
    })

    it('change db email', async () => {
      await db.query('update user set email = "userx@mail.test" where id = ?', 1)
    })
    it('destroy session', async () => {
      await request.post('/api/destroy-session').expect(200)
    })
    it('get login should fail (autologin failed)', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookie should be empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })
  })

})
