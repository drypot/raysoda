import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { UserDB } from '@server/db/user/user-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useUserListPage } from '@server/domain/user/page/user-list-page'

describe('UserListPage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useUserListPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('user list', async () => {
    await sat.get('/user-list').expect(200).expect(/<title>User List/)
  })

})
