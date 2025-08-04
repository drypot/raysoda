import supertest from 'supertest'
import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest, userLogoutForTest } from './user-auth-api-fixture.ts'
import { GUEST_ID_CARD } from '../../../common/type/user.ts'

describe('UserAuthApi Fixture', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })

  it('login', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('get login', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('logout', async () => {
    await userLogoutForTest(agent)
  })
  it('get login fails', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })

})
