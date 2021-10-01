import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { Config } from '../../_type/config.js'

describe('UserDB', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('table', () => {
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

})
