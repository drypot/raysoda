import { UserDB } from '../../../db/user/user-db'
import { ADMIN_LOGIN, insertUserFix4, USER1, USER1_LOGIN } from '../../../db/user/fixture/user-fix'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserDetailApi } from './user-detail-api'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { unpackUserDetail } from '../../../_type/user-detail'
import { dateNull } from '../../../_util/date2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'

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
    await insertUserFix4(udb)
  })
  it('get user by guest', async () => {
    const res = await sat.get('/api/user/1').expect(200)
    unpackUserDetail(res.body.user)
    expect(res.body.user).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
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
    await loginForTest(sat, USER1_LOGIN)
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
      name: 'User 1',
      home: 'user1',
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
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get user1 by admin', async () => {
    const res = await sat.get('/api/user/1').expect(200)
    unpackUserDetail(res.body.user)
    expect(res.body).toEqual({
      user: {
        id: 1,
        name: 'User 1',
        home: 'user1',
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
