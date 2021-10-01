import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { Config } from '../../_type/config.js'

describe('UserDB.*NextId', () => {
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

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
  })
  it('get next user id', () => {
    expect(udb.getNextId()).toBe(1)
    expect(udb.getNextId()).toBe(2)
    expect(udb.getNextId()).toBe(3)
  })
  it('set next user id', () => {
    udb.setNextId(10)
  })
  it('get next user id', () => {
    expect(udb.getNextId()).toBe(10)
    expect(udb.getNextId()).toBe(11)
  })
})
