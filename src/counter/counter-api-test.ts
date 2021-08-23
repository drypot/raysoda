import { Config, configFrom } from '../config/config.js'
import { DB } from '../db/db.js'
import { UserDB } from '../user/db/user-db.js'
import { Express2 } from '../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/case/login/user-login-api.js'
import { insertUserFix4 } from '../user/db/user-db-fixture.js'
import { CounterDB } from './counter-db.js'
import { registerCounterApi } from './counter-api.js'
import { dateStringFrom } from '../lib/base/date2.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../user/case/register-form/user-form.js'
import { AdminLogin, loginForTest, User1Login } from '../user/case/login/user-login-api-fixture.js'

describe('Counter Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let cdb: CounterDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    cdb = CounterDB.from(db)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    registerCounterApi(web, cdb)
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

  describe('counter update', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('update', async () => {
      await request.get('/api/counter/abc/inc?r=http://hello.world')
        .expect(302).expect('Location', 'http://hello.world')
    })
    it('check db', async () => {
      const ds = dateStringFrom(new Date())
      const r = await cdb.find('abc', ds)
      expect(r).toEqual(1)
    })
    it('update', async () => {
      await request.get('/api/counter/abc/inc?r=http://hello.world')
        .expect(302).expect('Location', 'http://hello.world')
    })
    it('check db', async () => {
      const ds = dateStringFrom(new Date())
      const r = await cdb.find('abc', ds)
      expect(r).toEqual(2)
    })
  })

  describe('counter lookup', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('insert fix', async () => {
      await cdb.insert('cnt1', new Date(2003, 0, 17), 10)
      await cdb.insert('cnt1', new Date(2003, 0, 18), 20)
      await cdb.insert('cnt1', new Date(2003, 0, 19), 30)
      await cdb.insert('cnt1', new Date(2003, 0, 20), 40)
      await cdb.insert('cnt2', new Date(2003, 0, 17), 10)
      await cdb.insert('cnt2', new Date(2003, 0, 18), 20)
    })
    const url1 = '/api/counter/cnt1?b=2003-01-18&e=2003-01-20'
    it('get fails if anonymous', async () => {
      const res = await request.get(url1).expect(200)
      expect(res.body.err).toEqual(NOT_AUTHENTICATED)
    })
    it('login as user', async () => {
      await loginForTest(request, User1Login)
    })
    it('get fails if user', async () => {
      const res = await request.get(url1).expect(200)
      expect(res.body.err).toEqual(NOT_AUTHORIZED)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('get counter', async () => {
      const res = await request.get(url1).expect(200)
      expect(res.body.counter).toEqual([
        { d: '2003-01-18', c: 20 },
        { d: '2003-01-19', c: 30 },
        { d: '2003-01-20', c: 40 },
      ])
    })
  })

})
