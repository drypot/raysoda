import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { useUserUpdateApi } from './user-update-api.ts'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../common/type/error-const.ts'
import { userLoginForTest } from './user-auth-api-fixture.ts'

describe('UserUpdateApi Get', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserUpdateApi()
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
  it('get user1 without login', async () => {
    const res = await agent.get('/api/user-update-profile-get/' + 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('get user1', async () => {
    const res = await agent.get('/api/user-update-profile-get/' + 1).expect(200)
    expect(res.body).toEqual({
      user: {
        id: 1,
        name: 'name1',
        home: 'home1',
        email: 'mail1@mail.test',
        profile: ''
      }
    })
  })
  it('get user2 by user1', async () => {
    const res = await agent.get('/api/user-update-profile-get/' + 2).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('get user2 by admin', async () => {
    const res = await agent.get('/api/user-update-profile-get/' + 2).expect(200)
    expect(res.body).toEqual({
      user: {
        id: 2,
        name: 'name2',
        home: 'home2',
        email: 'mail2@mail.test',
        profile: ''
      }
    })
  })

})
