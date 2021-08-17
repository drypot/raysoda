import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { Router } from 'express'

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

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('page: /user/login', () => {
    it('should work', async () => {
      await request.get('/user/login').expect(200).expect(/<title>Login/)
    })
  })

})
