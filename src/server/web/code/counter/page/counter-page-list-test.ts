import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { CounterDB } from '../../../../db/counter/counter-db'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { registerCounterPage } from './counter-page'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

describe('CounterPage List', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let cdb: CounterDB

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    cdb = CounterDB.from(db)

    web = Express2.from(config)
    registerUserAuthApi(web, uc)
    registerCounterPage(web, cdb)
    await web.start()
    sat = supertest.agent(web.server)
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

  it('fails if anonymous', async () => {
    await sat.get('/counter-list').expect(302).expect('Location', '/login')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('fails if user', async () => {
    await sat.get('/counter-list').expect(302).expect('Location', '/login')
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('works', async () => {
    await sat.get('/counter-list').expect(200).expect(/<title>Counter/)
  })

})
