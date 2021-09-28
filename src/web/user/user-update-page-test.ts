import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { insertUserFix1 } from '../../db/user/user-db-fixture.js'
import { loginForTest, User1Login } from './user-login-api-fixture.js'
import { registerUserUpdatePage } from './user-update-page.js'

describe('User Update Page', () => {

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
    registerUserUpdatePage(web, udb)
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
    it('user-update 1', async () => {
      await request.get('/user-update/1').expect(200).expect(/<title>Update/)
    })
  })

})
