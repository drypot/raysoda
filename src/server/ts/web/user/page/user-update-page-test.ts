import { useUserAuthApi } from '@server/web/user-auth/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix1, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { loginForTest } from '@server/web/user-auth/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserUpdatePage } from '@server/web/user/page/user-update-page'

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
    await insertUserFix1(udb)
  })
  it('login', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('user-update 1', async () => {
    await sat.get('/user-update/1').expect(200).expect(/<title>Update/)
  })

})
