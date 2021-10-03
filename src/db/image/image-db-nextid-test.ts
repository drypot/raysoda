import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ImageDB } from './image-db.js'
import { Config } from '../../_type/config.js'

describe('ImageDB.*NextId', () => {

  let config: Config
  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    idb = ImageDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable(false)
  })
  it('get next image id', () => {
    expect(idb.getNextId()).toBe(1)
    expect(idb.getNextId()).toBe(2)
    expect(idb.getNextId()).toBe(3)
  })
  it('set next image id', () => {
    idb.setNextId(10)
  })
  it('get next image id', () => {
    expect(idb.getNextId()).toBe(10)
    expect(idb.getNextId()).toBe(11)
  })

})
