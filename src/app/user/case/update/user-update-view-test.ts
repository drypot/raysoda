import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { Express2 } from '../../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { Router } from 'express'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { insertUserFix1 } from '../../db/user-db-fixture.js'
import { loginForTest, User1Login } from '../login/user-login-api-fixture.js'
import { registerUserUpdateView } from './user-update-view.js'

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
    registerUserUpdateView(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user update page', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('login', async () => {
      await loginForTest(request, User1Login)
    })
    it('get page', async () => {
      await request.get('/user/1/update').expect(200).expect(/<title>Update/)
    })
  })

})
