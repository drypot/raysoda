import { loadConfigSync } from '../../_util/config-loader.js'
import { CounterDB } from './counter-db.js'
import { DB } from '../_db/db.js'
import { Config } from '../../_type/config.js'

describe('CounterDB Table', () => {

  let config: Config
  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    cdb = CounterDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('counter')).toBeDefined()
  })
  it('drop table', async () => {
    await cdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.findTable('counter')).toBeUndefined()
  })

})
