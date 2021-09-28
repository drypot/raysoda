import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from '../user/user-login-api.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { loginForTest, User1Login } from '../user/user-login-api-fixture.js'
import { DrypotFileManager } from '../../file/drypot-fileman.js'
import { identify } from '../../file/magick/magick2.js'
import { IMAGE_TYPE } from '../../_error/error-image.js'

describe('Image Upload Api with Drypot FileManager', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/drypot-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)

    ifm = DrypotFileManager.from(config)

    web = await Express2.from(config).useUpload().start()
    registerUserLoginApi(web, udb)
    registerImageUploadApi(web, udb, idb, ifm)
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

  describe('upload image', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('upload fails if jpeg', async () => {
      const res = await request.post('/api/image').attach('file', 'sample/640x360.jpg').expect(200)
      expect(res.body.err).toContain(IMAGE_TYPE)
    })
    it('upload svg-sample.svg', async () => {
      const res = await request.post('/api/image').field('comment', 'c1')
        .attach('file', 'sample/svg-sample.svg').expect(200)
      expect(res.body.id).toBe(1)
    })
    it('check db', async () => {
      const r = await idb.findImage(1)
      if (!r) throw new Error()
      expect(r.uid).toBe(1)
      expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
      expect(r.comment).toBe('c1')
    })
    it('check file', async () => {
      const meta = await identify(ifm.getPathFor(1))
      expect(meta.format).toBe('svg')
    })
  })

})


