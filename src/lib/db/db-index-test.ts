import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    await db.createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('findIndex', () => {
    it('should work', async () => {
      let r: any
      await db.query('drop table if exists user1')
      await db.query('create table user1(id int, email varchar(64), primary key (id))')

      r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(0)

      await db.query('create index email on user1(email)')
      r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(1)

      await expectAsync(db.query('create index email on user1(email)')).toBeRejected()
    })
  })

  describe('createIndexIfNotExists', () => {
    it('should work', async () => {
      let r: any
      await db.query('drop table if exists user1')
      await db.query('create table user1(id int, email varchar(64), primary key (id))')

      r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(0)

      await db.createIndexIfNotExists('create index email on user1(email)')
      r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(1)

      await db.createIndexIfNotExists('create index email on user1(email)')
      r = await db.findIndex('user1', 'email')
      expect(r.length).toBe(1)
    })
  })

})
