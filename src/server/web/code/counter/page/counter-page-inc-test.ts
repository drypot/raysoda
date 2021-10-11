import { Config } from '../../../../_type/config'
import supertest, { SuperAgentTest } from 'supertest'
import { newDateStringNoTime } from '../../../../_util/date2'
import { loadConfigSync } from '../../../../_util/config-loader'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { CounterDB } from '../../../../db/counter/counter-db'
import { Express2 } from '../../../_express/express2'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix'
import { UserDB } from '../../../../db/user/user-db'
import { DB } from '../../../../db/_db/db'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { dupe } from '../../../../_util/object2'
import { registerCounterPage } from './counter-page'

describe('CounterPage Inc', () => {

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
