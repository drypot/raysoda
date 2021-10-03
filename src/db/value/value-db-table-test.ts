import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ValueDB } from './value-db.js'
import { Config } from '../../_type/config.js'

describe('ValueDB Table', () => {

  let config: Config
  let db: DB
  let vdb: ValueDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    vdb = ValueDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('persist')).toBeDefined()
  })
  it('drop table', async () => {
    await vdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.findTable('persist')).toBeUndefined()
  })

})
