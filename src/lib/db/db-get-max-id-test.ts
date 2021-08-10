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

  describe('getMaxId', () => {
    beforeEach(async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('should work', async () => {
      const values = [[1], [2], [3]]
      await db.query('insert into table1 values ?', [values])
      const maxId = await db.getMaxId('table1')
      expect(maxId).toBe(3)
    })
    it('should work when table empty', async () => {
      const maxId = await db.getMaxId('table1')
      expect(maxId).toBe(0)
    })
    it('should fail when table is not exist', async () => {
      await expectAsync(db.getMaxId('table2')).toBeRejected()
    })
  })

})
