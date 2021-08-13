import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserDBFixture4 } from '../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { initUserLoginApi } from './user-login-api.js'
import { Router } from 'express'
import { NOT_AUTHENTICATED } from '../form/user-form.js'
import { login, logout, User1Login } from './user-login-api-fixture.js'

describe('UserLoginApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')

    db = new DB(config)
    udb = new UserDB(db)
    await db.createDatabase()

    web = new Express2(config)
    initUserLoginApi(udb, web)
    await web.start()
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserDBFixture4(udb)
  })

  describe('story: testing auto login', () => {
    it('before login', () => {
      //
    })
    it('access should fail', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookie should be empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })

    it('after login with remember true', async () => {
      await login(request, User1Login, true)
    })
    it('access should ok', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toBe(undefined)
    })
    it('cookie should be filled', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe('user1@mail.test')
    })

    it('after session destroyed', async () => {
      await request.post('/api/destroy-session').expect(200)
    })
    it('access should ok (autologin worked)', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toBe(undefined)
    })
    it('cookie should still exist', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe('user1@mail.test')
    })

    it('after logout', async () => {
      await logout(request)
    })
    it('access should fail', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookie should be empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })

    it('after login 2', async () => {
      await login(request, User1Login, true)
    })
    it('access should ok', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toBe(undefined)
    })

    it('after db email changed', async () => {
      await db.query('update user set email = "userx@mail.test" where id = ?', 1)
    })
    it('after session destroyed', async () => {
      await request.post('/api/destroy-session').expect(200)
    })
    it('access should fail (autologin failed)', async () => {
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('cookie should be empty', async () => {
      const res = await request.get('/api/cookies').expect(200)
      expect(res.body.email).toBe(undefined)
    })
  })

})
