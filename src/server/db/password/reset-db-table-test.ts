import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ResetDB } from './reset-db.js'
import { Config } from '../../_type/config.js'

describe('ResetDB Table', () => {

  let config: Config
  let db: DB
  let rdb: ResetDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    rdb = ResetDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('pwreset')).toBeUndefined()
  })
  it('create table', async () => {
    await rdb.createTable(true)
  })
  it('table exists', async () => {
    expect(await db.findTable('pwreset')).toBeDefined()
  })
  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('pwreset')).toBeUndefined()
  })

})
