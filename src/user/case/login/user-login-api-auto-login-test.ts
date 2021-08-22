import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { NOT_AUTHENTICATED } from '../register-form/user-form.js'
import { loginForTest, logoutForTest, User1Login } from './user-login-api-fixture.js'

describe('UserLoginApi', () => {

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

    it('get login fails before login', async () => {
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
    it('get login works', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('cookies are filled', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe('user1@mail.test')
    })

    it('destroy session', async () => {
      await request.post('/api/destroy-session').expect(200)
    })
    it('get login works (autologin worked)', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('cookies still exist', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe('user1@mail.test')
    })

    it('logout', async () => {
      await logoutForTest(request)
    })
    it('get login fails', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookies are empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })

    it('login 2', async () => {
      await loginForTest(request, User1Login, true)
    })
    it('get login works', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toBe(undefined)
    })

    it('change db email', async () => {
      await db.query('update user set email = "userx@mail.test" where id = ?', 1)
    })
    it('destroy session', async () => {
      await request.post('/api/destroy-session').expect(200)
    })
    it('get login fails (autologin failed)', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookies are empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })
  })

})
