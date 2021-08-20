import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { Router } from 'express'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { AdminLogin, loginForTest, User1Login } from '../login/user-login-api-fixture.js'
import { registerUserUpdateApi } from './user-update-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../register-form/user-form.js'

describe('User Update Api', () => {

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
    registerUserUpdateApi(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  const form = { name: 'User X', home: 'userx', email: 'userx@mail.test', password: '1234', }

  describe('update without login', () => {
    it('update fails', async () => {
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
  })

  describe('update self', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('update user1 works', async () => {
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body).toEqual({})
    })
  })

  describe('update other', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('update user2 fails', async () => {
      const res = await request.put('/api/user/' + 2).send(form)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
  })

  describe('update as admin', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('update user2 works', async () => {
      const res = await request.put('/api/user/' + 2).send(form)
      expect(res.body).toEqual({})
    })
  })

})
