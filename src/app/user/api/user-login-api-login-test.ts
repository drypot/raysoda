import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserFix4 } from '../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { Router } from 'express'
import { EMAIL_NOT_FOUND, NOT_AUTHENTICATED, NOT_AUTHORIZED, PASSWORD_WRONG } from '../form/user-form.js'

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

  // Pages

  describe('page: /user/login', () => {
    it('should work', async () => {
      await request.get('/user/login').expect(200).expect(/<title>Login/)
    })
  })

  // Api

  describe('login', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })

    it('login', async () => {
      const form = { email: 'user1@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body).toEqual({ user: { id: 1, name: 'User 1', home: 'user1', admin: false } })
    })
    it('get login should work', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body).toEqual({ user: { id: 1, name: 'User 1', home: 'user1', admin: false } })
    })
    it('get admin-login should fail', async () => {
      const res = await request.get('/api/user/admin-login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })

    it('login as admin', async () => {
      const form = { email: 'admin@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body).toEqual({ user: { id: 4, name: 'Admin', home: 'admin', admin: true } })
    })
    it('get admin-login should work', async () => {
      const res = await request.get('/api/user/admin-login').expect(200)
      expect(res.body).toEqual({ user: { id: 4, name: 'Admin', home: 'admin', admin: true } })
    })

    it('logout', async () => {
      await request.post('/api/user/logout').expect(200)
    })
    it('get login should fail', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })

    it('login should fail if email invalid', async () => {
      const form = { email: 'userx@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.err).toContain(EMAIL_NOT_FOUND)
    })
    it('login should fail if password invalid', async () => {
      const form = { email: 'user1@mail.test', password: 'xxxx', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.err).toContain(PASSWORD_WRONG)
    })
  })

})
