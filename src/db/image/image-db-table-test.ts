import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../_db/db.js'
import { ImageDB } from './image-db.js'

describe('ImageDB', () => {

  let config: Config
  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    idb = ImageDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('table', () => {
    it('drop table', async () => {
      await idb.dropTable()
    })
    it('create table', async () => {
      await idb.createTable(true)
    })
    it('table exists', async () => {
      expect(await db.findTable('image')).toBeDefined()
    })
    it('index exists', async () => {
      expect(await db.findIndex('image', 'image_cdate')).toBeDefined()
    })
    it('index exists 2', async () => {
      expect(await db.findIndex('image', 'image_uid_cdate')).toBeDefined()
    })
    it('drop table', async () => {
      await idb.dropTable()
    })
    it('table not exists', async () => {
      expect(await db.findTable('image')).toBeUndefined()
    })
  })

})
