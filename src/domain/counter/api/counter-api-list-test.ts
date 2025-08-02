import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { CounterDB, getCounterDB } from '../../../db/counter/counter-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useCounterApi } from './counter-api.js'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../common/type/error-const.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'

describe('Counter List Api', () => {

  let udb: UserDB
  let cdb: CounterDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    cdb = await getCounterDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useCounterApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
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
  const url1 = '/api/counter-list/cnt1?b=2003-01-18&e=2003-01-20'
  it('get fails if anonymous', async () => {
    const res = await agent.get(url1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('get fails if user', async () => {
    const res = await agent.get(url1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('get counter', async () => {
    const res = await agent.get(url1).expect(200)
    expect(res.body.counterList).toEqual([
      { id: 'cnt1', d: '2003-01-18', c: 20 },
      { id: 'cnt1', d: '2003-01-19', c: 30 },
      { id: 'cnt1', d: '2003-01-20', c: 40 },
    ])
  })

})
