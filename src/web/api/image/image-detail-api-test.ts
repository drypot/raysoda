import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { registerLoginApi } from '../user-login/login-api.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { registerImageDetailApi } from './image-detail-api.js'
import { loginForTest, logoutForTest } from '../user-login/login-api-fixture.js'
import { newDateString } from '../../../_util/date2.js'
import { IMAGE_NOT_EXIST } from '../../../_type/error-image.js'
import { ImageView } from '../../../_type/image-view.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('Image Detail Api', () => {
  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)

    web = await Express2.from(config).useUpload().start()
    registerLoginApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageDetailApi(web, uc, idb, ifm)
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

  describe('view image', () => {
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
    it('upload image', async () => {
      const res = await sat.post('/api/image-upload')
        .field('comment', 'c1')
        .attach('file', 'sample/640x360.jpg')
        .expect(200)
      expect(res.body.id).toBe(1)
    })
    it('logout', async () => {
      await logoutForTest(sat)
    })
    it('get image fails if id invalid', async () => {
      const res = await sat.get('/api/image/2').expect(200)
      expect(res.body.err).toContain(IMAGE_NOT_EXIST)
    })
    it('get image', async () => {
      const res = await sat.get('/api/image/1').expect(200)
      const image = res.body.image as ImageView
      // image: {
      //   id: 1,
      //   owner: { id: 1, name: 'User 1', home: 'user1' },
      //   cdate: 1630675275332,
      //   cdateStr: '2021-09-03 22:21:15',
      //   vers: null,
      //   comment: 'c1',
      //   dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      //   thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      //   updatable: false
      // }
      expect(image.id).toBe(1)
      expect(image.owner).toEqual({ id: 1, name: 'User 1', home: 'user1' })
      expect(Date.now() - image.cdate).toBeLessThan(2000)
      expect(newDateString(new Date(image.cdate))).toBe(image.cdateStr)
      expect(image.vers).toBeNull()
      expect(image.comment).toBe('c1')
      expect(image.dirUrl).toBe(ifm.getDirUrlFor(1))
      expect(image.thumbUrl).toBe(ifm.getThumbUrlFor(1))
      expect(image.updatable).toBe(false)
    })
    it('login as user1', async () => {
      await loginForTest(sat, USER1_LOGIN)
    })
    it('image is updatable if user1', async () => {
      const res = await sat.get('/api/image/1').expect(200)
      expect(res.body.image.updatable).toBe(true)
    })
    it('login as user2', async () => {
      await loginForTest(sat, USER2_LOGIN)
    })
    it('image is not updatable if user2', async () => {
      const res = await sat.get('/api/image/1').expect(200)
      expect(res.body.image.updatable).toBe(false)
    })
    it('login as admin', async () => {
      await loginForTest(sat, ADMIN_LOGIN)
    })
    it('image is updatable if admin', async () => {
      const res = await sat.get('/api/image/1').expect(200)
      expect(res.body.image.updatable).toBe(true)
    })
  })

})
