import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, USER1, USER1_LOGIN_FORM, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { useUserDetailApi } from '@server/domain/user/api/user-detail-api'
import { UserDB } from '@server/db/user/user-db'
import { unpackUserDetail } from '@common/type/user-detail'
import { dateNull } from '@common/type/date-const'

describe('UserDetailApi', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserDetailApi()
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
  it('get user by guest', async () => {
    const res = await sat.get('/api/user/1').expect(200)
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
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })

  let adate: Date

  it('get adate', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    adate = user.adate
  })
  it('get user1 by user1', async () => {
    const res = await sat.get('/api/user/1').expect(200)
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
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('get user1 by admin', async () => {
    const res = await sat.get('/api/user/1').expect(200)
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

})
