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

  describe('getMaxId', () => {
    it('after init table', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('getMaxId should return 0', async () => {
      const maxId = await db.getMaxId('table1')
      expect(maxId).toBe(0)
    })
    it('after table filled', async () => {
      const values = [[3], [5], [7]]
      await db.query('insert into table1 values ?', [values])
    })
    it('getMaxId should return max value', async () => {
      const maxId = await db.getMaxId('table1')
      expect(maxId).toBe(7)
    })
    it('getMaxId should fail with invalid table', async () => {
      await expectAsync(db.getMaxId('table2')).toBeRejected()
    })
  })

})
