import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { ImageDB } from '../../db/image/image-db.js'
import { registerUserXApi } from './userx-view.js'
import { ImageFileManager } from '../../file/fileman.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'

describe('UserX View', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)

    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).start()
    registerUserXApi(web, udb, idb, ifm)
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
    it('/user/4', async () => {
      const res = await request.get('/user/4').expect(200)
      // ...
    })
    it('/user1', async () => {
      const res = await request.get('/user1').expect(200)
      // ...
    })
    it('/USER1', async () => {
      const res = await request.get('/USER1').expect(200)
      // ...
    })
    it('/xman', async () => {
      const res = await request.get('/xman').expect(404)
      // ...
    })
  })

})

