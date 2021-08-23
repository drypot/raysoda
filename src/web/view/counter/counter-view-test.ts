import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../../api/user/user-login-api.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { AdminLogin, loginForTest, User1Login } from '../../api/user/user-login-api-fixture.js'
import { registerCounterView } from './counter-view.js'

describe('Counter Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let cdb: CounterDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    cdb = CounterDB.from(db)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    registerCounterView(web)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  describe('counter pages', () => {

    describe('/support/counter', () => {
      it('fails if anonymous', async () => {
        await request.get('/support/counter').expect(302).expect('Location', '/user/login')
      })
      it('login as user', async () => {
        await loginForTest(request, User1Login)
      })
      it('fails if user', async () => {
        await request.get('/support/counter').expect(302).expect('Location', '/user/login')
      })
      it('login as admin', async () => {
        await loginForTest(request, AdminLogin)
      })
      it('works', async () => {
        await request.get('/support/counter').expect(200).expect(/<title>Counter/)
      })
    })

  })

})
