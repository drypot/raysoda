import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/fileman'
import { registerImageUploadApi } from './image-upload-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { registerImageDeleteApi } from './image-delete-api'
import { existsSync } from 'fs'
import { OsokyFileManager } from '../../../../file/osoky-fileman'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

describe('ImageDeleteApi Osoky', () => {
  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/osoky-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = OsokyFileManager.from(config)

    web = Express2.from(config).useUpload()
    registerUserAuthApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageDeleteApi(web, idb, ifm)
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

  describe('update image', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('login as user1', async () => {
      await loginForTest(sat, USER1_LOGIN)
    })
    it('upload 1', async () => {
      const res = await sat.post('/api/image-upload').field('comment', 'c')
        .attach('file', 'sample/1280x720.jpg').expect(200)
      expect(res.body.id).toEqual(1)
    })
    it('check file 1', async () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('delete 1', async () => {
      const res = await sat.delete('/api/image-delete/1').expect(200)
      expect(res.body.err).toBeUndefined()
    })
    it('check file 1 after delete', async () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
  })

})
