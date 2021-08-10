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

  describe('runQueries', () => {
    beforeEach(async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('should work', async () => {
      const qa = [
        'insert into table1 values(1)',
        'insert into table1 values(2)',
        'insert into table1 values(3)',
        'insert into table1 values(4)',
        'insert into table1 values(5)'
      ]
      let r: any
      await db.runQueries(qa)
      r = await db.query('select * from table1 order by id')
      expect(r.length).toBe(5)
    })
    it('should stop at invalid script', async () => {
      const qa = [
        'insert into table1 values(1)',
        'insert into table1 values(2)',
        'insert into xxx_t values(3)',
        'insert into table1 values(4)',
        'insert into table1 values(5)'
      ]
      let r: any
      await expectAsync(db.runQueries(qa)).toBeRejected()
      r = await db.query('select * from table1 order by id')
      expect(r.length).toBe(2)
    })
  })

})
