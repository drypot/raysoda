import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { loginForTest, User1Login } from '../login/user-login-api-fixture.js'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { registerUserDeactivateView } from './user-deactivate-view.js'

describe('UserDeactivateView', () => {

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
    registerUserDeactivateView(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user deactivate page', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('/user/deactivate should work', async () => {
      await loginForTest(request, User1Login)
      await request.get('/user/deactivate').expect(200).expect(/<title>Deactivate/)
    })
  })

})
