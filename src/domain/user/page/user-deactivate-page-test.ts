import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from '../api/user-auth-api.ts'
import { useUserDeactivatePage } from './user-deactivate-page.ts'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from '../api/user-auth-api-fixture.ts'

describe('UserDeactivatePage', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserDeactivatePage()
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
  it('deactivate', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
    await agent.get('/user-deactivate').expect(200).expect(/<title>Deactivate/)
  })
  it('deactivate-done', async () => {
    await agent.get('/user-deactivate-done').expect(200).expect(/<title>Deactivate/)
  })

})
