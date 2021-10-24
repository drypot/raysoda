import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { useCounterPage } from '@server/web/counter/page/counter-page'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { CounterDB } from '@server/db/counter/counter-db'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest } from '@server/web/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'

describe('CounterPage List', () => {

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
