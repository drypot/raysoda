import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from '../api/user-auth-api.js'
import { useUserUpdatePage } from './user-update-page.js'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../api/user-auth-api-fixture.js'

describe('UserUpdatePage', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserUpdatePage()
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
  it('update profile', async () => {
    await agent.get('/user-update-profile/1').expect(200).expect(/<title>Update Profile/)
  })
  it('update password', async () => {
    await agent.get('/user-update-password/1').expect(200).expect(/<title>Change Password/)
  })
  it('update done', async () => {
    await agent.get('/user-update-done/1').expect(200).expect(/<title>Update/)
  })
  it('update status redirected', async () => {
    await agent.get('/user-update-status/1').expect(302)
  })
  it('login admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('update status works', async () => {
    await agent.get('/user-update-status/1').expect(200).expect(/<title>Change Status/)
  })

})
