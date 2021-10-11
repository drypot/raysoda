import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../../db/image/image-db'
import { registerImageUploadPage } from './image-upload-page'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

describe('ImageUploadPage', () => {

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
    registerImageUploadPage(web, idb)
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
    await sat.get('/image-upload').expect(302).expect('Location', '/login')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('succeeds', async () => {
    await sat.get('/image-upload').expect(200)
  })

})


