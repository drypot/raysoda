import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from '../api/user-auth-api.js'
import { useUserDeactivatePage } from './user-deactivate-page.js'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../api/user-auth-api-fixture.js'

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
