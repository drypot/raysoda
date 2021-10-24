import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { CounterDB } from '@server/db/counter/counter-db'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest } from '@server/web/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { useCounterApi } from '@server/web/counter/api/counter-api'

describe('Counter List Api', () => {

  let udb: UserDB
  let cdb: CounterDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    cdb = await omanGetObject('CounterDB') as CounterDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useCounterApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
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
