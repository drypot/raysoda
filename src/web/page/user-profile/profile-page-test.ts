import { configFrom } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { registerUserXPage } from './profile-page.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('UserX Page', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
    idb = ImageDB.from(db)

    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).start()
    registerUserXPage(web, uc, idb, ifm)
    request = web.spawnRequest()
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

  describe('userx view', () => {
    it('/user-id/4', async () => {
      const res = await request.get('/user-id/4').expect(200)
      // ...
    })
    it('/user/user1', async () => {
      const res = await request.get('/user/user1').expect(200)
      // ...
    })
    it('/user/USER1', async () => {
      const res = await request.get('/user/USER1').expect(200)
      // ...
    })
    it('/user/xman', async () => {
      const res = await request.get('/user/xman').expect(404)
      // ...
    })
    it('/user1', async () => {
      const res = await request.get('/user1').expect(301).expect('Location', '/user/user1')
      // ...
    })
    it('/USER1', async () => {
      const res = await request.get('/USER1').expect(301).expect('Location', '/user/USER1')
      // ...
    })
    it('/xman', async () => {
      const res = await request.get('/xman').expect(301).expect('Location', '/user/xman')
      // ...
    })
  })

})

