import { getUserDB, UserDB } from '../../db/user/user-db.ts'
import { BannerDB, getBannerDB } from '../../db/banner/banner-db.ts'
import { Express2, getExpress2 } from '../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { useUserAuthApi } from '../user/api/user-auth-api.ts'
import { useBannerApi } from '../banner/api/banner-api.ts'
import { useSpaInitApi } from './spa-init-api.ts'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../db/user/fixture/user-fix.ts'
import { userLoginForTest, userLogoutForTest } from '../user/api/user-auth-api-fixture.ts'

describe('SpaInitScript', () => {

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
    await useSpaInitApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
    await bdb.dropTable()
    await bdb.createTable()
    await bdb.loadCache()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('get session script', async () => {
    const res = await agent.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('text/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":-1,"name":"","home":"","admin":false}
const _banner = []
`
    )
  })
  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('get session script with login', async () => {
    const res = await agent.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('text/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":1,"name":"name1","home":"home1","admin":false}
const _banner = []
`
    )
  })
  it('logout', async () => {
    await userLogoutForTest(agent)
  })
  it('set banner', async () => {
    await bdb.updateBannerList([{ text: 'text1', url: 'url1' }])
  })
  it('get session script with banner', async () => {
    const res = await agent.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('text/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":-1,"name":"","home":"","admin":false}
const _banner = [{"text":"text1","url":"url1"}]
`
    )
  })

})
