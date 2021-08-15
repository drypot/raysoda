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

  describe('insertObjects', () => {
    it('after table init', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int, name varchar(64))')
    })
    it('insertObjects should work', async () => {
      const objs = [
        { id: 1, name: 'user1' },
        { id: 2, name: 'user2' },
        { id: 3, name: 'user3' },
      ]
      await db.insertObjects('table1', objs)
    })
    it('can be checked', async () => {
      const r = await db.query('select * from table1 order by id')
      expect(r.length).toBe(3)
      expect(r[0].id).toBe(1)
      expect(r[0].name).toBe('user1')
      expect(r[1].id).toBe(2)
      expect(r[1].name).toBe('user2')
      expect(r[2].id).toBe(3)
      expect(r[2].name).toBe('user3')
    })
    it('after table init', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int, name varchar(64))')
    })
    it('insertObjects should stop at invalid data', async () => {
      const objs = [
        { id: 1, name: 'user1' },
        { id: 2, email: 'user2' },
        { id: 3, name: 'user3' },
      ]
      await expectAsync(db.insertObjects('table1', objs)).toBeRejected()
    })
    it('can be checked', async () => {
      const r = await db.query('select * from table1 order by id')
      expect(r.length).toBe(1)
      expect(r[0].id).toBe(1)
      expect(r[0].name).toBe('user1')
    })
  })

})
