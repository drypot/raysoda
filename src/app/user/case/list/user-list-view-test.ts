import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { Express2 } from '../../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { Router } from 'express'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { registerUserListView } from './user-list-view.js'

describe('User List View', () => {

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
    registerUserListView(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user list pages', () => {
    it('/user', async () => {
      await request.get('/user').expect(200).expect(/<title>User List/)
    })
  })

})
