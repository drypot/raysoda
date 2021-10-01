import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { registerImageDetailApi } from './image-detail-api.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Image Detail Api', () => {

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

    web = await Express2.from(config).useUpload().start()
    registerImageDetailApi(web, uc, idb, ifm)
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

  describe('first image cdate', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('remove image dir', async () => {
      await ifm.rmRoot()
    })
    it('returns nothing', async () => {
      const res = await request.get('/api/image-first-image-cdate').expect(200)
      expect(Date.now() - res.body.today).toBeLessThan(1000)
      expect(res.body.cdate).toBeUndefined()
    })
    it('insert fix', async () => {
      const list = [
        [1, 2, new Date(2003, 0, 1), '1'],
        [2, 2, new Date(2003, 1, 2), '2'],
        [3, 2, new Date(2003, 2, 3), '3'],
        [4, 2, new Date(2003, 3, 4), '4'],
        [5, 2, new Date(2003, 4, 5), '5'],
        [6, 1, new Date(2003, 5, 6), '6'],
        [7, 1, new Date(2003, 6, 7), '7'],
        [8, 1, new Date(2003, 7, 8), '8'],
        [9, 1, new Date(2003, 8, 9), '9'],
        [10, 1, new Date(2003, 9, 10), '10'],
      ]
      await db.query('insert into image(id, uid, cdate, comment) values ?', [list])
    })
    it('returns cdate', async () => {
      const res = await request.get('/api/image-first-image-cdate').expect(200)
      expect(Date.now() - res.body.today).toBeLessThan(1000)
      expect(new Date(res.body.cdate)).toEqual(new Date(2003, 0, 1))
    })
  })

})
