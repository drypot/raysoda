import supertest, { SuperAgentTest } from 'supertest'
import { dateToStringNoTime } from '@common/util/date2'
import { useCounterPage } from '@server/domain/counter/page/counter-page'
import { dupe } from '@common/util/object2'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { CounterDB } from '@server/db/counter/counter-db'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'

describe('CounterPage Inc', () => {

  let udb: UserDB
  let cdb: CounterDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    cdb = await getObject('CounterDB') as CounterDB
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useCounterPage()
    await web.start()
    sat = supertest.agent(web.server)
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
  it('inc 1', async () => {
    await sat.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = dateToStringNoTime(new Date())
    const r = await cdb.getCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 1 })
  })
  it('inc 2', async () => {
    await sat.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = dateToStringNoTime(new Date())
    const r = await cdb.getCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 2 })
  })

})
