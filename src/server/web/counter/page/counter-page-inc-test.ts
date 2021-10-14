import supertest, { SuperAgentTest } from 'supertest'
import { newDateStringNoTime } from '../../../_util/date2'
import { CounterDB } from '../../../db/counter/counter-db'
import { Express2 } from '../../_express/express2'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix'
import { UserDB } from '../../../db/user/user-db'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { dupe } from '../../../_util/object2'
import { useCounterPage } from './counter-page'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'

describe('CounterPage Inc', () => {

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
    await useCounterPage()
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
  it('inc 1', async () => {
    await sat.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = newDateStringNoTime(new Date())
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 1 })
  })
  it('inc 2', async () => {
    await sat.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = newDateStringNoTime(new Date())
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 2 })
  })

})
