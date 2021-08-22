import { Config, configFrom } from '../config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = configFrom('config/app-test.json')
    db = DB.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('query', () => {
    it('case 1, there are results', async () => {
      const r = await db.query('select * from (select 1 as id) dummy where id = 1')
      expect(r[0].id).toBe(1)
    })
    it('case 2, there is no result', async () => {
      const r = await db.query('select * from (select 1 as id) dummy where id = 2')
      expect(r.length).toBe(0)
    })
    it('fails if sql invalid', async () => {
      await expectAsync(db.query('select xxx')).toBeRejected()
    })
  })

})
