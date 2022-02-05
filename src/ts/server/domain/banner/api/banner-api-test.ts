import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { useBannerApi } from '@server/domain/banner/api/banner-api'
import { NOT_AUTHORIZED } from '@common/type/error-const'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest, userLogoutForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { BannerDB } from '@server/db/banner/banner-db'
import { UserDB } from '@server/db/user/user-db'

describe('Banner Api', () => {

  let udb: UserDB
  let bdb: BannerDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    bdb = await getObject('BannerDB') as BannerDB
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useBannerApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
    await bdb.loadCache()
  })
  it('get empty banner list', async () => {
    const res = await sat.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([])
  })
  it('login as user', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('set banner fails', async () => {
    const form = { banner: [] }
    const res = await sat.put('/api/banner-update').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('set banner list', async () => {
    const form = {
      bannerList: [
        { text: 'text1', url: 'url1' },
        { text: 'text2', url: 'url2' },
        { text: 'text3', url: 'url3' },
      ]
    }
    const res = await sat.put('/api/banner-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('logout', async () => {
    await userLogoutForTest(sat)
  })
  it('get filled banner', async () => {
    const res = await sat.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' },
      { text: 'text3', url: 'url3' },
    ])
  })

})
