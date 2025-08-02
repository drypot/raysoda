import supertest from 'supertest'
import { Express2, getExpress2 } from '../../../express/express2.js'
import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { BannerDB, getBannerDB } from '../../../db/banner/banner-db.js'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useBannerApi } from './banner-api.js'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest, userLogoutForTest } from '../../user/api/user-auth-api-fixture.js'
import { NOT_AUTHORIZED } from '../../../common/type/error-const.js'

describe('Banner Api', () => {

  let udb: UserDB
  let bdb: BannerDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    bdb = await getBannerDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useBannerApi()
    await express2.start()
    agent = supertest.agent(express2.server)
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
    const res = await agent.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([])
  })
  it('login as user', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('set banner fails', async () => {
    const form = { banner: [] }
    const res = await agent.put('/api/banner-update').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('set banner list', async () => {
    const form = {
      bannerList: [
        { text: 'text1', url: 'url1' },
        { text: 'text2', url: 'url2' },
        { text: 'text3', url: 'url3' },
      ]
    }
    const res = await agent.put('/api/banner-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('logout', async () => {
    await userLogoutForTest(agent)
  })
  it('get filled banner', async () => {
    const res = await agent.get('/api/banner-list').expect(200)
    expect(res.body.bannerList).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' },
      { text: 'text3', url: 'url3' },
    ])
  })

})
