import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../../api/user/user-login-api.js'
import { insertUserFix1 } from '../../../db/user/user-db-fixture.js'
import { loginForTest, User1Login } from '../../api/user/user-login-api-fixture.js'
import { registerUserUpdateView } from './user-update-view.js'

describe('UserLoginApi', () => {

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
    registerUserUpdateView(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user update pages', () => {
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
    it('/user/1/update', async () => {
      await request.get('/user/1/update').expect(200).expect(/<title>Update/)
    })
  })

})
