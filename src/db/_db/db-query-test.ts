import { configFrom } from '../../_util/config-loader.js'
import { DB } from './db.js'
import { Config } from '../../_type/config.js'

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
    it('when there is something', async () => {
      const r = await db.query('select * from (select 1 as id) dummy where id = 1')
      expect(r[0].id).toBe(1)
    })
    it('when there is nothing', async () => {
      const r = await db.query('select * from (select 1 as id) dummy where id = 2')
      expect(r.length).toBe(0)
    })
    it('when sql invalid', async () => {
      await expectAsync(db.query('select xxx')).toBeRejected()
    })
  })

})
