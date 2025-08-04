import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { CounterDB, getCounterDB } from '../../../db/counter/counter-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from '../../user/api/user-auth-api.ts'
import { useCounterPage } from './counter-page.ts'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.ts'
import { dateToStringNoTime } from '../../../common/util/date2.ts'
import { dupe } from '../../../common/util/object2.ts'

describe('CounterPage Inc', () => {

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
    await useCounterPage()
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
  it('inc 1', async () => {
    await agent.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = dateToStringNoTime(new Date())
    const r = await cdb.getCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 1 })
  })
  it('inc 2', async () => {
    await agent.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = dateToStringNoTime(new Date())
    const r = await cdb.getCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 2 })
  })

})
