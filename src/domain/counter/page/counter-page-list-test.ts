import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { CounterDB, getCounterDB } from '../../../db/counter/counter-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useCounterPage } from './counter-page.js'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'

describe('CounterPage List', () => {

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

  it('fails if anonymous', async () => {
    await agent.get('/counter-list').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('fails if user', async () => {
    await agent.get('/counter-list').expect(302).expect('Location', '/user-login')
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('works', async () => {
    await agent.get('/counter-list').expect(200).expect(/<title>Counter/)
  })

})
