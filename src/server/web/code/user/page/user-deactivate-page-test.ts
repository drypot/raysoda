import { UserDB } from '../../../../db/user/user-db'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { useUserDeactivatePage } from './user-deactivate-page'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../../oman/oman'

describe('UserDeactivatePage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserDeactivatePage()
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
    await insertUserFix4(udb)
  })
  it('deactivate', async () => {
    await loginForTest(sat, USER1_LOGIN)
    await sat.get('/user-deactivate').expect(200).expect(/<title>Deactivate/)
  })

})
