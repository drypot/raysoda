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

  describe('insertObjects', () => {
    beforeEach(async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int, name varchar(64))')
    })
    it('should work', async () => {
      const objs = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Jon' },
        { id: 3, name: 'Will' },
      ]
      await db.insertObjects('table1', objs)
      const r = await db.query('select * from table1 order by id')
      expect(r.length).toBe(3)
      expect(r[0].id).toBe(1)
      expect(r[0].name).toBe('Alice')
      expect(r[1].id).toBe(2)
      expect(r[1].name).toBe('Jon')
      expect(r[2].id).toBe(3)
      expect(r[2].name).toBe('Will')
    })
    it('should stop at invalid object', async () => {
      const objs = [
        { id: 1, name: 'Alice' },
        { id: 2, email: 'Jon' },
        { id: 3, name: 'Will' },
      ]
      await expectAsync(db.insertObjects('table1', objs)).toBeRejected()
      const r = await db.query('select * from table1 order by id')
      expect(r.length).toBe(1)
      expect(r[0].id).toBe(1)
      expect(r[0].name).toBe('Alice')
    })
  })

})
