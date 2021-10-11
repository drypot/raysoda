import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { CounterDB } from '../../../../db/counter/counter-db'
import { registerCounterApi } from './counter-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../../_type/error-user'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

describe('Counter List Api', () => {

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
    registerCounterApi(web, cdb)
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

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('insert fix', async () => {
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 17), 10)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 18), 20)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 19), 30)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 20), 40)
    await cdb.replaceCounter('cnt2', new Date(2003, 0, 17), 10)
    await cdb.replaceCounter('cnt2', new Date(2003, 0, 18), 20)
  })
  const url1 = '/api/counter/cnt1?b=2003-01-18&e=2003-01-20'
  it('get fails if anonymous', async () => {
    const res = await sat.get(url1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get fails if user', async () => {
    const res = await sat.get(url1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get counter', async () => {
    const res = await sat.get(url1).expect(200)
    expect(res.body.counterList).toEqual([
      { id: 'cnt1', d: '2003-01-18', c: 20 },
      { id: 'cnt1', d: '2003-01-19', c: 30 },
      { id: 'cnt1', d: '2003-01-20', c: 40 },
    ])
  })

})
