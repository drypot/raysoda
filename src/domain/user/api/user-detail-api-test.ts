import supertest from 'supertest'
import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { useUserDetailApi } from './user-detail-api.ts'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { unpackUserDetail } from '../../../common/type/user-detail.ts'
import { dateNull } from '../../../common/type/date-const.ts'
import { userLoginForTest } from './user-auth-api-fixture.ts'

describe('UserDetailApi', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserDetailApi()
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
  it('get user by guest', async () => {
    const res = await agent.get('/api/user/1').expect(200)
    unpackUserDetail(res.body.user)
    expect(res.body.user).toEqual({
      id: 1,
      name: USER1.name,
      home: USER1.home,
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: dateNull,
      pdate: USER1.pdate,
      cdateNum: USER1.cdate.getTime(),
      adateNum: dateNull.getTime(),
      pdateNum: USER1.pdate.getTime(),
    })
  })
  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })

  let adate: Date

  it('get adate', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    adate = user.adate
  })
  it('get user1 by user1', async () => {
    const res = await agent.get('/api/user/1').expect(200)
    unpackUserDetail(res.body.user)
    expect(res.body.user).toEqual({
      id: 1,
      name: USER1.name,
      home: USER1.home,
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: adate,
      pdate: USER1.pdate,
      cdateNum: USER1.cdate.getTime(),
      adateNum: adate.getTime(),
      pdateNum: USER1.pdate.getTime(),
    })
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('get user1 by admin', async () => {
    const res = await agent.get('/api/user/1').expect(200)
    unpackUserDetail(res.body.user)
    expect(res.body).toEqual({
      user: {
        id: 1,
        name: USER1.name,
        home: USER1.home,
        status: 'v',
        admin: false,
        profile: '',
        cdate: USER1.cdate,
        adate: adate,
        pdate: USER1.pdate,
        cdateNum: USER1.cdate.getTime(),
        adateNum: adate.getTime(),
        pdateNum: USER1.pdate.getTime(),
      }
    })
  })

  it('get user 0', async () => {
    const res = await agent.get('/api/user/0').expect(200)
    expect(res.body.user).toBeUndefined()
  })
  it('get user xxx', async () => {
    const res = await agent.get('/api/user/xxx').expect(200)
    expect(res.body.user).toBeUndefined()
  })
})
