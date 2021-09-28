import { Config, configFrom } from '../../_config/config.js'
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

  describe('createIndexIfNotExists', () => {
    it('init table', async () => {
      await db.query('drop table if exists user1')
      await db.query('create table user1(id int, email varchar(64), primary key (id))')
    })
    it('find index returns nothing', async () => {
      expect(await db.findIndex('user1', 'email')).toBeUndefined()
    })
    it('create index', async () => {
      await db.createIndexIfNotExists('create index email on user1(email)')
    })
    it('find index returns table', async () => {
      expect(await db.findIndex('user1', 'email')).toBeDefined()
    })
    it('create index again does not throw', async () => {
      await db.createIndexIfNotExists('create index email on user1(email)')
    })
  })

})
