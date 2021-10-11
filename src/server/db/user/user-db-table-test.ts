import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../_db/db'
import { UserDB } from './user-db'
import { Config } from '../../_type/config'

describe('UserDB.*Table', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('drop table', async () => {
    await udb.dropTable()
  })
  it('create table', async () => {
    await udb.createTable(true) // 인덱스까지 만들어 본다
  })
  it('table exists', async () => {
    expect(await db.findTable('user')).toBeDefined()
  })
  it('drop table', async () => {
    await udb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('user')).toBeUndefined()
  })

})
