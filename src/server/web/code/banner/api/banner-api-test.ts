import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ValueDB } from '../../../../db/value/value-db'
import { BannerDB } from '../../../../db/banner/banner-db'
import { useBannerApi } from './banner-api'
import { loginForTest, logoutForTest } from '../../user-auth/api/user-auth-api-fixture'
import { NOT_AUTHORIZED } from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../../oman/oman'

describe('Banner Api', () => {

  let udb: UserDB
  let vdb: ValueDB
  let bdb: BannerDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    vdb = await omanGetObject('ValueDB') as ValueDB
    bdb = await omanGetObject('BannerDB') as BannerDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useBannerApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
    await bdb.loadCache()
  })
  it('get banner empty', async () => {
    const res = await sat.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([])
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('set banner fails', async () => {
    const form = {
      banner: []
    }
    const res = await sat.put('/api/banner-update').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('set banner', async () => {
    const form = {
      banner: [
        { text: 'text1', url: 'url1' },
        { text: 'text2', url: 'url2' },
        { text: 'text3', url: 'url3' },
      ]
    }
    const res = await sat.put('/api/banner-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('get banner filled', async () => {
    const res = await sat.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' },
      { text: 'text3', url: 'url3' },
    ])
  })

})


