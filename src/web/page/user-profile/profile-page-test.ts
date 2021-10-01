import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { registerUserProfilePage } from './profile-page.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'
import { userOf } from '../../../_type/user.js'

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
    config = readConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
    idb = ImageDB.from(db)

    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).start()
    registerUserProfilePage(web, uc, idb, ifm)
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
    const user5 = userOf({ id: 5, name: 'xman/yman', home: 'xman/yman', email: 'xmanyman@mail.test' })
    udb.insertUser(user5)
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
    it('/user/xman/yman encoded', async () => {
      const res = await request.get('/user/' + encodeURIComponent('xman/yman')).expect(200)
      // ...
    })
  })

})

