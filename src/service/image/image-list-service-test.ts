import { configFrom } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { RaySodaFileManager } from '../../file/raysoda-fileman.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { imageListByCdateService, imageListByUserService, imageListService } from './image-list-service.js'
import { Config } from '../../_type/config.js'
import { UserCache } from '../../db/user/user-cache.js'

describe('Image List Service', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/raysoda-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)
  })

  afterAll(async () => {
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
    it('p 1, ps 128', async () => {
      const r = await imageListService(uc, idb, ifm, 1, 128)
      expect(r.length).toBe(10)
      expect(r[0].id).toBe(10)
      expect(r[1].id).toBe(9)
      expect(r[2].id).toBe(8)
      expect(r[9].id).toBe(1)
    })
    it('p 1, ps 4', async () => {
      const r = await imageListService(uc, idb, ifm, 1, 4)
      expect(r.length).toBe(4)
      expect(r[0].id).toBe(10)
      expect(r[3].id).toBe(7)
    })
    it('p 2, ps 4', async () => {
      const r = await imageListService(uc, idb, ifm, 2, 4)
      expect(r.length).toBe(4)
      expect(r[0].id).toBe(6)
      expect(r[3].id).toBe(3)
    })
    it('p 3, ps 4', async () => {
      const r = await imageListService(uc, idb, ifm, 3, 4)
      expect(r.length).toBe(2)
      expect(r[0].id).toBe(2)
      expect(r[1].id).toBe(1)
    })
    it('d 20030607, ps 4', async () => {
      const r = await imageListByCdateService(uc, idb, ifm, new Date('2003-6-7'), 1, 4)
        expect(r.length).toBe(4)
      expect(r[0].id).toBe(6)
      expect(r[3].id).toBe(3)
    })
    it('u 1', async () => {
      const r = await imageListByUserService(uc, idb, ifm, 1, 1, 128)
        expect(r.length).toBe(5)
      expect(r[0].id).toBe(10)
      expect(r[3].id).toBe(7)
    })
  })

})
