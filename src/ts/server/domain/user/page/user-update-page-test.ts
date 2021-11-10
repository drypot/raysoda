import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, USER1_LOGIN_FORM, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserUpdatePage } from '@server/domain/user/page/user-update-page'

describe('UserUpdatePage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserUpdatePage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await userFixInsert4(udb)
  })
  it('login', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('update profile', async () => {
    await sat.get('/user-update-profile/1').expect(200).expect(/<title>Update Profile/)
  })
  it('update password', async () => {
    await sat.get('/user-update-password/1').expect(200).expect(/<title>Change Password/)
  })
  it('update done', async () => {
    await sat.get('/user-update-done/1').expect(200).expect(/<title>Update/)
  })
  it('update status redirected', async () => {
    await sat.get('/user-update-status/1').expect(302)
  })
  it('login admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('update status works', async () => {
    await sat.get('/user-update-status/1').expect(200).expect(/<title>Change Status/)
  })

})
