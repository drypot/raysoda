import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { useUserDeactivatePage } from '@server/domain/user/page/user-deactivate-page'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('UserDeactivatePage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useUserDeactivatePage()
    await web.start()
    sat = supertest.agent(web.server)
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
    await userLoginForTest(sat, USER1_LOGIN_FORM)
    await sat.get('/user-deactivate').expect(200).expect(/<title>Deactivate/)
  })
  it('deactivate-done', async () => {
    await sat.get('/user-deactivate-done').expect(200).expect(/<title>Deactivate/)
  })

})
