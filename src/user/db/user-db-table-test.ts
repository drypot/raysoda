import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../lib/db/db.js'
import { UserDB } from './user-db.js'

describe('UserDB', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('createTable', () => {
    it('drop table', async () => {
      await udb.dropTable()
    })
    it('create table', async () => {
      await udb.createTable(true) // 인덱스까지 만들어 본다
    })
    it('table exists', async () => {
      const r = await db.findTable('user')
      expect(r.length).toBe(1)
    })
    it('drop table', async () => {
      await udb.dropTable()
    })
    it('table not exists', async () => {
      const r = await db.findTable('user')
      expect(r.length).toBe(0)
    })
  })

})
