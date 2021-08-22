import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { EMAIL_NOT_FOUND, NOT_AUTHENTICATED, NOT_AUTHORIZED, PASSWORD_WRONG } from '../register-form/user-form.js'

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

  describe('login', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })

    // user change
    it('login as user1', async () => {
      const form = { email: 'user1@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('get login works', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('login as user2', async () => {
      const form = { email: 'user2@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.user.id).toBe(2)
    })
    it('get login works', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.user.id).toBe(2)
    })

    // permission
    it('login as user1', async () => {
      const form = { email: 'user1@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('get admin-login fails', async () => {
      const res = await request.get('/api/user/admin-login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
    it('login as admin', async () => {
      const form = { email: 'admin@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.user.id).toBe(4)
      expect(res.body.user.admin).toBe(true)
    })
    it('get admin-login works', async () => {
      const res = await request.get('/api/user/admin-login').expect(200)
      expect(res.body.user.id).toBe(4)
      expect(res.body.user.admin).toBe(true)
    })

    // logout
    it('logout', async () => {
      await request.post('/api/user/logout').expect(200)
    })
    it('get login fails', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })

    // error
    it('email check works', async () => {
      const form = { email: 'userx@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.err).toContain(EMAIL_NOT_FOUND)
    })
    it('password check works', async () => {
      const form = { email: 'user1@mail.test', password: 'xxxx', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.err).toContain(PASSWORD_WRONG)
    })
  })

})
