import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { useCounterPage } from '@server/domain/counter/page/counter-page'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { CounterDB } from '@server/db/counter/counter-db'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'

describe('CounterPage List', () => {

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

  it('fails if anonymous', async () => {
    await sat.get('/counter-list').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('fails if user', async () => {
    await sat.get('/counter-list').expect(302).expect('Location', '/user-login')
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('works', async () => {
    await sat.get('/counter-list').expect(200).expect(/<title>Counter/)
  })

})
