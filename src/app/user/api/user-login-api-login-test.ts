import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserDBFixture4 } from '../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { initUserLoginApi } from './user-login-api.js'
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

  // Pages

  describe('page: /user/login', () => {
    it('should work', async () => {
      await request.get('/user/login').expect(200).expect(/<title>Login/)
    })
  })

  // Api

  describe('login: post /api/user/login', () => {
    it('should work', async () => {
      const form = { email: 'user1@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body).toEqual({ user: { id: 1, name: 'User 1' } })
    })
    it('should work 2', async () => {
      const form = { email: 'admin@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body).toEqual({
        user: { id: 4, name: 'Admin' }
      })
    })
    it('should fail with invalid email', async () => {
      const form = { email: 'userx@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.err).toContain(EMAIL_NOT_FOUND)
    })
    it('should fail with invalid password', async () => {
      const form = { email: 'user1@mail.test', password: 'xxxx', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.err).toContain(PASSWORD_WRONG)
    })
  })

  describe('logout: post /api/user/logout', () => {
    it('should work', async () => {
      const res = await request.post('/api/user/logout').expect(200)
      expect(res.body).toEqual({})
    })
  })

  describe('get login info: get /api/user/login', () => {
    it('should work for user', async () => {
      await request.post('/api/user/login').send({ email: 'user1@mail.test', password: '1234' }).expect(200)
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body).toEqual({ user: { id: 1, name: 'User 1' } })
    })
    it('should work for admin', async () => {
      await request.post('/api/user/login').send({ email: 'admin@mail.test', password: '1234' }).expect(200)
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body).toEqual({ user: { id: 4, name: 'Admin' } })
    })
    it('should fail when not logged in', async () => {
      await request.post('/api/user/logout').expect(200)
      const res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
  })

  describe('get admin login info: get /api/user/login-admin', () => {
    it('should work for admin', async () => {
      await request.post('/api/user/login').send({ email: 'admin@mail.test', password: '1234' }).expect(200)
      const res = await request.get('/api/user/login-admin').expect(200)
      expect(res.body).toEqual({ user: { id: 4, name: 'Admin' } })
    })
    it('should fail for user', async () => {
      await request.post('/api/user/login').send({ email: 'user1@mail.test', password: '1234' }).expect(200)
      const res = await request.get('/api/user/login-admin').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
    it('should fail when not logged in', async () => {
      await request.post('/api/user/logout').expect(200)
      const res = await request.get('/api/user/login-admin').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
  })

})
