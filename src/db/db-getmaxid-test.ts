import { Config, configFrom } from '../config/config.js'
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

  describe('getMaxId', () => {
    it('init table', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('getMaxId returns 0', async () => {
      const maxId = await db.getMaxId('table1')
      expect(maxId).toBe(0)
    })
    it('fill table', async () => {
      const values = [[3], [5], [7]]
      await db.query('insert into table1 values ?', [values])
    })
    it('getMaxId returns max value', async () => {
      const maxId = await db.getMaxId('table1')
      expect(maxId).toBe(7)
    })
    it('getMaxId fails if table invalid', async () => {
      await expectAsync(db.getMaxId('table2')).toBeRejected()
    })
  })

})
