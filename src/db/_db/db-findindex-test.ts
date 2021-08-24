import { Config, configFrom } from '../../config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('findIndex', () => {
    it('int table', async () => {
      await db.query('drop table if exists user1')
      await db.query('create table user1(id int, email varchar(64), primary key (id))')
    })
    it('findIndex returns nothing', async () => {
      expect(await db.indexExists('user1', 'email')).toBe(false)
    })
    it('create index', async () => {
      await db.query('create index email on user1(email)')
    })
    it('findIndex returns indexes', async () => {
      expect(await db.indexExists('user1', 'email')).toBe(true)
    })
  })

})
