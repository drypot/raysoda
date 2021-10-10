import { loadConfigSync } from '../../../../_util/config-loader.js'
import { DB } from '../../../../db/_db/db.js'
import { UserDB } from '../../../../db/user/user-db.js'
import { Express2 } from '../../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../../db/user/fixture/user-fix.js'
import { ImageDB } from '../../../../db/image/image-db.js'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api.js'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture.js'
import { registerImageUpdatePage } from './image-update-page.js'
import { newImage } from '../../../../_type/image.js'
import { Config } from '../../../../_type/config.js'
import { UserCache } from '../../../../db/user/cache/user-cache.js'

describe('ImageUpdatePage', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)

    web = Express2.from(config)
    registerUserAuthApi(web, uc)
    registerImageUpdatePage(web, idb)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('fails if anonymous', async () => {
    await sat.get('/image-update/1').expect(302).expect('Location', '/login')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('fails if image not exist', async () => {
    const res = await sat.get('/image-update/1').expect(200).expect(/<title>Error/)
  })
  it('insert image', async () => {
    await idb.insertImage(newImage({ id: 1, uid: 1 }))
  })
  it('succeeds', async () => {
    const res = await sat.get('/image-update/1').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('fails if owner not match', async () => {
    const res = await sat.get('/image-update/1').expect(200).expect(/<title>Error/)
  })

})


