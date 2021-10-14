import { UserDB } from '../../../db/user/user-db'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { useUserListPage } from './user-list-page'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'

describe('UserListPage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserListPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('user list', async () => {
    await sat.get('/user-list').expect(200).expect(/<title>User List/)
  })

})
