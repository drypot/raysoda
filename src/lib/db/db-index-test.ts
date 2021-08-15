import { Config, configFrom } from '../../app/config/config.js'
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
    it('after table init', async () => {
      await db.query('drop table if exists user1')
      await db.query('create table user1(id int, email varchar(64), primary key (id))')
    })
    it('there is no index', async () => {
      const r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(0)
    })
    it('after create index', async () => {
      await db.query('create index email on user1(email)')
    })
    it('index should exist', async () => {
      const r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(1)
    })
  })

  describe('createIndexIfNotExists', () => {
    it('after table init', async () => {
      await db.query('drop table if exists user1')
      await db.query('create table user1(id int, email varchar(64), primary key (id))')
    })
    it('there is no index', async () => {
      const r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(0)
    })
    it('createIndexIfNotExists should work', async () => {
      await db.createIndexIfNotExists('create index email on user1(email)')
    })
    it('index should exist', async () => {
      const r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(1)
    })
    it('can not create same index again', async () => {
      await expectAsync(db.query('create index email on user1(email)')).toBeRejected()
    })
    it('buf createIndexIfNotExists should ok', async () => {
      await db.createIndexIfNotExists('create index email on user1(email)')
    })
  })

})
