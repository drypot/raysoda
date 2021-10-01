import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { AdminLogin, loginForTest, User1Login } from '../../api/user-login/login-api-fixture.js'
import { registerCounterPage } from './counter-page.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Counter Page', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let cdb: CounterDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    cdb = CounterDB.from(db)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerCounterPage(web)
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

    describe('/counter', () => {
      it('fails if anonymous', async () => {
        await request.get('/counter').expect(302).expect('Location', '/login')
      })
      it('login as user', async () => {
        await loginForTest(request, User1Login)
      })
      it('fails if user', async () => {
        await request.get('/counter').expect(302).expect('Location', '/login')
      })
      it('login as admin', async () => {
        await loginForTest(request, AdminLogin)
      })
      it('works', async () => {
        await request.get('/counter').expect(200).expect(/<title>Counter/)
      })
    })

  })

})
