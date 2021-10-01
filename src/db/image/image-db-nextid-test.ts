import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ImageDB } from './image-db.js'
import { Config } from '../../_type/config.js'

describe('ImageDB', () => {

  let config: Config
  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    idb = ImageDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('nextImageID', () => {
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('get next image id', () => {
      expect(idb.getNextImageId()).toBe(1)
      expect(idb.getNextImageId()).toBe(2)
      expect(idb.getNextImageId()).toBe(3)
    })
    it('set next image id', () => {
      idb.setNextImageId(10)
    })
    it('get next image id', () => {
      expect(idb.getNextImageId()).toBe(10)
      expect(idb.getNextImageId()).toBe(11)
    })
  })

})
