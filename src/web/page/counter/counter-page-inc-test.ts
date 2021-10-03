import { Config } from '../../../_type/config.js'
import { SuperAgentTest } from 'supertest'
import { newDateStringNoTime } from '../../../_util/date2.js'
import { loadConfigSync } from '../../../_util/config-loader.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { Express2 } from '../../_express/express2.js'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.js'
import { UserDB } from '../../../db/user/user-db.js'
import { DB } from '../../../db/_db/db.js'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { dupe } from '../../../_util/object2.js'
import { registerCounterPage } from './counter-page.js'

describe('Counter Page Inc', () => {
  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let cdb: CounterDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    cdb = CounterDB.from(db)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerCounterPage(web, cdb)
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

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('inc 1', async () => {
    await request.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = newDateStringNoTime(new Date())
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 1 })
  })
  it('inc 2', async () => {
    await request.get('/counter-inc/abc?r=http://hello.world')
      .expect(302).expect('Location', 'http://hello.world')
  })
  it('check db 2', async () => {
    const d = newDateStringNoTime(new Date())
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 2 })
  })
})
