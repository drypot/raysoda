import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { Express2 } from '../../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { Router } from 'express'
import { registerUserLoginView } from './user-login-view.js'

describe('UserLoginView', () => {

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
    registerUserLoginView(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user login pages', () => {
    it('/user/login should work', async () => {
      await request.get('/user/login').expect(200).expect(/<title>Login/)
    })
  })

})
