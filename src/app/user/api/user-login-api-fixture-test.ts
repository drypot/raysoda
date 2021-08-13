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

  describe('login/logout', () => {
    it('should work', async () => {
      await login(request, User1Login)
      let res = await request.get('/api/user/login').expect(200)
      expect(res.body).toEqual({ user: { id: 1, name: 'User 1' } })
      await logout(request)
      res = await request.get('/api/user/login').expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
  })

})
